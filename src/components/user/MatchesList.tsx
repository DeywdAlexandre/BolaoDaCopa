import { useState } from 'react';
import { Match, Team } from '../../types';
import { getPhaseLabel } from '../../data/matches';
import { TeamFlag } from '../shared/TeamFlag';

type SubTab = 'friendlies' | 'groups' | 'standings' | 'round32' | 'round16' | 'quarter' | 'semi' | 'finals';

export function MatchesList({ matches, getGroupStandings }: { 
  matches: Match[];
  getGroupStandings: (g: string) => { team: Team; pts: number; w: number; d: number; l: number; gf: number; ga: number; gd: number }[];
}) {
  const friendlyMatches = matches.filter(m => m.phase === 'friendly');
  const hasFriendlies = friendlyMatches.length > 0;
  const [activeSubTab, setActiveSubTab] = useState<SubTab>(hasFriendlies ? 'friendlies' : 'groups');

  const groups = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  const knockoutPhases = ['round32','round16','quarter','semi','third','final'] as Match['phase'][];

  const subTabs: { id: SubTab; label: string }[] = [
    ...(hasFriendlies ? [{ id: 'friendlies' as SubTab, label: '🤝 Amistosos' }] : []),
    { id: 'groups', label: '📋 Grupos' },
    { id: 'standings', label: '🏅 Classificação' },
    { id: 'round32', label: 'Fase 32' },
    { id: 'round16', label: 'Oitavas' },
    { id: 'quarter', label: 'Quartas' },
    { id: 'semi', label: 'Semi' },
    { id: 'finals', label: '🏆 Finais' },
  ];

  const renderMatchRow = (match: Match) => {
    const isTBD = match.homeTeam.code === 'TBD' || match.awayTeam.code === 'TBD';
    return (
      <div key={match.id} className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl ${
        match.finished ? 'bg-gray-100' : isTBD ? 'bg-gray-50 border border-dashed border-gray-300' : 'bg-white border border-gray-100'
      }`}>
        <div className="flex items-center gap-1.5 md:gap-2 flex-1 min-w-0">
          <TeamFlag team={match.homeTeam} size="sm" />
          <span className="font-semibold text-xs md:text-sm truncate hidden sm:inline">{match.homeTeam.name}</span>
          <span className="font-semibold text-xs md:text-sm sm:hidden">{match.homeTeam.code}</span>
        </div>
        {match.homeScore !== undefined ? (
          <div className={`font-bold text-base md:text-lg px-1 md:px-3 shrink-0 ${match.finished ? 'text-gray-800' : 'text-green-600'}`}>
            {match.homeScore} - {match.awayScore}
          </div>
        ) : (
          <div className="text-xs md:text-sm text-gray-400 px-1 md:px-3 shrink-0">{match.time}</div>
        )}
        <div className="flex items-center gap-1.5 md:gap-2 flex-1 justify-end min-w-0">
          <span className="font-semibold text-xs md:text-sm truncate text-right hidden sm:inline">{match.awayTeam.name}</span>
          <span className="font-semibold text-xs md:text-sm sm:hidden">{match.awayTeam.code}</span>
          <TeamFlag team={match.awayTeam} size="sm" />
        </div>
        <div className="text-xs text-gray-400 w-12 md:w-20 text-right shrink-0">
          {new Date(match.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>⚽</span> Copa do Mundo 2026
        </h2>

        {/* Sub-tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {subTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-2 md:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeSubTab === tab.id
                  ? 'bg-green-600 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* === AMISTOSOS === */}
      {activeSubTab === 'friendlies' && (
        <div className="space-y-4">
          <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 p-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤝</span>
              <div>
                <h3 className="font-bold text-gray-800 text-sm md:text-base">Amistosos Pré-Copa</h3>
                <p className="text-xs text-gray-600">Jogos preparatórios — não contam para classificação da Copa, mas os bolões valem normalmente!</p>
              </div>
            </div>
          </div>
          <div className="card">
            <h3 className="font-bold text-gray-600 mb-3 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Amistosos Internacionais
            </h3>
            <div className="space-y-2">
              {friendlyMatches.map(match => renderMatchRow(match))}
            </div>
          </div>
        </div>
      )}

      {/* === CLASSIFICAÇÃO === */}
      {activeSubTab === 'standings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {groups.map(g => {
            const standings = getGroupStandings(g);
            if (standings.length === 0) return null;

            return (
              <div key={g} className="card p-3">
                <h3 className="font-bold text-gray-700 mb-2 text-sm">Grupo {g}</h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-500">
                      <th className="text-left py-1 w-5">#</th>
                      <th className="text-left py-1">Seleção</th>
                      <th className="text-center py-1">J</th>
                      <th className="text-center py-1">P</th>
                      <th className="text-center py-1">V</th>
                      <th className="text-center py-1">E</th>
                      <th className="text-center py-1">D</th>
                      <th className="text-center py-1">GP</th>
                      <th className="text-center py-1">GC</th>
                      <th className="text-center py-1">SG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((s, i) => (
                      <tr
                        key={s.team.id}
                        className={`border-b border-gray-100 ${
                          i < 2 ? 'bg-green-50' : i === 2 ? 'bg-yellow-50' : ''
                        }`}
                      >
                        <td className="py-1.5 font-bold text-gray-400">{i + 1}</td>
                        <td className="py-1.5">
                          <div className="flex items-center gap-1">
                            <TeamFlag team={s.team} size="xs" />
                            <span className="font-semibold">{s.team.code}</span>
                          </div>
                        </td>
                        <td className="py-1.5 text-center">{s.w + s.d + s.l}</td>
                        <td className="py-1.5 text-center font-bold text-green-700">{s.pts}</td>
                        <td className="py-1.5 text-center">{s.w}</td>
                        <td className="py-1.5 text-center">{s.d}</td>
                        <td className="py-1.5 text-center">{s.l}</td>
                        <td className="py-1.5 text-center">{s.gf}</td>
                        <td className="py-1.5 text-center">{s.ga}</td>
                        <td className="py-1.5 text-center font-semibold">
                          {s.gd > 0 ? `+${s.gd}` : s.gd}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-xs text-gray-400 mt-2 flex gap-3">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-300 rounded"></span> Classificado
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-yellow-300 rounded"></span> 3º lugar
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === GRUPOS === */}
      {activeSubTab === 'groups' && groups.map(g => {
        const groupMatches = matches.filter(m => m.group === g);
        if (groupMatches.length === 0) return null;
        return (
          <div key={g} className="card">
            <h3 className="font-bold text-gray-600 mb-3 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Grupo {g}
            </h3>
            <div className="space-y-2">
              {groupMatches.map(match => renderMatchRow(match))}
            </div>
          </div>
        );
      })}

      {/* === MATA-MATA === */}
      {knockoutPhases.filter(p =>
        activeSubTab === p ||
        (activeSubTab === 'finals' && (p === 'third' || p === 'final'))
      ).map(phase => {
        const phaseMatches = matches.filter(m => m.phase === phase);
        if (phaseMatches.length === 0) return null;
        return (
          <div key={phase} className="card">
            <h3 className="font-bold text-gray-600 mb-3 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {getPhaseLabel(phase)}
            </h3>
            <div className="space-y-2">
              {phaseMatches.map(match => renderMatchRow(match))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
