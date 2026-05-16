import { Pool, Bet } from '../../types';
import { calculateManagerStats } from '../../utils/calculations';

export function DashboardManager({ pools, getBetsByPool }: {
  pools: Pool[];
  getBetsByPool: (poolId: string) => Bet[];
}) {
  const stats = calculateManagerStats(pools, getBetsByPool);
  const totalPools = pools.length;
  const openPools = pools.filter(p => p.status === 'open').length;
  const finishedPools = pools.filter(p => p.status === 'finished').length;

  const { totalBets, validatedBets, totalCollected, totalManagerFee, totalPrizeDist, netProfit, totalWinners } = stats;

  return (
    <div className="space-y-4">
      {/* Cards de stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-3 md:p-4 text-center">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-2xl font-bold text-green-600">{totalPools}</div>
          <div className="text-xs text-gray-500">Bolões Criados</div>
          <div className="text-xs text-gray-400 mt-1">{openPools} abertos • {finishedPools} finalizados</div>
        </div>
        <div className="card p-3 md:p-4 text-center">
          <div className="text-2xl mb-1">🎫</div>
          <div className="text-2xl font-bold text-green-600">{totalBets}</div>
          <div className="text-xs text-gray-500">Palpites Recebidos</div>
          <div className="text-xs text-gray-400 mt-1">{validatedBets} pagos • {totalBets - validatedBets} pendentes</div>
        </div>
        <div className="card p-3 md:p-4 text-center bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="text-2xl mb-1">💵</div>
          <div className="text-xl md:text-2xl font-bold text-green-600">R$ {totalCollected.toFixed(2)}</div>
          <div className="text-xs text-gray-500">Total Arrecadado</div>
        </div>
        <div className="card p-3 md:p-4 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
          <div className="text-2xl mb-1">🤑</div>
          <div className="text-xl md:text-2xl font-bold text-yellow-600">R$ {netProfit.toFixed(2)}</div>
          <div className="text-xs text-gray-500">Sua Taxa (lucro)</div>
        </div>
        <div className="card p-3 md:p-4 text-center">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-2xl font-bold text-blue-600">R$ {totalPrizeDist.toFixed(2)}</div>
          <div className="text-xs text-gray-500">Prêmios Distribuídos</div>
        </div>
        <div className="card p-3 md:p-4 text-center">
          <div className="text-2xl mb-1">🎖️</div>
          <div className="text-2xl font-bold text-blue-600">{totalWinners}</div>
          <div className="text-xs text-gray-500">Vencedores</div>
        </div>
      </div>

      {/* Central de Pendências */}
      {(() => {
        const allPending = pools.flatMap(p => 
          getBetsByPool(p.id)
            .filter(b => !b.validated)
            .map(b => ({ ...b, pool: p }))
        );

        if (allPending.length === 0) return null;

        return (
          <div className="card border-2 border-yellow-200 bg-yellow-50/50">
            <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
              <span>⏳</span> Pendentes de Pagamento ({allPending.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {allPending.map(bet => {
                const pMatch = pools.find(p => p.id === bet.poolId); // Not strictly needed if we have pool
                const handlePoke = () => {
                  const msg = `Olá ${bet.userName}! Vi seu palpite de ${bet.homeScore}x${bet.awayScore} no Bolão, mas ainda não confirmamos o pagamento. Posso validar para você?`;
                  const phone = bet.userPhone?.replace(/\D/g, '');
                  if (phone) window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
                  else alert('Este usuário não cadastrou telefone.');
                };

                return (
                  <div key={bet.id} className="bg-white p-3 rounded-lg border border-yellow-100 flex items-center justify-between gap-3 shadow-sm">
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{bet.userName}</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                        Bolão R$ {bet.pool.betValue} • {bet.homeScore}x{bet.awayScore}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {bet.userPhone && (
                        <button onClick={handlePoke} className="bg-green-100 text-green-600 p-1.5 rounded-md hover:bg-green-200 transition-colors" title="Cobrar no WhatsApp">
                          <span className="text-sm">💬</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Resumo por bolão */}
      {finishedPools > 0 && (
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><span>📊</span> Resumo por Bolão Finalizado</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {pools.filter(p => p.status === 'finished').map(pool => {
              const pBets = getBetsByPool(pool.id);
              const vBets = pBets.filter(b => b.validated);
              const collected = vBets.length * pool.betValue + pool.bonusAmount;
              const fee = collected * (pool.maintenanceFee / 100);
              const winners = vBets.filter(b => b.won).length;
              return (
                <div key={pool.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                  <div>
                    <div className="font-semibold">{pool.matchId}</div>
                    <div className="text-xs text-gray-500">{vBets.length} participantes • {winners} vencedores</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">R$ {collected.toFixed(0)}</div>
                    <div className="text-xs text-yellow-600">Taxa: R$ {fee.toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
