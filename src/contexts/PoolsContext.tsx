import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pool } from '../types';
import { useManagers } from './ManagersContext';

interface PoolsContextType {
  pools: Pool[];
  createPool: (pool: Omit<Pool, 'id' | 'createdAt'>) => { success: boolean; message: string };
  updatePool: (id: string, updates: Partial<Pool>) => void;
  deletePool: (id: string) => { success: boolean; message: string };
  getPoolsByManager: (managerId: string) => Pool[];
  getPoolsByCode: (managerCode: string) => Pool[];
  getFinishedPoolsByCode: (managerCode: string) => Pool[];
  getAllPools: () => Pool[];
}

const PoolsContext = createContext<PoolsContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return fallback;
}

export function PoolsProvider({ children }: { children: ReactNode }) {
  const { authorizedManagers } = useManagers();
  const [pools, setPools] = useState<Pool[]>(
    () => loadFromStorage('bolao_pools', [])
  );

  useEffect(() => {
    localStorage.setItem('bolao_pools', JSON.stringify(pools));
  }, [pools]);

  const createPool = (poolData: Omit<Pool, 'id' | 'createdAt'>): { success: boolean; message: string } => {
    const manager = authorizedManagers.find(m => m.code === poolData.managerCode);
    if (manager?.blocked) {
      return { success: false, message: 'Você está bloqueado para criar novos bolões. Entre em contato com o administrador.' };
    }
    
    const newPool: Pool = {
      ...poolData,
      id: `pool_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setPools(prev => [...prev, newPool]);
    return { success: true, message: 'Bolão criado com sucesso!' };
  };

  const updatePool = (id: string, updates: Partial<Pool>) => {
    setPools(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  };

  const deletePool = (id: string): { success: boolean; message: string } => {
    const pool = pools.find(p => p.id === id);
    if (!pool) return { success: false, message: 'Bolão não encontrado' };
    
    if (pool.status === 'finished') {
      return { success: false, message: 'Não é possível excluir um bolão já finalizado' };
    }
    
    // Nota: A verificação de apostas validadas será feita no componente ou via hook
    // para evitar dependência circular se BetsProvider precisar de PoolsProvider
    
    setPools(prev => prev.filter(p => p.id !== id));
    return { success: true, message: 'Bolão excluído com sucesso' };
  };

  const getPoolsByManager = (managerId: string): Pool[] => {
    return pools.filter(p => p.managerId === managerId);
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
      createPool,
      updatePool,
      deletePool,
      getPoolsByManager,
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
  if (context === undefined) {
    throw new Error('usePools must be used within a PoolsProvider');
  }
  return context;
}
