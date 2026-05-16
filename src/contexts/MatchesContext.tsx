import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Match, Team } from '../types';
import { fetchWorldCupResults } from '../services/apiFootball';
import { supabase } from '../lib/supabase';
import { generateInitialMatches } from '../data/seed2026';

interface MatchesContextType {
  matches: Match[];
  isLoading: boolean;
  syncMatches: (apiKey: string) => Promise<void>;
  seedMatches: () => Promise<void>;
  updateMatchScore: (matchId: string, homeScore: number, awayScore: number, finished: boolean) => Promise<void>;
  updateMatchTeams: (matchId: string, homeTeam: Team, awayTeam: Team) => Promise<void>;
  getMatch: (id: string) => Match | undefined;
  getGroupStandings: (group: string) => { team: Team; pts: number; w: number; d: number; l: number; gf: number; ga: number; gd: number }[];
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export function MatchesProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      if (data) {
        const formatted: Match[] = data.map(m => ({
          id: m.id,
          externalId: m.external_id,
          date: m.date,
          time: m.time,
          homeTeam: { id: (m.home_team_code || 'TBD').toLowerCase(), name: m.home_team_name, code: m.home_team_code, iso: m.home_team_flag } as Team,
          awayTeam: { id: (m.away_team_code || 'TBD').toLowerCase(), name: m.away_team_name, code: m.away_team_code, iso: m.away_team_flag } as Team,
          homeScore: m.home_score !== null ? m.home_score : undefined,
          awayScore: m.away_score !== null ? m.away_score : undefined,
          phase: m.phase as any,
          group: m.group || undefined,
          finished: m.finished
        }));
        setMatches(formatted);
      }
    } catch (err) {
      console.error('Erro ao buscar partidas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const syncMatches = async (apiKey: string) => {
    try {
      console.log('Iniciando sincronização com API Key:', apiKey.substring(0, 5) + '...');
      const apiResults = await fetchWorldCupResults(apiKey);
      console.log(`Recebidos ${apiResults.length} jogos da API.`);
      
      for (const res of apiResults) {
        const isFinished = ['FT', 'AET', 'PEN'].includes(res.fixture.status.short);
        const matchDate = res.fixture.date ? res.fixture.date.split('T')[0] : new Date().toISOString().split('T')[0];
        const matchTime = res.fixture.date ? res.fixture.date.split('T')[1].substring(0, 5) : '00:00';

        const { error: upsertError } = await supabase
          .from('matches')
          .upsert({
            external_id: res.fixture.id,
            date: matchDate,
            time: matchTime,
            home_team_name: res.teams.home.name,
            home_team_code: res.teams.home.name.substring(0, 3).toUpperCase(),
            away_team_name: res.teams.away.name,
            away_team_code: res.teams.away.name.substring(0, 3).toUpperCase(),
            home_score: res.goals.home,
            away_score: res.goals.away,
            phase: 'group', 
            finished: isFinished,
            updated_at: new Date().toISOString()
          }, { onConflict: 'external_id' });

        if (upsertError) {
          console.error(`Erro ao salvar jogo ${res.fixture.id}:`, upsertError);
        }
      }

      console.log('Sincronização concluída no Supabase. Recarregando estado local...');
      await fetchMatches();
    } catch (err: any) {
      console.error('Erro detalhado na sincronização:', err);
      throw err;
    }
  };

  const seedMatches = async () => {
    try {
      console.log('Gerando tabela da Copa 2026...');
      const initialMatches = generateInitialMatches();
      
      for (const m of initialMatches) {
        const { error: upsertError } = await supabase
          .from('matches')
          .upsert({
            external_id: m.external_id,
            date: m.date,
            time: m.time,
            home_team_name: m.homeTeam?.name,
            home_team_code: m.homeTeam?.code,
            home_team_flag: m.homeTeam?.iso,
            away_team_name: m.awayTeam?.name,
            away_team_code: m.awayTeam?.code,
            away_team_flag: m.awayTeam?.iso,
            home_score: null,
            away_score: null,
            group: m.group,
            phase: m.phase,
            finished: false,
            updated_at: new Date().toISOString()
          }, { onConflict: 'external_id' });

        if (upsertError) {
          console.error(`Erro ao salvar jogo ${m.external_id}:`, upsertError);
        }
      }

      await fetchMatches();
      console.log('Tabela gerada com sucesso!');
    } catch (err) {
      console.error('Erro ao gerar tabela:', err);
      throw err;
    }
  };

  const updateMatchScore = async (matchId: string, homeScore: number, awayScore: number, finished: boolean) => {
    const { error } = await supabase
      .from('matches')
      .update({ home_score: homeScore, away_score: awayScore, finished })
      .eq('id', matchId);

    if (error) throw error;
    await fetchMatches();
  };

  const updateMatchTeams = async (matchId: string, homeTeam: Team, awayTeam: Team) => {
    const { error } = await supabase
      .from('matches')
      .update({
        home_team_name: homeTeam.name,
        home_team_code: homeTeam.code,
        home_team_flag: homeTeam.iso,
        away_team_name: awayTeam.name,
        away_team_code: awayTeam.code,
        away_team_flag: awayTeam.iso
      })
      .eq('id', matchId);

    if (error) throw error;
    await fetchMatches();
  };

  const getMatch = (id: string) => matches.find(m => m.id === id);

  const getGroupStandings = (group: string) => {
    const groupMatches = matches.filter(m => m.group === group && m.finished && m.homeScore !== undefined);
    const groupTeams = matches
      .filter(m => m.group === group)
      .flatMap(m => [m.homeTeam, m.awayTeam])
      .filter((t, i, arr) => t.code !== 'TBD' && arr.findIndex(x => x.code === t.code) === i);

    const standings = groupTeams.map(team => {
      let pts = 0, w = 0, d = 0, l = 0, gf = 0, ga = 0;
      groupMatches.forEach(match => {
        if (match.homeTeam.code === team.code) {
          gf += match.homeScore!; ga += match.awayScore!;
          if (match.homeScore! > match.awayScore!) { w++; pts += 3; }
          else if (match.homeScore! === match.awayScore!) { d++; pts += 1; }
          else l++;
        } else if (match.awayTeam.code === team.code) {
          gf += match.awayScore!; ga += match.homeScore!;
          if (match.awayScore! > match.homeScore!) { w++; pts += 3; }
          else if (match.awayScore! === match.homeScore!) { d++; pts += 1; }
          else l++;
        }
      });
      return { team, pts, w, d, l, gf, ga, gd: gf - ga };
    });

    return standings.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  };

  return (
    <MatchesContext.Provider value={{ matches, isLoading, syncMatches, seedMatches, updateMatchScore, updateMatchTeams, getMatch, getGroupStandings }}>
      {children}
    </MatchesContext.Provider>
  );
}

export function useMatches() {
  const context = useContext(MatchesContext);
  if (context === undefined) throw new Error('useMatches must be used within a MatchesProvider');
  return context;
}
