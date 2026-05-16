import { useMemo } from 'react';
import { LeaderboardEntry } from '../types';
import { useBets } from '../contexts/BetsContext';
import { usePools } from '../contexts/PoolsContext';
import { calculatePoolStats } from '../utils/calculations';

export function useLeaderboard(managerCode?: string) {
  const { bets } = useBets();
  const { pools } = usePools();

  return useMemo(() => {
    const relevantBets = managerCode 
      ? bets.filter(b => {
          const pool = pools.find(p => p.id === b.poolId);
          return pool?.managerCode === managerCode && b.validated && b.won !== undefined;
        })
      : bets.filter(b => b.validated && b.won !== undefined);
    
    const leaderboardMap = new Map<string, LeaderboardEntry>();
    
    relevantBets.forEach(bet => {
      const existing = leaderboardMap.get(bet.userId);
      const pool = pools.find(p => p.id === bet.poolId);
      
      let prizeWon = 0;
      if (bet.won && pool) {
        const poolBets = bets.filter(b => b.poolId === pool.id);
        const stats = calculatePoolStats(pool, poolBets);
        prizeWon = stats?.prizePerWinner || 0;
      }
      
      if (existing) {
        existing.exactHits += bet.won ? 1 : 0;
        existing.totalBets += 1;
        existing.totalWon += prizeWon;
      } else {
        leaderboardMap.set(bet.userId, {
          userId: bet.userId,
          userName: bet.userName,
          exactHits: bet.won ? 1 : 0,
          totalBets: 1,
          totalWon: prizeWon
        });
      }
    });
    
    return Array.from(leaderboardMap.values())
      .sort((a, b) => b.exactHits - a.exactHits || b.totalWon - a.totalWon);
  }, [bets, pools, managerCode]);
}
