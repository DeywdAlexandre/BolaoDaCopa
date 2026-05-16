import { Pool, Bet } from '../types';

/**
 * Calcula o resumo financeiro de um bolão específico
 */
export function calculatePoolStats(pool: Pool | undefined, bets: Bet[]) {
  if (!pool) return null;

  const validatedBets = bets.filter(b => b.validated);
  const totalCollected = (validatedBets.length * pool.betValue) + pool.bonusAmount;
  const managerFeeAmount = totalCollected * (pool.maintenanceFee / 100);
  const prizePool = totalCollected - managerFeeAmount;
  
  const winners = validatedBets.filter(b => b.won);
  const winnersCount = winners.length;
  const prizePerWinner = winnersCount > 0 ? prizePool / winnersCount : 0;

  return {
    totalBets: bets.length,
    validatedBetsCount: validatedBets.length,
    totalCollected,
    managerFeeAmount,
    prizePool,
    winnersCount,
    prizePerWinner,
    winners
  };
}

/**
 * Calcula o lucro total de um gerente baseado em todos os seus bolões
 */
export function calculateManagerStats(pools: Pool[], getBetsByPool: (id: string) => Bet[]) {
  let totalCollected = 0;
  let totalManagerFee = 0;
  let totalPrizeDist = 0;
  let totalBets = 0;
  let validatedBets = 0;
  let totalWinners = 0;

  pools.forEach(pool => {
    const pBets = getBetsByPool(pool.id);
    const stats = calculatePoolStats(pool, pBets);
    if (stats) {
      totalCollected += stats.totalCollected;
      totalManagerFee += stats.managerFeeAmount;
      totalPrizeDist += pool.status === 'finished' ? stats.prizePool : 0;
      totalBets += stats.totalBets;
      validatedBets += stats.validatedBetsCount;
      totalWinners += stats.winnersCount;
    }
  });

  return {
    totalCollected,
    totalManagerFee,
    totalPrizeDist,
    totalBets,
    validatedBets,
    totalWinners,
    netProfit: totalManagerFee
  };
}
