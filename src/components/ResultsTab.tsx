import { useState } from 'react';
import { Match, Team } from '../types';
import { teams } from '../data/teams';
import { getPhaseLabel } from '../data/matches';
import { TeamFlag } from './shared/TeamFlag';

export function ResultsTab({ matches, onUpdateScore, onUpdateTeams, getGroupStandings }: { 
  matches: Match[];
  onUpdateScore: (id: string, h: number, a: number, f: boolean) => void;
  onUpdateTeams: (id: string, h: Team, a: Team) => void;
  getGroupStandings: (g: string) => { team: Team; pts: number; w: number; d: number; l: number; gf: number; ga: number; gd: number }[];
  onSync?: () => Promise<void>;
}) {
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [hScore, setHScore] = useState('0');
  const [aScore, setAScore] = useState('0');
  const [editingTeams, setEditingTeams] = useState<string | null>(null);
  const [selHome, setSelHome] = useState('');
  const [selAway, setSelAway] = useState('');
  const [syncing, setSyncing] = useState(false);
  const friendlyMatches = matches.filter(m => m.phase === 'friendly');
  const hasFriendlies = friendlyMatches.length > 0;
  const [activePhase, setActivePhase] = useState(hasFriendlies ? 'friendlies' : 'groups');

  const saveScore = (id: string, fin: boolean) => { onUpdateScore(id, parseInt(hScore), parseInt(aScore), fin); setEditingMatch(null); };
  const startEditScore = (m: Match) => { setEditingMatch(m.id); setHScore(m.homeScore?.toString()||'0'); setAScore(m.awayScore?.toString()||'0'); };
  const startEditTeams = (m: Match) => { setEditingTeams(m.id); setSelHome(m.homeTeam.code==='TBD'?'':m.homeTeam.code); setSelAway(m.awayTeam.code==='TBD'?'':m.awayTeam.code); };
  const saveTeams = (id: string) => { const h=teams.find(t=>t.code===selHome); const a=teams.find(t=>t.code===selAway); if(h&&a) onUpdateTeams(id,h,a); setEditingTeams(null); };

  const groups = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  const kPhases = ['round32','round16','quarter','semi','third','final'] as Match['phase'][];
  const pTabs = [
    ...(hasFriendlies ? [{id:'friendlies',label:'🤝 Amistosos'}] : []),
    {id:'groups',label:'Grupos'},{id:'standings',label:'Classificação'},
    {id:'round32',label:'Fase 32'},{id:'round16',label:'Oitavas'},
    {id:'quarter',label:'Quartas'},{id:'semi',label:'Semi'},{id:'finals',label:'Finais'},
  ];

  const renderMatchRow = (match: Match) => {
    const isTBD = match.homeTeam.code==='TBD';
    if (editingMatch===match.id) return (
      <div className="flex flex-col md:flex-row md:items-center gap-3 p-2 rounded-xl border-2 border-green-300 bg-green-50">
        <div className="flex items-center gap-2 flex-1">
          <TeamFlag team={match.homeTeam} size="xs" /><span className="font-semibold text-xs">{match.homeTeam.code}</span>
          <input type="number" min="0" value={hScore} onChange={e=>setHScore(e.target.value)} className="w-14 text-center input-field py-1 text-sm" />
          <span className="text-gray-400">x</span>
          <input type="number" min="0" value={aScore} onChange={e=>setAScore(e.target.value)} className="w-14 text-center input-field py-1 text-sm" />
          <span className="font-semibold text-xs">{match.awayTeam.code}</span><TeamFlag team={match.awayTeam} size="xs" />
        </div>
        <div className="flex gap-2">
          <button onClick={()=>saveScore(match.id,false)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs">Salvar</button>
          <button onClick={()=>saveScore(match.id,true)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs">Finalizar</button>
          <button onClick={()=>setEditingMatch(null)} className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-xs">×</button>
        </div>
      </div>
    );
    return (
      <div className={`p-2 rounded-xl border-2 ${match.finished?'bg-gray-50 border-gray-200':isTBD?'bg-gray-50 border-dashed border-gray-300':'bg-white border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TeamFlag team={match.homeTeam} size="xs" />
            <span className="font-semibold text-xs w-8">{match.homeTeam.code}</span>
            {match.homeScore!==undefined?(
              <span className="font-bold text-sm md:text-base">{match.homeScore} x {match.awayScore}</span>
            ):(
              <span className="text-gray-400 text-xs">{new Date(match.date+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})} {match.time}</span>
            )}
            <span className="font-semibold text-xs w-8 text-right">{match.awayTeam.code}</span>
            <TeamFlag team={match.awayTeam} size="xs" />
          </div>
          <div className="flex items-center gap-1">
            {match.finished&&<span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">✓</span>}
            {!isTBD&&<button onClick={()=>startEditScore(match)} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-200">✏️</button>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-red-50 to-yellow-50 border-2 border-red-200 p-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h2 className="text-sm md:text-lg font-bold text-gray-800">Resultados das Partidas</h2>
            <p className="text-xs text-gray-600">Apenas você pode definir resultados e seleções do mata-mata.</p>
          </div>
        </div>
        {onSync && (
          <button 
            onClick={async () => { setSyncing(true); try { await onSync(); } finally { setSyncing(false); } }} 
            disabled={syncing} 
            className={`btn-primary text-xs py-2 flex items-center gap-2 ${syncing ? 'opacity-50' : ''}`}
          >
            {syncing ? <span className="animate-spin">🔄</span> : '📡'} {syncing ? 'Sincronizando...' : 'Sincronizar Resultados'}
          </button>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {pTabs.map(p=>(
          <button key={p.id} onClick={()=>setActivePhase(p.id)}
            className={`px-2 md:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${activePhase===p.id?'bg-green-600 text-white':'bg-white text-gray-600 hover:bg-gray-50'}`}
          >{p.label}</button>
        ))}
      </div>

      {/* Amistosos */}
      {activePhase==='friendlies'&& friendlyMatches.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🤝</span>
            <h3 className="font-bold text-gray-600 text-sm">Amistosos Pré-Copa</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Não contam para classificação</span>
          </div>
          <div className="space-y-2">{friendlyMatches.map(m=><div key={m.id}>{renderMatchRow(m)}</div>)}</div>
        </div>
      )}

      {/* Classificação */}
      {activePhase==='standings'&&(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {groups.map(g=>{
            const st=getGroupStandings(g); if(!st.length) return null;
            return (
              <div key={g} className="card p-3">
                <h3 className="font-bold text-gray-700 mb-2 text-sm">Grupo {g}</h3>
                <table className="w-full text-xs">
                  <thead><tr className="border-b text-gray-500">
                    <th className="text-left py-1 w-5">#</th><th className="text-left py-1">Sel</th>
                    <th className="text-center py-1">P</th><th className="text-center py-1">V</th>
                    <th className="text-center py-1">E</th><th className="text-center py-1">D</th>
                    <th className="text-center py-1">SG</th>
                  </tr></thead>
                  <tbody>{st.map((s,i)=>(
                    <tr key={s.team.id} className={`border-b border-gray-100 ${i<2?'bg-green-50':i===2?'bg-yellow-50':''}`}>
                      <td className="py-1 font-bold text-gray-400">{i+1}</td>
                      <td className="py-1 flex items-center gap-1"><TeamFlag team={s.team} size="xs" /> <span className="font-semibold">{s.team.code}</span></td>
                      <td className="py-1 text-center font-bold">{s.pts}</td>
                      <td className="py-1 text-center">{s.w}</td><td className="py-1 text-center">{s.d}</td>
                      <td className="py-1 text-center">{s.l}</td>
                      <td className="py-1 text-center">{s.gd>0?`+${s.gd}`:s.gd}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {/* Grupos */}
      {activePhase==='groups'&&groups.map(g=>{
        const gm=matches.filter(m=>m.group===g); if(!gm.length) return null;
        return (
          <div key={g} className="card">
            <h3 className="font-bold text-gray-600 mb-3 text-sm">Grupo {g}</h3>
            <div className="space-y-2">{gm.map(m=><div key={m.id}>{renderMatchRow(m)}</div>)}</div>
          </div>
        );
      })}

      {/* Mata-Mata */}
      {kPhases.filter(p=>activePhase===p||(activePhase==='finals'&&(p==='third'||p==='final'))).map(phase=>{
        const pm=matches.filter(m=>m.phase===phase); if(!pm.length) return null;
        return (
          <div key={phase} className="card">
            <h3 className="font-bold text-gray-600 mb-3 text-sm">{getPhaseLabel(phase)}</h3>
            <div className="space-y-2">{pm.map(match=>(
              <div key={match.id}>
                {editingTeams===match.id?(
                  <div className="p-3 rounded-xl border-2 border-blue-300 bg-blue-50 space-y-2">
                    <div className="text-xs font-semibold text-blue-700">Definir Seleções:</div>
                    <div className="flex flex-col md:flex-row items-center gap-2">
                      <select value={selHome} onChange={e=>setSelHome(e.target.value)} className="input-field py-1 text-sm flex-1">
                        <option value="">Mandante...</option>
                        {teams.map(t=><option key={t.id} value={t.code}>{t.flag} {t.name}</option>)}
                      </select>
                      <span className="font-bold text-gray-400 text-xs">VS</span>
                      <select value={selAway} onChange={e=>setSelAway(e.target.value)} className="input-field py-1 text-sm flex-1">
                        <option value="">Visitante...</option>
                        {teams.map(t=><option key={t.id} value={t.code}>{t.flag} {t.name}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>saveTeams(match.id)} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs">Salvar</button>
                      <button onClick={()=>setEditingTeams(null)} className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-xs">Cancelar</button>
                    </div>
                  </div>
                ):(
                  <div>
                    {renderMatchRow(match)}
                    <button onClick={()=>startEditTeams(match)}
                      className={`mt-1 text-xs ml-2 ${match.homeTeam.code==='TBD'?'text-blue-600 hover:text-blue-800 font-semibold':'text-gray-400 hover:text-gray-600'}`}>
                      ✏️ {match.homeTeam.code==='TBD'?'Definir seleções':'Editar seleções'}
                    </button>
                  </div>
                )}
              </div>
            ))}</div>
          </div>
        );
      })}
    </div>
  );
}
