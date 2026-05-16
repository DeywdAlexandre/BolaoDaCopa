import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bet } from '../types';
import { usePools } from './PoolsContext';
import { useMatches } from './MatchesContext';
import { supabase } from '../lib/supabase';

interface BetsContextType {
  bets: Bet[];
  isLoading: boolean;
  createBet: (bet: Omit<Bet, 'id' | 'createdAt'>) => Promise<{ success: boolean; message: string }>;
  createManualBet: (bet: Omit<Bet, 'id' | 'createdAt' | 'userId' | 'isManualBet'> & { userName: string; userPhone: string }) => Promise<{ success: boolean; message: string }>;
  cancelBet: (betId: string) => Promise<{ success: boolean; message: string }>;
  validateBet: (betId: string, validated: boolean) => Promise<void>;
  getBetsByPool: (poolId: string) => Bet[];
  getBetsByUser: (userId: string) => Bet[];
  getBetCount: (poolId: string, homeScore: number, awayScore: number) => number;
  getAllBets: () => Bet[];
  finishPool: (poolId: string) => Promise<void>;
}

const BetsContext = createContext<BetsContextType | undefined>(undefined);

export function BetsProvider({ children }: { children: ReactNode }) {
  const { pools, updatePool } = usePools();
  const { matches } = useMatches();
  const [bets, setBets] = useState<Bet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBets = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted: Bet[] = data.map(b => ({
          id: b.id,
          poolId: b.pool_id,
          userId: b.user_id,
          userName: b.user_name,
          userPhone: b.user_phone || undefined,
          homeScore: b.home_score,
          awayScore: b.away_score,
          validated: b.validated,
          won: b.won ?? undefined,
          isManualBet: b.is_manual_bet,
          createdAt: b.created_at
        }));
        setBets(formatted);
      }
    } catch (err) {
      console.error('Erro ao buscar apostas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
  }, []);

  const createBet = async (betData: Omit<Bet, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> => {
    const pool = pools.find(p => p.id === betData.poolId);
    if (!pool) return { success: false, message: 'Bolão não encontrado' };
    
    // Verificações de negócio
    if (pool.status !== 'open') return { success: false, message: 'Bolão fechado' };
    
    const sameScoreCount = bets.filter(b => b.poolId === betData.poolId && b.homeScore === betData.homeScore && b.awayScore === betData.awayScore).length;
    if (sameScoreCount >= pool.maxRepeatedBets) {
      return { success: false, message: `Limite de ${pool.maxRepeatedBets} palpites para este placar atingido.` };
    }

    const { error } = await supabase
      .from('bets')
      .insert({
        pool_id: betData.poolId,
        user_id: betData.userId,
        user_name: betData.userName,
        user_phone: betData.userPhone,
        home_score: betData.homeScore,
        away_score: betData.away_score,
        is_manual_bet: betData.isManualBet,
        validated: betData.validated
      });

    if (error) return { success: false, message: error.message };
    await fetchBets();
    return { success: true, message: 'Palpite registrado com sucesso!' };
  };

  const createManualBet = async (betData: Omit<Bet, 'id' | 'createdAt' | 'userId' | 'isManualBet'> & { userName: string; userPhone: string }): Promise<{ success: boolean; message: string }> => {
    return createBet({
      ...betData,
      userId: `manual_${Date.now()}`,
      isManualBet: true
    });
  };

  const cancelBet = async (betId: string): Promise<{ success: boolean; message: string }> => {
    const { error } = await supabase.from('bets').delete().eq('id', betId);
    if (error) return { success: false, message: error.message };
    await fetchBets();
    return { success: true, message: 'Palpite cancelado.' };
  };

  const validateBet = async (betId: string, validated: boolean) => {
    const { error } = await supabase.from('bets').update({ validated }).eq('id', betId);
    if (error) throw error;
    await fetchBets();
  };

  const getBetsByPool = (poolId: string): Bet[] => bets.filter(b => b.poolId === poolId);
  const getBetsByUser = (userId: string): Bet[] => bets.filter(b => b.userId === userId);
  
  const getBetCount = (poolId: string, homeScore: number, awayScore: number): number => {
    return bets.filter(b => b.poolId === poolId && b.homeScore === homeScore && b.awayScore === awayScore).length;
  };

  const getAllBets = (): Bet[] => bets;

  const finishPool = async (poolId: string) => {
    const pool = pools.find(p => p.id === poolId);
    if (!pool) return;
    
    const match = matches.find(m => m.id === pool.matchId);
    if (!match || match.homeScore === undefined || match.awayScore === undefined) return;
    
    const poolBets = bets.filter(b => b.poolId === poolId && b.validated);
    
    for (const bet of poolBets) {
      const won = bet.homeScore === match.homeScore && bet.awayScore === match.awayScore;
      await supabase.from('bets').update({ won }).eq('id', bet.id);
    }
    
    await updatePool(poolId, { status: 'finished' });
    await fetchBets();
  };

  return (
    <BetsContext.Provider value={{
      bets,
      isLoading,
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
  if (context === undefined) throw new Error('useBets must be used within a BetsProvider');
  return context;
}
