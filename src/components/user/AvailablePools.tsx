import { useState } from 'react';
import { Match, Pool, Bet } from '../../types';
import { TeamFlag } from '../shared/TeamFlag';
import { useToast } from '../shared/Toast';

export function AvailablePools({
  pools, matches, userId, userName, myBets, createBet, getBetCount, getBetsByPool
}: {
  pools: Pool[]; matches: Match[]; userId: string; userName: string; myBets: Bet[];
  createBet: (bet: Omit<Bet, 'id' | 'createdAt'>) => { success: boolean; message: string };
  getBetCount: (poolId: string, homeScore: number, awayScore: number) => number;
  getBetsByPool: (poolId: string) => Bet[];
}) {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [homeScore, setHomeScore] = useState('0');
  const [awayScore, setAwayScore] = useState('0');
  const [showBets, setShowBets] = useState<string | null>(null);

  const { toast } = useToast();
  const getMatch = (matchId: string) => matches.find(m => m.id === matchId);
  
  const handleBet = (poolId: string, matchId: string) => {
    const result = createBet({ poolId, matchId, userId, userName, homeScore: parseInt(homeScore), awayScore: parseInt(awayScore), validated: false, isManualBet: false });
    if (result.success) { setSelectedPool(null); setHomeScore('0'); setAwayScore('0'); toast('Palpite registrado! Aguarde validação do gerente.', 'success'); }
    else toast(result.message, 'error');
  };

  if (pools.length === 0) {
    return (<div className="card text-center py-12"><div className="text-5xl mb-4">🎯</div><h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum bolão disponível</h3><p className="text-gray-500">Aguarde seu gerente criar novos bolões!</p></div>);
  }

  return (
    <div className="space-y-4">
      {pools.map(pool => {
        const match = getMatch(pool.matchId);
        if (!match) return null;
        const alreadyBet = myBets.some(b => b.poolId === pool.id);
        const isEditing = selectedPool === pool.id;
        const isShowingBets = showBets === pool.id;
        const poolBets = getBetsByPool(pool.id);
        const currentBetCount = isEditing ? getBetCount(pool.id, parseInt(homeScore || '0'), parseInt(awayScore || '0')) : 0;
        const isScoreFull = currentBetCount >= pool.maxRepeatedBets;
        const deadline = new Date(pool.bettingDeadline);
        const now = new Date();
        const isExpired = now > deadline;
        const timeLeft = deadline.getTime() - now.getTime();
        const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const betsByScore = poolBets.reduce((acc, bet) => { const key = `${bet.homeScore}-${bet.awayScore}`; if (!acc[key]) acc[key] = []; acc[key].push(bet); return acc; }, {} as Record<string, Bet[]>);

        return (
          <div key={pool.id} className="card animate-fade-in-up">
            {/* Header do Jogo */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-center shrink-0">
                  <TeamFlag team={match.homeTeam} size="lg" />
                  <div className="text-xs font-semibold mt-1">{match.homeTeam.code}</div>
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-300">VS</div>
                <div className="text-center shrink-0">
                  <TeamFlag team={match.awayTeam} size="lg" />
                  <div className="text-xs font-semibold mt-1">{match.awayTeam.code}</div>
                </div>
                <div className="ml-1 md:ml-2 min-w-0">
                  <div className="font-bold text-gray-800 text-sm md:text-base truncate">{match.homeTeam.name} x {match.awayTeam.name}</div>
                  <div className="text-xs md:text-sm text-gray-500">{new Date(match.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })} às {match.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl md:text-2xl font-bold text-green-600">R$ {pool.betValue}</div>
                <div className="text-xs text-gray-500">por palpite</div>
              </div>
            </div>

            {/* Modalidade */}
            <div className={`text-center py-2 px-4 rounded-lg mb-3 text-sm font-semibold ${pool.includeExtraTime ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
              {pool.includeExtraTime ? '⏱️ Modalidade: Tempo Normal + Prorrogação' : '⚽ Modalidade: Apenas Tempo Normal (90 min)'}
            </div>

            {/* Prazo */}
            <div className={`text-center py-2 px-4 rounded-lg mb-3 text-sm ${isExpired ? 'bg-red-100 text-red-700 border border-red-200' : timeLeft < 3600000 ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {isExpired ? '🚫 Prazo encerrado' : (<>⏰ Prazo: {deadline.toLocaleDateString('pt-BR')} às {deadline.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}{timeLeft < 86400000 && <span className="ml-2 font-bold">(Faltam {hoursLeft}h {minutesLeft}min)</span>}</>)}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4 text-xs">
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">Máx. {pool.maxRepeatedBets} palpites iguais</span>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">📊 {poolBets.length} palpite(s)</span>
              {pool.bonusAmount > 0 && <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded">🎁 Bônus: R$ {pool.bonusAmount}</span>}
            </div>

            {/* Ver Palpites */}
            {poolBets.length > 0 && (
              <button onClick={() => setShowBets(isShowingBets ? null : pool.id)} className="w-full mb-4 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                {isShowingBets ? '🔼 Ocultar palpites' : `🔽 Ver ${poolBets.length} palpite(s) já feitos`}
              </button>
            )}

            {isShowingBets && (
              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Palpites neste bolão:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {Object.entries(betsByScore).map(([score, bets]) => {
                    const [home, away] = score.split('-');
                    const isFull = bets.length >= pool.maxRepeatedBets;
                    return (
                      <div key={score} className={`flex items-center justify-between p-2 rounded-lg ${isFull ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-100'}`}>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg w-16 text-center">{home} x {away}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${isFull ? 'bg-red-200 text-red-700' : 'bg-green-100 text-green-700'}`}>{bets.length}/{pool.maxRepeatedBets}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {bets.map(bet => (
                            <span key={bet.id} className={`text-xs px-2 py-1 rounded-full ${bet.userId === userId ? 'bg-yellow-200 text-yellow-800 font-semibold' : 'bg-gray-200 text-gray-600'}`}>{bet.userName.split(' ')[0]}{bet.validated ? ' ✓' : ' ⏳'}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Área de palpite */}
            {alreadyBet ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <span className="text-green-700 font-semibold">✅ Você já fez seu palpite</span>
                {(() => { const myBet = myBets.find(b => b.poolId === pool.id); return myBet ? (<div className="text-sm text-gray-500 mt-1">Seu palpite: <strong>{myBet.homeScore} x {myBet.awayScore}</strong> - {myBet.validated ? '✅ Validado' : '⏳ Aguardando'}</div>) : null; })()}
              </div>
            ) : isEditing ? (
              <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-4">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-500 mb-2">Seu palpite:</div>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center"><TeamFlag team={match.homeTeam} size="md" /><input type="number" min="0" max="20" value={homeScore} onChange={(e) => setHomeScore(e.target.value)} className="w-16 h-12 text-center text-2xl font-bold border-2 border-green-300 rounded-xl focus:border-green-500 focus:outline-none mt-1" /></div>
                    <span className="text-2xl font-bold text-gray-400">X</span>
                    <div className="text-center"><TeamFlag team={match.awayTeam} size="md" /><input type="number" min="0" max="20" value={awayScore} onChange={(e) => setAwayScore(e.target.value)} className="w-16 h-12 text-center text-2xl font-bold border-2 border-green-300 rounded-xl focus:border-green-500 focus:outline-none mt-1" /></div>
                  </div>
                  <div className={`mt-2 text-sm ${isScoreFull ? 'text-red-600' : 'text-gray-500'}`}>{currentBetCount}/{pool.maxRepeatedBets} apostaram neste placar</div>
                </div>
                {isScoreFull && <div className="bg-red-100 text-red-700 text-sm p-2 rounded-lg mb-3 text-center">⚠️ Limite atingido</div>}
                <div className="flex gap-2">
                  <button onClick={() => handleBet(pool.id, pool.matchId)} disabled={isScoreFull} className={`flex-1 py-3 rounded-xl font-semibold transition-all ${isScoreFull ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'btn-primary'}`}>Confirmar Palpite</button>
                  <button onClick={() => setSelectedPool(null)} className="px-4 py-3 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300">Cancelar</button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">💡 Pague R$ {pool.betValue} ao gerente para validar</p>
              </div>
            ) : isExpired ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center"><span className="text-red-700 font-semibold">🚫 Prazo encerrado</span></div>
            ) : (
              <button onClick={() => { setSelectedPool(pool.id); setHomeScore('0'); setAwayScore('0'); }} className="btn-secondary w-full">🎯 Fazer Palpite</button>
            )}
          </div>
        );
      })}
    </div>
  );
}
