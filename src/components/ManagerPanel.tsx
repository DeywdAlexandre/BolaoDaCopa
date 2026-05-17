import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useManagers } from '../contexts/ManagersContext';
import { useMatches } from '../contexts/MatchesContext';
import { usePools } from '../contexts/PoolsContext';
import { useBets } from '../contexts/BetsContext';
import { useToast } from './shared/Toast';
import { PoolsList } from './manager/PoolsList';
import { CreatePoolForm } from './manager/CreatePoolForm';
import { BetsList } from './manager/BetsList';
import { DashboardManager } from './manager/DashboardManager';

type Tab = 'dashboard' | 'pools' | 'create' | 'bets';

export function ManagerPanel() {
  const { user, logout } = useAuth();
  const { authorizedManagers, updateManager } = useManagers();
  const { matches } = useMatches();
  const { pools, createPool, updatePool, deletePool } = usePools();
  const { getBetsByPool, validateBet, cancelBet, createManualBet, finishPool } = useBets();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedMatch, setSelectedMatch] = useState('');
  const [betValue, setBetValue] = useState('10');
  const [maxRepeated, setMaxRepeated] = useState('3');
  const [includeExtraTime, setIncludeExtraTime] = useState(false);
  const [maintenanceFee, setMaintenanceFee] = useState('10');
  const [bonusAmount, setBonusAmount] = useState('0');
  const [bettingDeadline, setBettingDeadline] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const manager = authorizedManagers.find(m => m.email === user?.email);
  const [editingPanelName, setEditingPanelName] = useState(false);
  const [panelName, setPanelName] = useState(manager?.panelName || '');

  const managerCode = manager?.code || '';
  const isBlocked = manager?.blocked || false;
  const managerPools = pools.filter(p => p.managerCode === managerCode);

  const inviteLink = `${window.location.origin}${window.location.pathname}?code=${managerCode}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2500); }).catch(() => {
      const t = document.createElement('textarea'); t.value = inviteLink; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(managerCode).catch(() => {
      const t = document.createElement('textarea'); t.value = managerCode; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    });
  };

  const handleUpdatePanelName = async () => {
    if (manager) {
      try {
        await updateManager(manager.id, { panelName: panelName.trim() || undefined });
        setEditingPanelName(false);
        toast('Nome do painel atualizado!', 'success');
      } catch (err: any) {
        toast(err.message, 'error');
      }
    }
  };

  const handleCreatePool = async () => {
    if (!selectedMatch) { toast('Selecione um jogo', 'warning'); return; }
    const match = matches.find(m => m.id === selectedMatch);
    if (!match) return;
    const matchDateTime = new Date(`${match.date}T${match.time}:00`);
    let deadline = bettingDeadline ? new Date(bettingDeadline) : matchDateTime;
    if (deadline > matchDateTime) deadline = matchDateTime;

    try {
      const result = await createPool({ 
        matchId: selectedMatch, 
        managerId: user?.id || '', 
        managerCode, 
        betValue: parseFloat(betValue), 
        maxRepeatedBets: parseInt(maxRepeated), 
        includeExtraTime, 
        maintenanceFee: parseFloat(maintenanceFee), 
        bonusAmount: parseFloat(bonusAmount), 
        bettingDeadline: deadline.toISOString(), 
        status: 'open' 
      });
      if (result.success) { 
        toast('Bolão criado com sucesso!', 'success'); 
        setSelectedMatch(''); 
        setBettingDeadline(''); 
        setActiveTab('pools'); 
      } else {
        toast(result.message, 'error');
      }
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const getMatch = (matchId: string) => matches.find(m => m.id === matchId);


  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: '📊' },
    { id: 'pools' as Tab, label: 'Meus Bolões', icon: '🎯' },
    { id: 'create' as Tab, label: 'Criar Bolão', icon: '➕' },
    { id: 'bets' as Tab, label: 'Palpites', icon: '🎫' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="card mb-6 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-2xl shadow-lg">👔</div>
              <div>
                {editingPanelName ? (
                  <div className="flex items-center gap-2">
                    <input type="text" value={panelName} onChange={(e) => setPanelName(e.target.value)} className="input-field py-1 text-sm" placeholder="Ex: Bolão do José" autoFocus />
                    <button onClick={handleUpdatePanelName} className="text-xs bg-green-600 text-white px-2 py-1 rounded">Salvar</button>
                    <button onClick={() => { setEditingPanelName(false); setPanelName(manager?.panelName || ''); }} className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">×</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-800">{manager?.panelName || 'Painel do Gerente'}</h1>
                    <button onClick={() => setEditingPanelName(true)} className="text-xs opacity-50 hover:opacity-100">✏️</button>
                  </div>
                )}
                <p className="text-gray-500 text-sm">{user?.name} • {user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="btn-secondary">Sair</button>
          </div>
        </div>

        {isBlocked && (
          <div className="card mb-6 bg-red-50 border-2 border-red-300">
            <div className="flex items-center gap-3 text-red-700"><span className="text-2xl">🚫</span><div><div className="font-bold">Conta Bloqueada</div><div className="text-sm">Não é possível criar novos bolões.</div></div></div>
          </div>
        )}

        <div className="card mb-6 animate-fade-in-up border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-green-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Seu Código de Gerente:</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl md:text-4xl font-mono font-black tracking-[0.2em] md:tracking-[0.3em] text-green-700 bg-white px-3 md:px-5 py-2 rounded-xl border-2 border-green-200 shadow-inner">{managerCode}</span>
                <button onClick={handleCopyCode} className="text-sm bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200">📋 Copiar</button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Compartilhe com seus participantes</p>
            </div>
            <button onClick={handleCopyLink} className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${copiedLink ? 'bg-green-600 text-white' : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg'}`}>
              {copiedLink ? '✅ Link copiado!' : '🔗 Copiar Link de Convite'}
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              <span>{tab.icon}</span><span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && <DashboardManager pools={managerPools} getBetsByPool={getBetsByPool} />}
        {activeTab === 'pools' && <PoolsList pools={managerPools} getMatch={getMatch} onClose={async (id) => { if (confirm('Fechar bolão para novos palpites?')) { await updatePool(id, { status: 'closed' }); toast('Bolão fechado', 'info'); } }} onFinish={async (id) => { if (confirm('Finalizar e calcular vencedores?')) { await finishPool(id); toast('Bolão finalizado!', 'success'); } }} onDelete={async (id) => { const r = await deletePool(id); if (!r.success) toast(r.message, 'error'); else toast('Bolão excluído', 'info'); }} onReopen={async (id) => await updatePool(id, { status: 'open' })} getBetsByPool={getBetsByPool} />}
        {activeTab === 'create' && <CreatePoolForm matches={matches.filter(m => !m.finished && m.homeTeam.code !== 'TBD')} selectedMatch={selectedMatch} setSelectedMatch={setSelectedMatch} betValue={betValue} setBetValue={setBetValue} maxRepeated={maxRepeated} setMaxRepeated={setMaxRepeated} includeExtraTime={includeExtraTime} setIncludeExtraTime={setIncludeExtraTime} maintenanceFee={maintenanceFee} setMaintenanceFee={setMaintenanceFee} bonusAmount={bonusAmount} setBonusAmount={setBonusAmount} bettingDeadline={bettingDeadline} setBettingDeadline={setBettingDeadline} onCreate={handleCreatePool} existingPools={managerPools} isBlocked={isBlocked} />}
        {activeTab === 'bets' && <BetsList pools={managerPools} getMatch={getMatch} getBetsByPool={getBetsByPool} onValidate={validateBet} onCancel={cancelBet} createManualBet={createManualBet} />}
      </div>
    </div>
  );
}
