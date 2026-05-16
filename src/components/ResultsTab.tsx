import { useState } from 'react';
import { Match, Team } from '../types';
import { teams } from '../data/teams';
import { getPhaseLabel } from '../data/matches';
import { TeamFlag } from './shared/TeamFlag';

export function ResultsTab({ matches, onUpdateScore, onUpdateTeams, getGroupStandings, onSync, apiKey, setApiKey, seedMatches }: { 
  matches: Match[];
  onUpdateScore: (id: string, h: number, a: number, f: boolean) => void;
  onUpdateTeams: (id: string, h: Team, a: Team) => void;
  getGroupStandings: (g: string) => { team: Team; pts: number; w: number; d: number; l: number; gf: number; ga: number; gd: number }[];
  onSync?: () => Promise<void>;
  seedMatches?: () => Promise<void>;
  apiKey?: string;
  setApiKey?: (val: string) => void;
}) {
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [hScore, setHScore] = useState('0');
  const [aScore, setAScore] = useState('0');
  const [editingTeams, setEditingTeams] = useState<string | null>(null);
  const [selHome, setSelHome] = useState('');
  const [selAway, setSelAway] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const friendlyMatches = matches.filter(m => m.phase === 'friendly');
  const hasFriendlies = friendlyMatches.length > 0;
  const [activePhase, setActivePhase] = useState(hasFriendlies ? 'friendlies' : 'groups');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
// ... (resto da lógica de saveScore etc continua igual)

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

  // Extrair datas únicas dos jogos para o filtro
  const phaseMatches = matches.filter(m => m.phase === activePhase || (activePhase === 'finals' && ['third', 'final'].includes(m.phase)));
  const uniqueDates = Array.from(new Set(phaseMatches.map(m => m.date))).sort();
  const filteredMatches = selectedDate ? phaseMatches.filter(m => m.date === selectedDate) : phaseMatches;

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
      <div className="card bg-gradient-to-r from-red-50 to-yellow-50 border-2 border-red-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📡</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Sincronização de Dados</h2>
              <p className="text-xs text-gray-600">Busque resultados oficiais da API-Football (v3).</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {setApiKey && (
              <div className="relative">
                <input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                  placeholder="Cole sua API Key aqui..." 
                  className="input-field text-xs py-2 w-full sm:w-64 pr-8"
                />
                {apiKey && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500">✓</span>}
              </div>
            )}
            
            {onSync && (
              <button 
                onClick={async () => { 
                  console.log('Botão de sincronização clicado!');
                  setSyncing(true); 
                  try { await onSync(); } finally { setSyncing(false); } 
                }} 
                disabled={syncing || seeding} 
                className={`btn-primary text-xs py-2 flex items-center justify-center gap-2 px-6 ${syncing ? 'opacity-50 cursor-wait' : ''}`}
              >
                {syncing ? <span className="animate-spin text-lg">🔄</span> : <span className="text-lg text-white">⚡</span>} 
                {syncing ? 'Sincronizando...' : 'Sincronizar API'}
              </button>
            )}

            {seedMatches && (
              <button 
                onClick={async () => { 
                  if(confirm('Gerar tabela oficial de 2026? Isso vai encher o banco de dados com os jogos reais.')) {
                    setSeeding(true);
                    try { await seedMatches(); } finally { setSeeding(false); }
                  }
                }} 
                disabled={syncing || seeding} 
                className={`bg-blue-600 text-white text-xs py-2 flex items-center justify-center gap-2 px-6 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all ${seeding ? 'opacity-50 cursor-wait' : ''}`}
              >
                {seeding ? <span className="animate-spin text-lg">🔄</span> : <span className="text-lg">⭐</span>} 
                {seeding ? 'Gerando...' : 'Gerar Tabela 2026'}
              </button>
            )}
          </div>
        </div>
        {!apiKey && <p className="text-[10px] text-red-500 mt-2 text-right">⚠️ API Key obrigatória para o botão amarelo.</p>}
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {pTabs.map(p=>(
          <button key={p.id} onClick={()=>{setActivePhase(p.id); setSelectedDate(null);}}
            className={`px-2 md:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${activePhase===p.id?'bg-green-600 text-white':'bg-white text-gray-600 hover:bg-gray-50'}`}
          >{p.label}</button>
        ))}
      </div>

      {activePhase !== 'standings' && uniqueDates.length > 0 && (
        <div className="flex flex-col gap-2 p-3 bg-white/50 rounded-2xl border border-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">
            <span>📅 Filtrar por dia</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button 
              onClick={() => setSelectedDate(null)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedDate === null ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
            >
              Ver Tudo
            </button>
            {uniqueDates.map(date => {
              const [y, m, d] = date.split('-');
              return (
                <button 
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedDate === date ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
                >
                  {`${d}/${m}`}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Amistosos */}
      {activePhase==='friendlies'&& friendlyMatches.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🤝</span>
            <h3 className="font-bold text-gray-600 text-sm">Amistosos Pré-Copa</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Não contam para classificação</span>
          </div>
          <div className="space-y-2">{filteredMatches.map(m=><div key={m.id}>{renderMatchRow(m)}</div>)}</div>
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
        const gm=filteredMatches.filter(m=>m.group===g); if(!gm.length) return null;
        return (
          <div key={g} className="card">
            <h3 className="font-bold text-gray-600 mb-3 text-sm">Grupo {g}</h3>
            <div className="space-y-2">{gm.map(m=><div key={m.id}>{renderMatchRow(m)}</div>)}</div>
          </div>
        );
      })}

      {/* Mata-Mata */}
      {kPhases.filter(p=>activePhase===p||(activePhase==='finals'&&(p==='third'||p==='final'))).map(phase=>{
        const pm=filteredMatches.filter(m=>m.phase===phase); if(!pm.length) return null;
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
