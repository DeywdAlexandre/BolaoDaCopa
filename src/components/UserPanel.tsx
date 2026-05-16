import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useManagers } from '../contexts/ManagersContext';
import { useMatches } from '../contexts/MatchesContext';
import { usePools } from '../contexts/PoolsContext';
import { useBets } from '../contexts/BetsContext';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useToast } from './shared/Toast';
import { AvailablePools } from './user/AvailablePools';
import { MyBets } from './user/MyBets';
import { PoolHistory } from './user/PoolHistory';
import { Leaderboard } from './user/Leaderboard';
import { MatchesList } from './user/MatchesList';
import { UserProfile } from './user/UserProfile';
import { HowItWorks } from './user/HowItWorks';

type Tab = 'pools' | 'my-bets' | 'history' | 'leaderboard' | 'matches' | 'rules' | 'profile';

export function UserPanel() {
  const { user, logout, updateUserRole, updateUserName } = useAuth();
  const { getManagerByCode } = useManagers();
  const { matches, getGroupStandings } = useMatches();
  const { pools, getPoolsByCode, getFinishedPoolsByCode } = usePools();
  const { getBetsByUser, getBetCount, getBetsByPool, createBet } = useBets();

  const [activeTab, setActiveTab] = useState<Tab>('pools');
  const { toast } = useToast();
  const [managerCode, setManagerCode] = useState('');
  const [joinedCode, setJoinedCode] = useState<string>(() => localStorage.getItem('bolao_joined_code') || '');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get('code');
    if (codeFromUrl && !joinedCode) {
      const code = codeFromUrl.toUpperCase().trim();
      const manager = getManagerByCode(code);
      if (manager) {
        setJoinedCode(code);
        localStorage.setItem('bolao_joined_code', code);
        updateUserRole('user', manager.id);
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        setManagerCode(code);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleJoinPool = () => {
    const code = managerCode.toUpperCase().trim();
    if (!code) { toast('Digite o código do gerente', 'warning'); return; }
    const manager = getManagerByCode(code);
    if (!manager) { toast('Código inválido! Verifique com seu gerente.', 'error'); return; }
    setJoinedCode(code);
    localStorage.setItem('bolao_joined_code', code);
    updateUserRole('user', manager.id);
    setManagerCode('');
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleLeavePool = () => {
    if (confirm('Sair deste bolão?')) { setJoinedCode(''); localStorage.removeItem('bolao_joined_code'); }
  };

  const availablePools = joinedCode ? getPoolsByCode(joinedCode) : [];
  const finishedPools = joinedCode ? getFinishedPoolsByCode(joinedCode) : [];
  const myBets = getBetsByUser(user?.id || '');
  const leaderboard = useLeaderboard(joinedCode);
  const currentManager = joinedCode ? getManagerByCode(joinedCode) : null;

  const tabs = [
    { id: 'pools' as Tab, label: 'Bolões', icon: '🎯', count: availablePools.length },
    { id: 'my-bets' as Tab, label: 'Meus Palpites', icon: '🎫', count: myBets.length },
    { id: 'history' as Tab, label: 'Histórico', icon: '📜', count: finishedPools.length },
    { id: 'leaderboard' as Tab, label: 'Ranking', icon: '🏆' },
    { id: 'matches' as Tab, label: 'Jogos', icon: '⚽' },
    { id: 'rules' as Tab, label: 'Regras', icon: '📖' },
    { id: 'profile' as Tab, label: 'Perfil', icon: '👤' },
  ];

  if (!joinedCode) {
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get('code');
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center animate-fade-in-up">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Entrar no Bolão</h1>
          <p className="text-gray-500 mb-6">Digite o código do seu gerente para participar</p>
          <div className="space-y-4">
            <input type="text" placeholder="Código (ex: ABC123)" value={managerCode || codeFromUrl?.toUpperCase() || ''} onChange={(e) => setManagerCode(e.target.value.toUpperCase())} className="input-field text-center text-2xl font-mono tracking-widest uppercase" maxLength={6} />
            <button onClick={handleJoinPool} className="btn-primary w-full">Entrar no Bolão</button>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Logado como: {user?.name}</p>
            <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">Sair da conta</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="card mb-6 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-2xl shadow-lg">{user?.name?.[0]?.toUpperCase() || '⚽'}</div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Olá, {user?.name?.split(' ')[0]}!</h1>
                <p className="text-gray-500 text-sm">{currentManager?.panelName || `Bolão de ${currentManager?.name}`} • Código: <span className="font-mono font-bold text-green-600">{joinedCode}</span></p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleLeavePool} className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200">Trocar Bolão</button>
              <button onClick={logout} className="btn-secondary">Sair</button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              <span>{tab.icon}</span><span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/30' : 'bg-green-100 text-green-700'}`}>{tab.count}</span>}
            </button>
          ))}
        </div>

        {activeTab === 'pools' && <AvailablePools pools={availablePools} matches={matches} userId={user?.id || ''} userName={user?.name || ''} myBets={myBets} createBet={createBet} getBetCount={getBetCount} getBetsByPool={getBetsByPool} />}
        {activeTab === 'my-bets' && <MyBets bets={myBets} matches={matches} pools={pools} />}
        {activeTab === 'history' && <PoolHistory pools={finishedPools} matches={matches} getBetsByPool={getBetsByPool} currentUserId={user?.id || ''} />}
        {activeTab === 'leaderboard' && <Leaderboard entries={leaderboard} currentUserId={user?.id || ''} />}
        {activeTab === 'matches' && <MatchesList matches={matches} getGroupStandings={getGroupStandings} />}
        {activeTab === 'rules' && <HowItWorks />}
        {activeTab === 'profile' && <UserProfile user={user} onUpdateName={updateUserName} onLogout={logout} bets={myBets} />}
      </div>
    </div>
  );
}
