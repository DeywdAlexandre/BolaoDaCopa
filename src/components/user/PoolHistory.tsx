import { useState } from 'react';
import { Match, Pool, Bet } from '../../types';
import { TeamFlag } from '../shared/TeamFlag';

function shareOnWhatsApp(text: string) {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

export function PoolHistory({
  pools, matches, getBetsByPool, currentUserId
}: {
  pools: Pool[];
  matches: Match[];
  getBetsByPool: (poolId: string) => Bet[];
  currentUserId: string;
}) {
  const [expandedPool, setExpandedPool] = useState<string | null>(null);
  const getMatch = (matchId: string) => matches.find(m => m.id === matchId);

  if (pools.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-5xl mb-4">📜</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum bolão finalizado ainda</h3>
        <p className="text-gray-500">Quando os jogos terminarem, você verá o histórico aqui!</p>
      </div>
    );
  }

  const sortedPools = [...pools].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-r from-green-50 to-yellow-50 border-2 border-green-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📜</span>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Histórico de Bolões</h2>
            <p className="text-sm text-gray-600">{pools.length} bolão(s) finalizado(s) • Transparência total</p>
          </div>
        </div>
      </div>

      {sortedPools.map(pool => {
        const match = getMatch(pool.matchId);
        if (!match) return null;
        const poolBets = getBetsByPool(pool.id);
        const validatedBets = poolBets.filter(b => b.validated);
        const winners = validatedBets.filter(b => b.won);
        const totalCollected = validatedBets.length * pool.betValue + pool.bonusAmount;
        const managerFee = totalCollected * (pool.maintenanceFee / 100);
        const prizePool = totalCollected - managerFee;
        const prizePerWinner = winners.length > 0 ? prizePool / winners.length : 0;
        const isExpanded = expandedPool === pool.id;
        const betsByScore = poolBets.reduce((acc, bet) => {
          const key = `${bet.homeScore}-${bet.awayScore}`;
          if (!acc[key]) acc[key] = { bets: [], isWinner: false };
          acc[key].bets.push(bet);
          if (bet.won) acc[key].isWinner = true;
          return acc;
        }, {} as Record<string, { bets: Bet[]; isWinner: boolean }>);

        return (
          <div key={pool.id} className="card">
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center justify-center gap-3 md:gap-4">
                <div className="text-center shrink-0"><TeamFlag team={match.homeTeam} size="lg" /><div className="text-xs font-semibold mt-1">{match.homeTeam.code}</div></div>
                <div className="text-center bg-gray-100 rounded-xl px-3 md:px-4 py-2"><div className="text-xs text-gray-500 mb-1">Placar Final</div><div className="text-xl md:text-2xl font-bold text-gray-800">{match.homeScore} - {match.awayScore}</div></div>
                <div className="text-center shrink-0"><TeamFlag team={match.awayTeam} size="lg" /><div className="text-xs font-semibold mt-1">{match.awayTeam.code}</div></div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800 text-sm md:text-base">{match.homeTeam.name} x {match.awayTeam.name}</div>
                <div className="text-xs md:text-sm text-gray-500">
                  {new Date(match.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold">✓ Finalizado</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
              <div className="bg-gray-50 rounded-lg p-2 md:p-3 text-center"><div className="text-xs text-gray-500">Valor</div><div className="font-bold text-green-600 text-sm md:text-base">R$ {pool.betValue}</div></div>
              <div className="bg-gray-50 rounded-lg p-2 md:p-3 text-center"><div className="text-xs text-gray-500">Participantes</div><div className="font-bold text-sm md:text-base">{validatedBets.length}</div></div>
              <div className="bg-gray-50 rounded-lg p-2 md:p-3 text-center"><div className="text-xs text-gray-500">Arrecadado</div><div className="font-bold text-green-600 text-sm md:text-base">R$ {totalCollected.toFixed(0)}</div></div>
              <div className="bg-gray-50 rounded-lg p-2 md:p-3 text-center"><div className="text-xs text-gray-500">Vencedores</div><div className="font-bold text-yellow-600 text-sm md:text-base">{winners.length}</div></div>
              <div className="bg-gray-50 rounded-lg p-2 md:p-3 text-center"><div className="text-xs text-gray-500">Prêmio cada</div><div className="font-bold text-yellow-600 text-sm md:text-base">{winners.length > 0 ? `R$ ${prizePerWinner.toFixed(0)}` : '-'}</div></div>
            </div>
            {winners.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-bold text-yellow-800 mb-2 flex items-center gap-2"><span>🏆</span> Vencedor(es) - Acertaram {match.homeScore} x {match.awayScore}</h4>
                <div className="flex flex-wrap gap-2">
                  {winners.map(bet => (
                    <span key={bet.id} className={`px-3 py-1 rounded-full text-sm font-semibold ${bet.userId === currentUserId ? 'bg-yellow-400 text-yellow-900' : 'bg-yellow-200 text-yellow-800'}`}>
                      {bet.userName}{bet.userId === currentUserId && ' (você!)'} - R$ {prizePerWinner.toFixed(2)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {winners.length === 0 && (<div className="bg-gray-100 border border-gray-200 rounded-xl p-4 mb-4 text-center"><span className="text-gray-600">😔 Ninguém acertou o placar exato</span></div>)}
            
            {/* Compartilhar WhatsApp */}
            <button
              onClick={() => {
                const winnersText = winners.length > 0
                  ? `🏆 Vencedor(es): ${winners.map(b => b.userName).join(', ')} - R$ ${prizePerWinner.toFixed(2)} cada!`
                  : '😔 Ninguém acertou o placar exato.';
                const text = `⚽ *Bolão Copa 2026*\n\n${match.homeTeam.name} ${match.homeScore} x ${match.awayScore} ${match.awayTeam.name}\n\n${winnersText}\n\n📊 ${validatedBets.length} participantes | R$ ${totalCollected.toFixed(0)} arrecadados\n\n🎯 Participe dos próximos bolões!\n${window.location.origin}${window.location.pathname}`;
                shareOnWhatsApp(text);
              }}
              className="w-full mb-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              📲 Compartilhar no WhatsApp
            </button>

            <button onClick={() => setExpandedPool(isExpanded ? null : pool.id)} className="w-full py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              {isExpanded ? '🔼 Ocultar todos os palpites' : `🔽 Ver todos os ${poolBets.length} palpites`}
            </button>
            {isExpanded && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Todos os palpites:</h4>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {Object.entries(betsByScore).sort(([, a], [, b]) => (b.isWinner ? 1 : 0) - (a.isWinner ? 1 : 0)).map(([score, { bets, isWinner }]) => {
                    const [home, away] = score.split('-');
                    return (
                      <div key={score} className={`flex items-center justify-between p-3 rounded-lg ${isWinner ? 'bg-green-100 border-2 border-green-300' : 'bg-white border border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          <span className={`font-bold text-lg w-16 text-center ${isWinner ? 'text-green-700' : ''}`}>{home} x {away}</span>
                          {isWinner && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">✓ ACERTOU</span>}
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {bets.map(bet => (
                            <span key={bet.id} className={`text-xs px-2 py-1 rounded-full ${bet.userId === currentUserId ? (isWinner ? 'bg-green-500 text-white font-bold' : 'bg-yellow-200 text-yellow-800 font-semibold') : (isWinner ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600')}`}>
                              {bet.userName.split(' ')[0]}{bet.userId === currentUserId && ' (você)'}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
