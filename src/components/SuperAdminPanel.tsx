import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useManagers } from '../contexts/ManagersContext';
import { usePools } from '../contexts/PoolsContext';
import { useBets } from '../contexts/BetsContext';
import { useMatches } from '../contexts/MatchesContext';
import { useAdminStats } from '../hooks/useAdminStats';
import { useToast } from './shared/Toast';
import { DashboardTab } from './admin/DashboardTab';
import { ManagersTab } from './admin/ManagersTab';
import { ResultsTab } from './ResultsTab';
import { PoolsTab } from './admin/PoolsTab';
import { BetsTab } from './admin/BetsTab';
import { FinancesTab } from './admin/FinancesTab';

type Tab = 'dashboard' | 'managers' | 'results' | 'pools' | 'bets' | 'finances';

export function SuperAdminPanel() {
  const { user, logout } = useAuth();
  const { authorizedManagers, addManager, updateManager, removeManager } = useManagers();
  const { pools } = usePools();
  const { bets, getBetsByPool } = useBets();
  const { matches, updateMatchScore, updateMatchTeams, updateMatchDetails, createCustomMatch, deleteMatch, getGroupStandings, syncMatches, seedMatches } = useMatches();
  const stats = useAdminStats();

  const { toast } = useToast();

  const [apiKey, setApiKey] = useState((import.meta as any).env.VITE_FOOTBALL_API_KEY || '');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const handleSync = async () => {
    if (!apiKey) { 
      toast('Por favor, informe a API Key primeiro', 'warning'); 
      return; 
    }
    try {
      console.log('Chamando syncMatches com a chave informada...');
      await syncMatches(apiKey);
      toast('Resultados sincronizados com sucesso!', 'success');
    } catch (err: any) {
      console.error('Erro na sincronização:', err);
      toast(err.message || 'Erro ao sincronizar', 'error');
    }
  };
  const [newManagerEmail, setNewManagerEmail] = useState('');
  const [newManagerName, setNewManagerName] = useState('');
  const [newManagerFee, setNewManagerFee] = useState('3');
  const [newManagerPhone, setNewManagerPhone] = useState('');
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [editingManager, setEditingManager] = useState<string | null>(null);
  const [editFee, setEditFee] = useState('');
  const [editPhone, setEditPhone] = useState('');
  
  const handleAddManager = async () => {
    if (!newManagerEmail || !newManagerName) { toast('Preencha email e nome', 'warning'); return; }
    try {
      const code = await addManager(newManagerEmail, newManagerName, parseFloat(newManagerFee) || 3, newManagerPhone);
      setShowSuccess(`Gerente adicionado! Código: ${code}`);
      setNewManagerEmail(''); setNewManagerName(''); setNewManagerFee('3'); setNewManagerPhone('');
      setTimeout(() => setShowSuccess(null), 5000);
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handleUpdateFee = async (managerId: string) => {
    const fee = parseFloat(editFee);
    if (isNaN(fee) || fee < 0 || fee > 50) { toast('Taxa deve ser entre 0 e 50%', 'warning'); return; }
    try {
      await updateManager(managerId, { platformFee: fee, phone: editPhone });
      setEditingManager(null); setEditFee(''); setEditPhone('');
      toast('Gerente atualizado com sucesso!', 'success');
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: '📊' },
    { id: 'managers' as Tab, label: 'Gerentes', icon: '👔', count: authorizedManagers.length },
    { id: 'results' as Tab, label: 'Placares', icon: '⚽' },
    { id: 'pools' as Tab, label: 'Bolões', icon: '🎯', count: pools.length },
    { id: 'bets' as Tab, label: 'Palpites', icon: '🎫', count: bets.length },
    { id: 'finances' as Tab, label: 'Financeiro', icon: '💰' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="card mb-6 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-2xl shadow-lg">👑</div>
              <div><h1 className="text-xl font-bold text-gray-800">Painel do Super Admin</h1><p className="text-gray-500 text-sm">{user?.email}</p></div>
            </div>
            <button onClick={logout} className="btn-secondary">Sair</button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-yellow-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              <span>{tab.icon}</span><span>{tab.label}</span>
              {tab.count !== undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/30' : 'bg-yellow-100 text-yellow-700'}`}>{tab.count}</span>}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && <DashboardTab stats={stats} />}
        {activeTab === 'managers' && <ManagersTab managers={authorizedManagers} pools={pools} bets={bets} newEmail={newManagerEmail} setNewEmail={setNewManagerEmail} newName={newManagerName} setNewName={setNewManagerName} newFee={newManagerFee} setNewFee={setNewManagerFee} newPhone={newManagerPhone} setNewPhone={setNewManagerPhone} showSuccess={showSuccess} onAdd={handleAddManager} onToggleBlock={async (m) => await updateManager(m.id, { blocked: !m.blocked })} onRemove={async (id, name) => { if (confirm(`Remover "${name}"?`)) await removeManager(id); }} editingManager={editingManager} setEditingManager={setEditingManager} editFee={editFee} setEditFee={setEditFee} editPhone={editPhone} setEditPhone={setEditPhone} onUpdateFee={handleUpdateFee} />}
        {activeTab === 'results' && <ResultsTab matches={matches} onUpdateScore={updateMatchScore} onUpdateDetails={updateMatchDetails} onUpdateTeams={updateMatchTeams} onCreateCustomMatch={createCustomMatch} onDeleteMatch={deleteMatch} getGroupStandings={getGroupStandings} onSync={handleSync} seedMatches={seedMatches} apiKey={apiKey} setApiKey={setApiKey} />}
        {activeTab === 'pools' && <PoolsTab pools={pools} matches={matches} managers={authorizedManagers} getBetsByPool={getBetsByPool} />}
        {activeTab === 'bets' && <BetsTab bets={bets} pools={pools} matches={matches} />}
        {activeTab === 'finances' && <FinancesTab stats={stats} managers={authorizedManagers} />}
      </div>
    </div>
  );
}
