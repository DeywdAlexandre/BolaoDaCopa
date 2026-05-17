import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Match, Team } from '../types';
import { fetchWorldCupResults } from '../services/apiFootball';
import { supabase } from '../lib/supabase';
import { matches as staticMatches } from '../data/matches';

interface MatchesContextType {
  matches: Match[];
  isLoading: boolean;
  syncMatches: (apiKey: string) => Promise<void>;
  seedMatches: () => Promise<void>;
  updateMatchScore: (matchId: string, homeScore: number, awayScore: number, finished: boolean) => Promise<void>;
  updateMatchTeams: (matchId: string, homeTeam: Team, awayTeam: Team) => Promise<void>;
  updateMatchDetails: (
    matchId: string,
    homeScore: number | null,
    awayScore: number | null,
    finished: boolean,
    date: string,
    time: string,
    stadium: string,
    city: string
  ) => Promise<void>;
  createCustomMatch: (
    homeTeamName: string,
    homeTeamCode: string,
    homeTeamFlag: string,
    awayTeamName: string,
    awayTeamCode: string,
    awayTeamFlag: string,
    date: string,
    time: string,
    stadium: string,
    city: string
  ) => Promise<void>;
  deleteMatch: (matchId: string) => Promise<void>;
  getMatch: (id: string) => Match | undefined;
  getGroupStandings: (group: string) => { team: Team; pts: number; w: number; d: number; l: number; gf: number; ga: number; gd: number }[];
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode === 'TBD' || countryCode.length !== 2) return '🏳️';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🏳️';
  }
}

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
          homeTeam: { 
            id: (m.home_team_code || 'TBD').toLowerCase(), 
            name: m.home_team_name, 
            code: m.home_team_code, 
            iso: m.home_team_flag,
            flag: getFlagEmoji(m.home_team_flag)
          } as Team,
          awayTeam: { 
            id: (m.away_team_code || 'TBD').toLowerCase(), 
            name: m.away_team_name, 
            code: m.away_team_code, 
            iso: m.away_team_flag,
            flag: getFlagEmoji(m.away_team_flag)
          } as Team,
          homeScore: m.home_score !== null ? m.home_score : undefined,
          awayScore: m.away_score !== null ? m.away_score : undefined,
          stadium: m.stadium || '',
          city: m.city || '',
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
      console.log('Limpando tabela de partidas antiga no Supabase...');
      const { error: deleteError } = await supabase
        .from('matches')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteError) {
        console.error('Erro ao limpar tabela de matches:', deleteError);
        throw deleteError;
      }

      console.log('Gerando tabela da Copa 2026 realista e polida...');
      
      const getNumericExternalId = (id: string, index: number): number => {
        if (id.startsWith('fr_')) {
          return 1000 + parseInt(id.replace('fr_', ''));
        } else if (id.startsWith('g')) {
          const cleanId = id.replace('g', '').replace(/[a-z]/gi, '');
          return 2000 + (parseInt(cleanId) || (index + 1));
        } else if (id.startsWith('r32_')) {
          return 3000 + parseInt(id.replace('r32_', ''));
        } else if (id.startsWith('r16_')) {
          return 4000 + parseInt(id.replace('r16_', ''));
        } else if (id.startsWith('qf_')) {
          return 5000 + parseInt(id.replace('qf_', ''));
        } else if (id.startsWith('sf_')) {
          return 6000 + parseInt(id.replace('sf_', ''));
        } else if (id === 'third') {
          return 7000;
        } else if (id === 'final') {
          return 8000;
        }
        return 9000 + index;
      };

      for (let i = 0; i < staticMatches.length; i++) {
        const m = staticMatches[i];
        const extId = getNumericExternalId(m.id, i);

        const { error: upsertError } = await supabase
          .from('matches')
          .upsert({
            external_id: extId,
            date: m.date,
            time: m.time,
            home_team_name: m.homeTeam.name,
            home_team_code: m.homeTeam.code,
            home_team_flag: m.homeTeam.iso || '',
            away_team_name: m.awayTeam.name,
            away_team_code: m.awayTeam.code,
            away_team_flag: m.awayTeam.iso || '',
            stadium: m.stadium || '',
            city: m.city || '',
            home_score: null,
            away_score: null,
            group: m.group || null,
            phase: m.phase,
            finished: false,
            updated_at: new Date().toISOString()
          }, { onConflict: 'external_id' });

        if (upsertError) {
          console.error(`Erro ao salvar jogo ${m.id} (ext: ${extId}):`, upsertError);
        }
      }

      await fetchMatches();
      console.log('Tabela da Copa 2026 semeada com absoluto sucesso!');
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

  const updateMatchDetails = async (
    matchId: string,
    homeScore: number | null,
    awayScore: number | null,
    finished: boolean,
    date: string,
    time: string,
    stadium: string,
    city: string
  ) => {
    const { error } = await supabase
      .from('matches')
      .update({
        home_score: homeScore,
        away_score: awayScore,
        finished,
        date,
        time,
        stadium,
        city
      })
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

  const createCustomMatch = async (
    homeTeamName: string,
    homeTeamCode: string,
    homeTeamFlag: string,
    awayTeamName: string,
    awayTeamCode: string,
    awayTeamFlag: string,
    date: string,
    time: string,
    stadium: string,
    city: string
  ) => {
    const id = crypto.randomUUID();
    const { error } = await supabase
      .from('matches')
      .insert({
        id,
        date,
        time,
        home_team_name: homeTeamName,
        home_team_code: homeTeamCode.toUpperCase(),
        home_team_flag: homeTeamFlag.toLowerCase(),
        away_team_name: awayTeamName,
        away_team_code: awayTeamCode.toUpperCase(),
        away_team_flag: awayTeamFlag.toLowerCase(),
        stadium,
        city,
        phase: 'custom',
        finished: false
      });

    if (error) throw error;
    await fetchMatches();
  };

  const deleteMatch = async (matchId: string) => {
    const { error } = await supabase
      .from('matches')
      .delete()
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
    <MatchesContext.Provider value={{ matches, isLoading, syncMatches, seedMatches, updateMatchScore, updateMatchDetails, updateMatchTeams, createCustomMatch, deleteMatch, getMatch, getGroupStandings }}>
      {children}
    </MatchesContext.Provider>
  );
}

export function useMatches() {
  const context = useContext(MatchesContext);
  if (context === undefined) throw new Error('useMatches must be used within a MatchesProvider');
  return context;
}
