import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bet } from '../types';
import { usePools } from './PoolsContext';
import { useMatches } from './MatchesContext';

interface BetsContextType {
  bets: Bet[];
  createBet: (bet: Omit<Bet, 'id' | 'createdAt'>) => { success: boolean; message: string };
  createManualBet: (bet: Omit<Bet, 'id' | 'createdAt' | 'userId' | 'isManualBet'> & { userName: string; userPhone: string }) => { success: boolean; message: string };
  cancelBet: (betId: string) => { success: boolean; message: string };
  validateBet: (betId: string, validated: boolean) => void;
  getBetsByPool: (poolId: string) => Bet[];
  getBetsByUser: (userId: string) => Bet[];
  getBetCount: (poolId: string, homeScore: number, awayScore: number) => number;
  getAllBets: () => Bet[];
  finishPool: (poolId: string) => void;
}

const BetsContext = createContext<BetsContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return fallback;
}

export function BetsProvider({ children }: { children: ReactNode }) {
  const { pools, updatePool } = usePools();
  const { matches } = useMatches();
  const [bets, setBets] = useState<Bet[]>(
    () => loadFromStorage('bolao_bets', [])
  );

  useEffect(() => {
    localStorage.setItem('bolao_bets', JSON.stringify(bets));
  }, [bets]);

  const createBet = (betData: Omit<Bet, 'id' | 'createdAt'>): { success: boolean; message: string } => {
    const pool = pools.find(p => p.id === betData.poolId);
    if (!pool) return { success: false, message: 'Bolão não encontrado' };
    
    if (pool.status !== 'open') {
      return { success: false, message: 'Este bolão não está mais aceitando palpites' };
    }
    
    const now = new Date();
    const deadline = new Date(pool.bettingDeadline);
    if (now > deadline) {
      return { success: false, message: 'O prazo para apostas neste bolão já encerrou' };
    }
    
    const sameScoreBets = bets.filter(
      b => b.poolId === betData.poolId && 
           b.homeScore === betData.homeScore && 
           b.awayScore === betData.awayScore
    );
    
    if (sameScoreBets.length >= pool.maxRepeatedBets) {
      return { 
        success: false, 
        message: `Este placar já atingiu o limite de ${pool.maxRepeatedBets} palpites` 
      };
    }
    
    if (!betData.isManualBet) {
      const userBet = bets.find(b => b.poolId === betData.poolId && b.userId === betData.userId && !b.isManualBet);
      if (userBet) {
        return { success: false, message: 'Você já fez um palpite neste bolão' };
      }
    }
    
    const newBet: Bet = {
      ...betData,
      id: `bet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    setBets(prev => [...prev, newBet]);
    return { success: true, message: 'Palpite registrado! Aguarde a validação do gerente.' };
  };

  const createManualBet = (betData: Omit<Bet, 'id' | 'createdAt' | 'userId' | 'isManualBet'> & { userName: string; userPhone: string }): { success: boolean; message: string } => {
    const fullBetData: Omit<Bet, 'id' | 'createdAt'> = {
      ...betData,
      userId: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isManualBet: true
    };
    return createBet(fullBetData);
  };

  const cancelBet = (betId: string): { success: boolean; message: string } => {
    const bet = bets.find(b => b.id === betId);
    if (!bet) return { success: false, message: 'Palpite não encontrado' };
    
    const pool = pools.find(p => p.id === bet.poolId);
    if (pool?.status === 'finished') {
      return { success: false, message: 'Não é possível cancelar palpites de bolões finalizados' };
    }
    
    setBets(prev => prev.filter(b => b.id !== betId));
    return { success: true, message: 'Palpite cancelado com sucesso' };
  };

  const validateBet = (betId: string, validated: boolean) => {
    setBets(prev => prev.map(b => 
      b.id === betId ? { ...b, validated } : b
    ));
  };

  const getBetsByPool = (poolId: string): Bet[] => {
    return bets.filter(b => b.poolId === poolId);
  };

  const getBetsByUser = (userId: string): Bet[] => {
    return bets.filter(b => b.userId === userId);
  };

  const getBetCount = (poolId: string, homeScore: number, awayScore: number): number => {
    return bets.filter(
      b => b.poolId === poolId && b.homeScore === homeScore && b.awayScore === awayScore
    ).length;
  };

  const getAllBets = (): Bet[] => bets;

  const finishPool = (poolId: string) => {
    const pool = pools.find(p => p.id === poolId);
    if (!pool) return;
    
    const match = matches.find(m => m.id === pool.matchId);
    if (!match || match.homeScore === undefined || match.awayScore === undefined) return;
    
    const updatedBets = bets.map(b => {
      if (b.poolId === poolId && b.validated) {
        const won = b.homeScore === match.homeScore && b.awayScore === match.awayScore;
        return { ...b, won };
      }
      return b;
    });
    
    setBets(updatedBets);
    updatePool(poolId, { status: 'finished' });
  };

  return (
    <BetsContext.Provider value={{
      bets,
      createBet,
      createManualBet,
      cancelBet,
      validateBet,
      getBetsByPool,
      getBetsByUser,
      getBetCount,
      getAllBets,
      finishPool
    }}>
      {children}
    </BetsContext.Provider>
  );
}

export function useBets() {
  const context = useContext(BetsContext);
  if (context === undefined) {
    throw new Error('useBets must be used within a BetsProvider');
  }
  return context;
}
