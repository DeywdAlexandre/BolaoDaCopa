import { useState } from 'react';
import { Match, Pool, Bet } from '../../types';
import { useToast } from '../shared/Toast';

export function BetsList({
  pools, getMatch, getBetsByPool, onValidate, onCancel, createManualBet
}: {
  pools: Pool[];
  getMatch: (id: string) => Match | undefined;
  getBetsByPool: (poolId: string) => Bet[];
  onValidate: (betId: string, validated: boolean) => void;
  onCancel: (betId: string) => Promise<{ success: boolean; message: string }>;
  createManualBet: (bet: { poolId: string; matchId: string; userName: string; userPhone: string; homeScore: number; awayScore: number; validated: boolean }) => Promise<{ success: boolean; message: string }>;
}) {
  const [selectedPool, setSelectedPool] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualHome, setManualHome] = useState('0');
  const [manualAway, setManualAway] = useState('0');
  const { toast } = useToast();

  const poolBets = selectedPool ? getBetsByPool(selectedPool) : [];
  const selectedPoolData = pools.find(p => p.id === selectedPool);
  const match = selectedPoolData ? getMatch(selectedPoolData.matchId) : null;
  const totalAllBets = pools.reduce((sum, pool) => sum + getBetsByPool(pool.id).length, 0);
  const pendingBets = pools.reduce((sum, pool) => sum + getBetsByPool(pool.id).filter(b => !b.validated).length, 0);

  const handleCreateManualBet = async () => {
    if (!selectedPool || !selectedPoolData || !manualName.trim() || !manualPhone.trim()) { toast('Preencha nome e telefone', 'warning'); return; }
    const result = await createManualBet({ poolId: selectedPool, matchId: selectedPoolData.matchId, userName: manualName.trim(), userPhone: manualPhone.trim(), homeScore: parseInt(manualHome), awayScore: parseInt(manualAway), validated: false });
    if (result.success) { setManualName(''); setManualPhone(''); setManualHome('0'); setManualAway('0'); setShowManualForm(false); toast('Palpite manual criado!', 'success'); }
    else toast(result.message, 'error');
  };

  const handleCancelBet = async (betId: string, userName: string) => {
    if (confirm(`Cancelar palpite de "${userName}"?`)) { const r = await onCancel(betId); if (!r.success) toast(r.message, 'error'); else toast('Palpite cancelado', 'info'); }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2"><span>🎫</span> Gerenciar Palpites</h2>
      <div className="flex gap-4 mb-6 text-sm">
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">📊 Total: {totalAllBets}</span>
        {pendingBets > 0 && <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg animate-pulse">⏳ {pendingBets} pendentes</span>}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Selecione o Bolão</label>
        <select value={selectedPool} onChange={(e) => { setSelectedPool(e.target.value); setShowManualForm(false); }} className="input-field">
          <option value="">-- Escolha um bolão --</option>
          {pools.map(pool => {
            const m = getMatch(pool.matchId);
            const betCount = getBetsByPool(pool.id).length;
            const pending = getBetsByPool(pool.id).filter(b => !b.validated).length;
            return (<option key={pool.id} value={pool.id}>{m?.homeTeam.flag} {m?.homeTeam.name} x {m?.awayTeam.name} (R$ {pool.betValue}) - {betCount} palpites{pending > 0 ? ` (${pending} pend.)` : ''}</option>);
          })}
        </select>
      </div>

      {selectedPool && match && (
        <>
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-2xl">{match.homeTeam.flag}</span>
              <span className="font-bold">{match.homeTeam.name} x {match.awayTeam.name}</span>
              <span className="text-2xl">{match.awayTeam.flag}</span>
            </div>
            <div className="text-sm text-gray-500 text-center">R$ {selectedPoolData?.betValue} | {poolBets.length} palpite(s)</div>
            <div className={`text-sm text-center mt-1 ${selectedPoolData?.includeExtraTime ? 'text-blue-600' : 'text-gray-500'}`}>{selectedPoolData?.includeExtraTime ? '⏱️ Inclui Prorrogação' : '⚽ Apenas Tempo Normal'}</div>
          </div>

          {selectedPoolData?.status === 'open' && (
            <div className="mb-4">
              {!showManualForm ? (
                <button onClick={() => setShowManualForm(true)} className="w-full py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-semibold">➕ Palpite Manual (sem login)</button>
              ) : (
                <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-blue-800">Novo Palpite Manual</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Nome" value={manualName} onChange={(e) => setManualName(e.target.value)} className="input-field text-sm" />
                    <input type="tel" placeholder="Telefone" value={manualPhone} onChange={(e) => setManualPhone(e.target.value)} className="input-field text-sm" />
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span>{match.homeTeam.flag}</span>
                    <input type="number" min="0" value={manualHome} onChange={(e) => setManualHome(e.target.value)} className="w-16 text-center input-field py-1" />
                    <span className="text-gray-400">x</span>
                    <input type="number" min="0" value={manualAway} onChange={(e) => setManualAway(e.target.value)} className="w-16 text-center input-field py-1" />
                    <span>{match.awayTeam.flag}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCreateManualBet} className="flex-1 btn-primary py-2 text-sm">Criar</button>
                    <button onClick={() => setShowManualForm(false)} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {poolBets.length === 0 ? (
            <div className="text-center py-8 text-gray-400"><div className="text-4xl mb-2">📭</div><p>Nenhum palpite ainda</p></div>
          ) : (
            <div className="space-y-2">
              {poolBets.map(bet => (
                <div key={bet.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border-2 gap-3 ${bet.validated ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${bet.validated ? 'bg-green-200' : 'bg-yellow-200'}`}>{bet.validated ? '✅' : '⏳'}</div>
                    <div>
                      <div className="font-semibold flex items-center gap-2">{bet.userName}{bet.isManualBet && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">Manual</span>}</div>
                      {bet.userPhone && <div className="text-xs text-gray-500">📞 {bet.userPhone}</div>}
                      <div className="text-sm text-gray-500">Palpite: <strong>{match.homeTeam.code} {bet.homeScore} x {bet.awayScore} {match.awayTeam.code}</strong></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    {bet.won !== undefined && <span className={`px-2 py-1 rounded text-xs font-bold ${bet.won ? 'bg-green-500 text-white' : 'bg-red-100 text-red-700'}`}>{bet.won ? '🏆 GANHOU' : 'ERROU'}</span>}
                    {selectedPoolData?.status !== 'finished' && (
                      <>
                        {!bet.validated ? <button onClick={() => onValidate(bet.id, true)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">✓ Pago</button> : <button onClick={() => onValidate(bet.id, false)} className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-300">Desfazer</button>}
                        <button 
                          onClick={() => {
                            const url = `${window.location.origin}${window.location.pathname}?view-pool=${selectedPool}`;
                            const text = `🏆 *Comprovante de Aposta*\n👤 **Apostador:** ${bet.userName}\n⚽ **Jogo:** ${match.homeTeam.name} x ${match.awayTeam.name}\n🎫 **Palpite:** ${bet.homeScore} x ${bet.awayScore}\n✅ **Status:** ${bet.validated ? 'Validado' : 'Pendente'}\n\n🔗 *Acompanhe todos os palpites aqui:* \n${url}`;
                            if (navigator.share) {
                              navigator.share({ title: 'Comprovante de Aposta', text, url }).catch(() => {});
                            } else {
                              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                            }
                          }}
                          className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200"
                          title="Enviar Comprovante"
                        >
                          📱
                        </button>
                        <button onClick={() => handleCancelBet(bet.id, bet.userName)} className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-200" title="Cancelar">🗑️</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!selectedPool && pools.length > 0 && (<div className="text-center py-8 text-gray-400"><div className="text-4xl mb-2">👆</div><p>Selecione um bolão acima</p></div>)}
    </div>
  );
}
