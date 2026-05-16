import { useMemo } from 'react';
import { Pool } from '../types';
import { useBets } from '../contexts/BetsContext';
import { calculatePoolStats } from '../utils/calculations';

export function usePoolStats(pool?: Pool) {
  const { getBetsByPool } = useBets();

  return useMemo(() => {
    if (!pool) return null;
    const poolBets = getBetsByPool(pool.id);
    return calculatePoolStats(pool, poolBets);
  }, [pool, getBetsByPool]);
}
