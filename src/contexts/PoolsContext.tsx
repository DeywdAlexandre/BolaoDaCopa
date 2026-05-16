import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pool } from '../types';
import { supabase } from '../lib/supabase';

interface PoolsContextType {
  pools: Pool[];
  isLoading: boolean;
  createPool: (pool: Omit<Pool, 'id' | 'createdAt'>) => Promise<{ success: boolean; message: string }>;
  updatePool: (id: string, updates: Partial<Pool>) => Promise<void>;
  deletePool: (id: string) => Promise<{ success: boolean; message: string }>;
  getPoolsByCode: (managerCode: string) => Pool[];
  getFinishedPoolsByCode: (managerCode: string) => Pool[];
  getAllPools: () => Pool[];
}

const PoolsContext = createContext<PoolsContextType | undefined>(undefined);

export function PoolsProvider({ children }: { children: ReactNode }) {
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPools = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted: Pool[] = data.map(p => ({
          id: p.id,
          matchId: p.match_id,
          managerId: p.manager_code, // Usando code como ID para simplificar
          managerCode: p.manager_code,
          betValue: parseFloat(p.bet_value),
          maintenanceFee: p.maintenance_fee,
          bonusAmount: parseFloat(p.bonus_amount),
          maxRepeatedBets: p.max_repeated_bets,
          includeExtraTime: p.include_extra_time,
          bettingDeadline: p.betting_deadline,
          status: p.status as any,
          createdAt: p.created_at
        }));
        setPools(formatted);
      }
    } catch (err) {
      console.error('Erro ao buscar bolões:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  const createPool = async (poolData: Omit<Pool, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> => {
    const { error } = await supabase
      .from('pools')
      .insert({
        match_id: poolData.matchId,
        manager_code: poolData.managerCode,
        bet_value: poolData.betValue,
        maintenance_fee: poolData.maintenanceFee,
        bonus_amount: poolData.bonusAmount,
        max_repeated_bets: poolData.maxRepeatedBets,
        include_extra_time: poolData.includeExtraTime,
        betting_deadline: poolData.bettingDeadline,
        status: poolData.status
      });

    if (error) return { success: false, message: error.message };
    await fetchPools();
    return { success: true, message: 'Bolão criado com sucesso!' };
  };

  const updatePool = async (id: string, updates: Partial<Pool>) => {
    const { error } = await supabase
      .from('pools')
      .update({
        status: updates.status,
        betting_deadline: updates.bettingDeadline,
        max_repeated_bets: updates.maxRepeatedBets
      })
      .eq('id', id);

    if (error) throw error;
    await fetchPools();
  };

  const deletePool = async (id: string): Promise<{ success: boolean; message: string }> => {
    const { error } = await supabase
      .from('pools')
      .delete()
      .eq('id', id);

    if (error) return { success: false, message: error.message };
    await fetchPools();
    return { success: true, message: 'Bolão excluído com sucesso' };
  };

  const getPoolsByCode = (managerCode: string): Pool[] => {
    return pools.filter(p => p.managerCode === managerCode.toUpperCase() && p.status === 'open');
  };

  const getFinishedPoolsByCode = (managerCode: string): Pool[] => {
    return pools.filter(p => p.managerCode === managerCode.toUpperCase() && p.status === 'finished');
  };

  const getAllPools = (): Pool[] => pools;

  return (
    <PoolsContext.Provider value={{
      pools,
      isLoading,
      createPool,
      updatePool,
      deletePool,
      getPoolsByCode,
      getFinishedPoolsByCode,
      getAllPools
    }}>
      {children}
    </PoolsContext.Provider>
  );
}

export function usePools() {
  const context = useContext(PoolsContext);
  if (context === undefined) throw new Error('usePools must be used within a PoolsProvider');
  return context;
}
