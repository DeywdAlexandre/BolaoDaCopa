import { useMemo } from 'react';
import { useManagers } from '../contexts/ManagersContext';
import { usePools } from '../contexts/PoolsContext';
import { useBets } from '../contexts/BetsContext';

export interface AdminStats {
  totalManagers: number;
  totalPools: number;
  totalBets: number;
  totalCollected: number;
  totalPlatformFees: number;
  pendingFeesByManager: {
    managerId: string;
    managerName: string;
    managerCode: string;
    pending: number;
  }[];
}

export function useAdminStats(): AdminStats {
  const { authorizedManagers } = useManagers();
  const { pools } = usePools();
  const { bets } = useBets();

  return useMemo(() => {
    const finishedPools = pools.filter(p => p.status === 'finished');
    
    let totalCollected = 0;
    let totalPlatformFees = 0;
    const feesByManager: Record<string, { managerId: string; managerName: string; managerCode: string; pending: number }> = {};
    
    finishedPools.forEach(pool => {
      const manager = authorizedManagers.find(m => m.code === pool.managerCode);
      if (!manager) return;
      
      const poolBets = bets.filter(b => b.poolId === pool.id && b.validated);
      const poolTotal = (poolBets.length * pool.betValue) + pool.bonusAmount;
      const platformFee = poolTotal * (manager.platformFee / 100);
      
      totalCollected += poolTotal;
      totalPlatformFees += platformFee;
      
      if (!feesByManager[manager.id]) {
        feesByManager[manager.id] = {
          managerId: manager.id,
          managerName: manager.name,
          managerCode: manager.code,
          pending: 0
        };
      }
      feesByManager[manager.id].pending += platformFee;
    });
    
    return {
      totalManagers: authorizedManagers.length,
      totalPools: pools.length,
      totalBets: bets.length,
      totalCollected,
      totalPlatformFees,
      pendingFeesByManager: Object.values(feesByManager)
    };
  }, [authorizedManagers, pools, bets]);
}
