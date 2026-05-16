import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Match, Team } from '../types';
import { matches as initialMatches } from '../data/matches';
import { teams } from '../data/teams';
import { fetchWorldCupResults } from '../services/apiFootball';

interface MatchesContextType {
  matches: Match[];
  updateMatchScore: (matchId: string, homeScore: number, awayScore: number, finished: boolean) => void;
  updateMatchTeams: (matchId: string, homeTeam: Team, awayTeam: Team) => void;
  updateMatchDetails: (matchId: string, updates: Partial<Match>) => void;
  getGroupStandings: (group: string) => { team: Team; pts: number; w: number; d: number; l: number; gf: number; ga: number; gd: number }[];
  syncMatches: (apiKey: string) => Promise<void>;
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return fallback;
}

export function MatchesProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>(
    () => loadFromStorage('bolao_matches', initialMatches)
  );

  useEffect(() => {
    // Patch para restaurar o campo ISO caso os dados do localStorage estejam desatualizados
    const patchedMatches = matches.map(match => {
      let changed = false;
      const homeTeam = { ...match.homeTeam };
      const awayTeam = { ...match.awayTeam };

      if (!homeTeam.iso && homeTeam.id !== 'tbd') {
        const master = teams.find(t => t.id === homeTeam.id || t.code === homeTeam.code);
        if (master?.iso) { homeTeam.iso = master.iso; changed = true; }
      }
      if (!awayTeam.iso && awayTeam.id !== 'tbd') {
        const master = teams.find(t => t.id === awayTeam.id || t.code === awayTeam.code);
        if (master?.iso) { awayTeam.iso = master.iso; changed = true; }
      }

      return changed ? { ...match, homeTeam, awayTeam } : match;
    });

    const hasChanges = patchedMatches.some((m, i) => m !== matches[i]);
    if (hasChanges) setMatches(patchedMatches);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    localStorage.setItem('bolao_matches', JSON.stringify(matches));
  }, [matches]);

  const updateMatchScore = (matchId: string, homeScore: number, awayScore: number, finished: boolean) => {
    setMatches(prev => prev.map(m => 
      m.id === matchId 
        ? { ...m, homeScore, awayScore, finished }
        : m
    ));
  };

  const updateMatchTeams = (matchId: string, homeTeam: Team, awayTeam: Team) => {
    setMatches(prev => prev.map(m => 
      m.id === matchId ? { ...m, homeTeam, awayTeam } : m
    ));
  };

  const updateMatchDetails = (matchId: string, updates: Partial<Match>) => {
    setMatches(prev => prev.map(m => 
      m.id === matchId ? { ...m, ...updates } : m
    ));
  };

  const getGroupStandings = (group: string) => {
    const groupMatches = matches.filter(m => m.group === group && m.finished && m.homeScore !== undefined);
    const groupTeams = matches
      .filter(m => m.group === group)
      .flatMap(m => [m.homeTeam, m.awayTeam])
      .filter((t, i, arr) => t.code !== 'TBD' && arr.findIndex(x => x.id === t.id) === i);

    const standings = groupTeams.map(team => {
      let pts = 0, w = 0, d = 0, l = 0, gf = 0, ga = 0;
      
      groupMatches.forEach(match => {
        if (match.homeTeam.id === team.id) {
          gf += match.homeScore!;
          ga += match.awayScore!;
          if (match.homeScore! > match.awayScore!) { w++; pts += 3; }
          else if (match.homeScore! === match.awayScore!) { d++; pts += 1; }
          else { l++; }
        } else if (match.awayTeam.id === team.id) {
          gf += match.awayScore!;
          ga += match.homeScore!;
          if (match.awayScore! > match.homeScore!) { w++; pts += 3; }
          else if (match.awayScore! === match.homeScore!) { d++; pts += 1; }
          else { l++; }
        }
      });

      return { team, pts, w, d, l, gf, ga, gd: gf - ga };
    });

    return standings.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  };

  const syncMatches = async (apiKey: string) => {
    const lastSyncStr = localStorage.getItem('bolao_last_sync');
    const now = Date.now();
    
    if (lastSyncStr) {
      const diff = now - parseInt(lastSyncStr);
      if (diff < 15 * 60 * 1000) {
        const remaining = Math.ceil((15 * 60 * 1000 - diff) / 60000);
        throw new Error(`Aguarde ${remaining} minutos para sincronizar novamente.`);
      }
    }

    const apiResults = await fetchWorldCupResults(apiKey);
    
    setMatches(prev => prev.map(match => {
      const apiMatch = apiResults.find(am => 
        (match.externalId && am.fixture.id === match.externalId) ||
        (am.teams.home.name.toLowerCase().includes(match.homeTeam.name.toLowerCase()) && 
         am.teams.away.name.toLowerCase().includes(match.awayTeam.name.toLowerCase()))
      );

      if (apiMatch && apiMatch.goals.home !== null && apiMatch.goals.away !== null) {
        const isFinished = ['FT', 'AET', 'PEN'].includes(apiMatch.fixture.status.short);
        return {
          ...match,
          homeScore: apiMatch.goals.home,
          awayScore: apiMatch.goals.away,
          finished: isFinished,
          externalId: apiMatch.fixture.id
        };
      }
      return match;
    }));

    localStorage.setItem('bolao_last_sync', now.toString());
  };

  return (
    <MatchesContext.Provider value={{
      matches,
      updateMatchScore,
      updateMatchTeams,
      updateMatchDetails,
      getGroupStandings,
      syncMatches
    }}>
      {children}
    </MatchesContext.Provider>
  );
}

export function useMatches() {
  const context = useContext(MatchesContext);
  if (context === undefined) {
    throw new Error('useMatches must be used within a MatchesProvider');
  }
  return context;
}
