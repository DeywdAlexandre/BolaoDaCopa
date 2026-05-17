import { useState } from 'react';
import { Match, Team } from '../types';
import { teams } from '../data/teams';
import { getPhaseLabel } from '../data/matches';
import { TeamFlag } from './shared/TeamFlag';

export function ResultsTab({ matches, onUpdateScore, onUpdateDetails, onUpdateTeams, onCreateCustomMatch, onDeleteMatch, getGroupStandings, onSync, apiKey, setApiKey, seedMatches }: { 
  matches: Match[];
  onUpdateScore: (id: string, h: number, a: number, f: boolean) => void;
  onUpdateDetails?: (
    id: string, 
    homeScore: number | null, 
    awayScore: number | null, 
    finished: boolean, 
    date: string, 
    time: string, 
    stadium: string, 
    city: string
  ) => void;
  onUpdateTeams: (id: string, h: Team, a: Team) => void;
  getGroupStandings: (g: string) => { team: Team; pts: number; w: number; d: number; l: number; gf: number; ga: number; gd: number }[];
  onCreateCustomMatch?: (
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
  onDeleteMatch?: (matchId: string) => Promise<void>;
  onSync?: () => Promise<void>;
  seedMatches?: () => Promise<void>;
  apiKey?: string;
  setApiKey?: (val: string) => void;
}) {
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [hScore, setHScore] = useState('0');
  const [aScore, setAScore] = useState('0');
  const [mDate, setMDate] = useState('');
  const [mTime, setMTime] = useState('');
  const [mStadium, setMStadium] = useState('');
  const [mCity, setMCity] = useState('');
  const [editingTeams, setEditingTeams] = useState<string | null>(null);
  const [selHome, setSelHome] = useState('');
  const [selAway, setSelAway] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [seeding, setSeeding] = useState(false);
  
  // Estados para Jogos Avulsos
  const [cHomeName, setCHomeName] = useState('');
  const [cHomeCode, setCHomeCode] = useState('');
  const [cHomeFlag, setCHomeFlag] = useState('br');
  const [cAwayName, setCAwayName] = useState('');
  const [cAwayCode, setCAwayCode] = useState('');
  const [cAwayFlag, setCAwayFlag] = useState('br');
  const [cDate, setCDate] = useState('');
  const [cTime, setCTime] = useState('');
  const [cStadium, setCStadium] = useState('');
  const [cCity, setCCity] = useState('');
  const [creatingMatch, setCreatingMatch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const hasCustom = matches.some(m => m.phase === 'custom');
  const friendlyMatches = matches.filter(m => m.phase === 'friendly');
  const hasFriendlies = friendlyMatches.length > 0;
  const [activePhase, setActivePhase] = useState(hasCustom ? 'custom' : hasFriendlies ? 'friendlies' : 'groups');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const saveMatchDetails = (id: string, fin: boolean) => {
    const homeScoreVal = hScore === '' ? null : parseInt(hScore);
    const awayScoreVal = aScore === '' ? null : parseInt(aScore);
    if (onUpdateDetails) {
      onUpdateDetails(id, homeScoreVal, awayScoreVal, fin, mDate, mTime, mStadium, mCity);
    } else {
      onUpdateScore(id, homeScoreVal || 0, awayScoreVal || 0, fin);
    }
    setEditingMatch(null);
  };

  const startEditScore = (m: Match) => { 
    setEditingMatch(m.id); 
    setHScore(m.homeScore !== undefined ? m.homeScore.toString() : ''); 
    setAScore(m.awayScore !== undefined ? m.awayScore.toString() : ''); 
    setMDate(m.date);
    setMTime(m.time);
    setMStadium(m.stadium || '');
    setMCity(m.city || '');
  };
  const startEditTeams = (m: Match) => { setEditingTeams(m.id); setSelHome(m.homeTeam.code==='TBD'?'':m.homeTeam.code); setSelAway(m.awayTeam.code==='TBD'?'':m.awayTeam.code); };
  const saveTeams = (id: string) => { const h=teams.find(t=>t.code===selHome); const a=teams.find(t=>t.code===selAway); if(h&&a) onUpdateTeams(id,h,a); setEditingTeams(null); };;

  const groups = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  const kPhases = ['round32','round16','quarter','semi','third','final'] as Match['phase'][];
  const pTabs = [
    {id:'custom',label:'⚽ Jogos Avulsos'},
    ...(hasFriendlies ? [{id:'friendlies',label:'🤝 Amistosos'}] : []),
    {id:'groups',label:'Grupos'},{id:'standings',label:'Classificação'},
    {id:'round32',label:'Fase 32'},{id:'round16',label:'Oitavas'},
    {id:'quarter',label:'Quartas'},{id:'semi',label:'Semi'},{id:'finals',label:'Finais'},
  ];

  // Extrair datas únicas dos jogos para o filtro
  const phaseMatches = matches.filter(m => {
    if (activePhase === 'custom') return m.phase === 'custom';
    if (activePhase === 'friendlies') return m.phase === 'friendly';
    if (activePhase === 'groups') return m.phase === 'group';
    if (activePhase === 'finals') return ['third', 'final'].includes(m.phase);
    return m.phase === activePhase;
  });
  const uniqueDates = Array.from(new Set(phaseMatches.map(m => m.date))).sort();
  
  const filteredMatches = phaseMatches.filter(m => {
    const dateMatch = selectedDate ? m.date === selectedDate : true;
    const searchMatch = searchQuery ? (
      m.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.homeTeam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.awayTeam.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true;
    return dateMatch && searchMatch;
  });

  const renderMatchRow = (match: Match) => {
    const isTBD = match.homeTeam.code==='TBD';
    if (editingMatch===match.id) return (
      <div className="flex flex-col gap-3.5 p-4 rounded-2xl border-2 border-green-300 bg-green-50 shadow-sm animate-fade-in-up">
        {/* Placar */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 w-24 justify-end">
            <TeamFlag team={match.homeTeam} size="xs" />
            <span className="font-bold text-xs text-gray-800">{match.homeTeam.code}</span>
          </div>
          <input 
            type="number" 
            min="0" 
            placeholder="-"
            value={hScore} 
            onChange={e=>setHScore(e.target.value)} 
            className="w-14 text-center input-field py-1 text-sm font-bold bg-white" 
          />
          <span className="text-gray-400 font-bold text-xs">x</span>
          <input 
            type="number" 
            min="0" 
            placeholder="-"
            value={aScore} 
            onChange={e=>setAScore(e.target.value)} 
            className="w-14 text-center input-field py-1 text-sm font-bold bg-white" 
          />
          <div className="flex items-center gap-1.5 w-24">
            <span className="font-bold text-xs text-gray-800">{match.awayTeam.code}</span>
            <TeamFlag team={match.awayTeam} size="xs" />
          </div>
        </div>

        {/* Data e Hora */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">📅 Data do Jogo</label>
            <input 
              type="date" 
              value={mDate} 
              onChange={e=>setMDate(e.target.value)} 
              className="input-field text-xs py-1.5 w-full bg-white font-medium" 
            />
          </div>
          <div>
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">🕒 Horário</label>
            <input 
              type="time" 
              value={mTime} 
              onChange={e=>setMTime(e.target.value)} 
              className="input-field text-xs py-1.5 w-full bg-white font-medium" 
            />
          </div>
        </div>

        {/* Local e Estádio */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">🏟️ Estádio</label>
            <input 
              type="text" 
              placeholder="Ex: SoFi Stadium"
              value={mStadium} 
              onChange={e=>setMStadium(e.target.value)} 
              className="input-field text-xs py-1.5 w-full bg-white font-medium" 
            />
          </div>
          <div>
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">📍 Cidade</label>
            <input 
              type="text" 
              placeholder="Ex: Los Angeles"
              value={mCity} 
              onChange={e=>setMCity(e.target.value)} 
              className="input-field text-xs py-1.5 w-full bg-white font-medium" 
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-2 mt-1 pt-2 border-t border-green-100">
          <button onClick={()=>setEditingMatch(null)} className="bg-white/80 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white transition-colors">
            Cancelar
          </button>
          <button onClick={()=>saveMatchDetails(match.id, false)} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            Salvar Detalhes
          </button>
          <button onClick={()=>saveMatchDetails(match.id, true)} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-700 transition-all shadow-md">
            Finalizar
          </button>
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
          <div className="flex items-center gap-1.5">
            {match.finished&&<span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">✓</span>}
            {!isTBD&&<button onClick={()=>startEditScore(match)} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-200">✏️</button>}
            {match.phase === 'custom' && onDeleteMatch && (
              <button 
                onClick={async (e) => {
                  console.log('EXCLUIR JOGO CLICADO! Match:', match.id, 'Teams:', match.homeTeam.name, 'vs', match.awayTeam.name);
                  e.stopPropagation();
                  e.preventDefault();
                  if (confirm(`Deseja mesmo apagar o jogo avulso "${match.homeTeam.name} vs ${match.awayTeam.name}"?`)) {
                    try {
                      await onDeleteMatch(match.id);
                      console.log('Jogo avulso excluído com sucesso do banco de dados!');
                      alert('Jogo avulso excluído com sucesso!');
                    } catch (err: any) {
                      console.error('Erro ao excluir jogo avulso:', err);
                      alert(`Não foi possível excluir o jogo avulso.\nErro: ${err.message || err.details || 'Verifique se existem bolões criados para este jogo antes de apagar.'}`);
                    }
                  }
                }} 
                className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-lg hover:bg-red-200"
              >
                🗑️
              </button>
            )}
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

      {activePhase !== 'standings' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-white/50 rounded-2xl border border-white/50 backdrop-blur-sm">
          {/* Busca por Nome */}
          <div className="flex flex-col gap-1.5 col-span-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1">🔍 Buscar Seleção / Time</span>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ex: Brasil, Flamengo, ARG..."
                value={searchQuery}
                onChange={e=>setSearchQuery(e.target.value)}
                className="input-field text-xs py-2 w-full pr-8 font-semibold bg-white"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                  style={{ top: '50%' }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Filtro de Dia */}
          {uniqueDates.length > 0 ? (
            <div className="flex flex-col gap-1.5 col-span-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">📅 Filtrar por dia</span>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button 
                  onClick={() => setSelectedDate(null)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedDate === null ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
                >
                  Ver Tudo
                </button>
                {uniqueDates.map(date => {
                  const [, m, d] = date.split('-');
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
          ) : (
            <div className="col-span-2 flex items-center justify-center">
              <p className="text-[10px] text-gray-400 italic">Nenhum dia disponível para esta fase.</p>
            </div>
          )}
        </div>
      )}

      {/* Jogos Avulsos */}
      {activePhase==='custom' && (
        <div className="space-y-4 animate-fade-in-up">
          {onCreateCustomMatch && (
            <div className="card border-2 border-dashed border-blue-200 bg-blue-50/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⚽</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">Criar Jogo Avulso</h3>
                  <p className="text-[10px] text-gray-500">Crie confrontos personalizados (ex: Flamengo x Palmeiras) para seus amigos palpitarem!</p>
                </div>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!cHomeName || !cHomeCode || !cAwayName || !cAwayCode || !cDate || !cTime) {
                  alert('Por favor, preencha todos os campos obrigatórios!');
                  return;
                }
                setCreatingMatch(true);
                try {
                  await onCreateCustomMatch(
                    cHomeName,
                    cHomeCode,
                    cHomeFlag || 'br',
                    cAwayName,
                    cAwayCode,
                    cAwayFlag || 'br',
                    cDate,
                    cTime,
                    cStadium || 'A definir',
                    cCity || 'A definir'
                  );
                  setCHomeName('');
                  setCHomeCode('');
                  setCHomeFlag('br');
                  setCAwayName('');
                  setCAwayCode('');
                  setCAwayFlag('br');
                  setCDate('');
                  setCTime('');
                  setCStadium('');
                  setCCity('');
                  alert('Jogo avulso criado com absoluto sucesso!');
                } catch (err) {
                  console.error('Erro ao criar jogo avulso:', err);
                  alert('Erro ao criar jogo avulso.');
                } finally {
                  setCreatingMatch(false);
                }
              }} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nome do Time da Casa *</label>
                    <input type="text" placeholder="Ex: Flamengo" value={cHomeName} onChange={e=>setCHomeName(e.target.value)} className="input-field text-xs py-1.5 w-full bg-white font-medium animate-none" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Sigla *</label>
                    <input type="text" maxLength={3} placeholder="Ex: FLA" value={cHomeCode} onChange={e=>setCHomeCode(e.target.value)} className="input-field text-xs py-1.5 w-full bg-white font-bold text-center uppercase" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nome do Time de Fora *</label>
                    <input type="text" placeholder="Ex: Palmeiras" value={cAwayName} onChange={e=>setCAwayName(e.target.value)} className="input-field text-xs py-1.5 w-full bg-white font-medium" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Sigla *</label>
                    <input type="text" maxLength={3} placeholder="Ex: PAL" value={cAwayCode} onChange={e=>setCAwayCode(e.target.value)} className="input-field text-xs py-1.5 w-full bg-white font-bold text-center uppercase" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Bandeira Casa (ISO País, ex: br, ar, us)</label>
                    <input type="text" placeholder="br" value={cHomeFlag} onChange={e=>setCHomeFlag(e.target.value)} className="input-field text-xs py-1.5 w-full bg-white text-center font-medium lowercase" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Bandeira Fora (ISO País, ex: br, ar, us)</label>
                    <input type="text" placeholder="br" value={cAwayFlag} onChange={e=>setCAwayFlag(e.target.value)} className="input-field text-xs py-1.5 w-full bg-white text-center font-medium lowercase" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Data *</label>
                    <input type="date" value={cDate} onChange={e=>setCDate(e.target.value)} className="input-field text-xs py-1.5 w-full bg-white font-medium" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Horário *</label>
                    <input type="time" value={cTime} onChange={e=>setCTime(e.target.value)} className="input-field text-xs py-1.5 w-full bg-white font-medium" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Estádio</label>
                    <input type="text" placeholder="Ex: Maracanã" value={cStadium} onChange={e=>setCStadium(e.target.value)} className="input-field text-xs py-1.5 w-full bg-white font-medium" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Cidade</label>
                    <input type="text" placeholder="Ex: Rio de Janeiro" value={cCity} onChange={e=>setCCity(e.target.value)} className="input-field text-xs py-1.5 w-full bg-white font-medium" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={creatingMatch} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-5 rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-wait">
                    {creatingMatch ? 'Criando...' : '✨ Adicionar Jogo Avulso'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚽</span>
                <h3 className="font-bold text-gray-600 text-sm">Jogos Avulsos Criados</h3>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">Ativos para bolão</span>
            </div>
            {filteredMatches.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">Nenhum jogo avulso criado ou encontrado no filtro de busca.</p>
            ) : (
              <div className="space-y-2">{filteredMatches.map(m=><div key={m.id}>{renderMatchRow(m)}</div>)}</div>
            )}
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
          {filteredMatches.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-6">Nenhum amistoso encontrado no filtro de busca.</p>
          ) : (
            <div className="space-y-2">{filteredMatches.map(m=><div key={m.id}>{renderMatchRow(m)}</div>)}</div>
          )}
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
