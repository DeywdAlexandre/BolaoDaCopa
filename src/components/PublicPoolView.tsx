import { useState } from 'react';
import { usePools } from '../contexts/PoolsContext';
import { useMatches } from '../contexts/MatchesContext';
import { useBets } from '../contexts/BetsContext';
import { useManagers } from '../contexts/ManagersContext';
import { usePoolStats } from '../hooks/usePoolStats';
import { TeamFlag } from './shared/TeamFlag';

export function PublicPoolView({ poolId, onBack }: { poolId: string; onBack: () => void }) {
  const { pools, isLoading: isPoolsLoading } = usePools();
  const { matches, isLoading: isMatchesLoading } = useMatches();
  const { getBetsByPool, createBet } = useBets();
  const { getManagerByCode, isLoading: isManagersLoading } = useManagers();

  const pool = pools.find(p => p.id === poolId);
  const match = matches.find(m => m.id === pool?.matchId);
  const manager = pool ? getManagerByCode(pool.managerCode) : null;
  const stats = usePoolStats(pool);
  const bets = getBetsByPool(poolId);
  const validatedBets = bets.filter(b => b.validated);

  const [anonName, setAnonName] = useState('');
  const [anonPhone, setAnonPhone] = useState('');
  const [anonHomeScore, setAnonHomeScore] = useState('');
  const [anonAwayScore, setAnonAwayScore] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successBetDetails, setSuccessBetDetails] = useState<{ name: string; phone: string; score: string } | null>(null);

  if (isPoolsLoading || isMatchesLoading || isManagersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-emerald-800">
        <div className="text-center text-white">
          <div className="text-6xl animate-bounce mb-4">⚽</div>
          <p className="font-semibold text-lg animate-pulse">Buscando dados do bolão...</p>
          <p className="text-xs text-white/60 mt-1">Carregando informações do servidor</p>
        </div>
      </div>
    );
  }

  if (!pool || !match || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Bolão não encontrado</h1>
          <p className="text-gray-500 mb-6">O link pode estar expirado ou incorreto.</p>
          <button onClick={onBack} className="btn-primary w-full">Voltar para o Início</button>
        </div>
      </div>
    );
  }

  const statusLabels = { open: 'Aberto', closed: 'Fechado', finished: 'Finalizado' };
  const statusColors = { open: 'bg-green-100 text-green-700', closed: 'bg-yellow-100 text-yellow-700', finished: 'bg-gray-100 text-gray-700' };

  const handleAnonBetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anonName.trim() || !anonPhone.trim() || anonHomeScore === '' || anonAwayScore === '') {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const homeGols = parseInt(anonHomeScore);
    const awayGols = parseInt(anonAwayScore);

    // Validação de limite no frontend (para garantia visual e feedback imediato)
    const scoreKey = `${homeGols}x${awayGols}`;
    const scoreCount = validatedBets.filter(b => `${b.homeScore}x${b.awayScore}` === scoreKey).length;
    if (scoreCount >= pool.maxRepeatedBets) {
      alert(`O placar ${homeGols}x${awayGols} já atingiu o limite de ${pool.maxRepeatedBets} palpites repetidos.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const anonUserId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      const result = await createBet({
        poolId: pool.id,
        matchId: match.id,
        userId: anonUserId,
        userName: anonName.trim(),
        userPhone: anonPhone.trim(),
        homeScore: homeGols,
        awayScore: awayGols,
        isManualBet: false,
        validated: false
      });

      if (result.success) {
        setSuccessBetDetails({
          name: anonName.trim(),
          phone: anonPhone.trim(),
          score: `${homeGols}x${awayGols}`
        });
        setAnonName('');
        setAnonPhone('');
        setAnonHomeScore('');
        setAnonAwayScore('');
        setShowSuccessModal(true);
      } else {
        alert(result.message || 'Erro ao registrar palpite');
      }
    } catch (err: any) {
      console.error('Erro ao enviar palpite anônimo:', err);
      alert('Erro de conexão ao enviar palpite.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentHome = anonHomeScore === '' ? null : parseInt(anonHomeScore);
  const currentAway = anonAwayScore === '' ? null : parseInt(anonAwayScore);
  const isCurrentScoreInvalid = (() => {
    if (currentHome === null || currentAway === null) return false;
    const scoreKey = `${currentHome}x${currentAway}`;
    const scoreCount = validatedBets.filter(b => `${b.homeScore}x${b.awayScore}` === scoreKey).length;
    return scoreCount >= pool.maxRepeatedBets;
  })();

  const cleanPhone = manager?.phone ? manager.phone.replace(/\D/g, '') : '';
  const finalCleanPhone = (cleanPhone && cleanPhone.length <= 11) ? '55' + cleanPhone : cleanPhone;

  const textMsg = successBetDetails ? `Olá ${manager?.name || 'Gerente'}! Acabei de registrar meu palpite no seu bolão (Copa 2026):
⚽ ${match.homeTeam.name} ${successBetDetails.score.split('x')[0]} x ${successBetDetails.score.split('x')[1]} ${match.awayTeam.name}
👤 Apostador: ${successBetDetails.name}
📞 WhatsApp: ${successBetDetails.phone}

Estou enviando o comprovante do pagamento de R$ ${pool.betValue.toFixed(2)} para validação!` : '';

  const whatsappLink = `https://wa.me/${finalCleanPhone}?text=${encodeURIComponent(textMsg)}`;

  return (
    <div className="min-h-screen p-4 md:p-6 pb-20">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Cabeçalho do Bolão */}
        <div className="card animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="text-sm text-gray-500 hover:text-green-600 flex items-center gap-1">
              <span>←</span> Voltar
            </button>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[pool.status]}`}>
              {statusLabels[pool.status]}
            </span>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-6 md:gap-10">
              <div className="flex flex-col items-center">
                <TeamFlag team={match.homeTeam} size="lg" />
                <span className="font-bold mt-2">{match.homeTeam.code}</span>
              </div>
              <div className="flex flex-col items-center">
                {match.finished ? (
                  <div className="text-3xl md:text-5xl font-black text-gray-800">{match.homeScore} x {match.awayScore}</div>
                ) : (
                  <div className="text-2xl md:text-4xl font-black text-gray-300 italic">VS</div>
                )}
                <span className="text-xs text-gray-400 mt-2 font-mono uppercase tracking-widest">{match.phase === 'group' ? `Grupo ${match.group}` : 'Mata-mata'}</span>
              </div>
              <div className="flex flex-col items-center">
                <TeamFlag team={match.awayTeam} size="lg" />
                <span className="font-bold mt-2">{match.awayTeam.code}</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">{manager?.panelName || `Bolão de ${manager?.name}`}</h1>
              <p className="text-gray-500 text-sm">Organizado por <strong>{manager?.name}</strong></p>
            </div>
          </div>
        </div>

        {/* Estatísticas do Bolão */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card p-4 text-center">
            <div className="text-gray-500 text-xs mb-1">Custo</div>
            <div className="text-lg font-bold text-gray-800">R$ {pool.betValue}</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-gray-500 text-xs mb-1">Apostadores</div>
            <div className="text-lg font-bold text-gray-800">{validatedBets.length}</div>
          </div>
          <div className="card p-4 text-center bg-green-50 border-green-200">
            <div className="text-green-600 text-xs font-semibold mb-1">Arrecadado</div>
            <div className="text-lg font-bold text-green-700">R$ {stats.totalCollected.toFixed(0)}</div>
          </div>
          <div className="card p-4 text-center bg-blue-50 border-blue-200">
            <div className="text-blue-600 text-xs font-semibold mb-1">Prêmio Total</div>
            <div className="text-lg font-bold text-blue-700">R$ {stats.prizePool.toFixed(0)}</div>
          </div>
        </div>

        {pool.status === 'open' && (
          <div className="card border-2 border-green-200 bg-gradient-to-r from-green-50/50 to-emerald-50/20 animate-fade-in-up">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🎯</span> Enviar Palpite Rápido (Sem Login)
            </h2>
            <form onSubmit={handleAnonBetSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Seu Nome Completo *</label>
                  <input 
                    type="text" 
                    value={anonName} 
                    onChange={(e) => setAnonName(e.target.value)} 
                    placeholder="Ex: João da Silva" 
                    className="input-field" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Seu WhatsApp / Celular *</label>
                  <input 
                    type="tel" 
                    value={anonPhone} 
                    onChange={(e) => setAnonPhone(e.target.value)} 
                    placeholder="Ex: (11) 99999-9999" 
                    className="input-field" 
                    required 
                  />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Seu Palpite de Placar</span>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <TeamFlag team={match.homeTeam} size="md" />
                    <span className="text-xs font-bold text-gray-500 mt-1">{match.homeTeam.code}</span>
                  </div>
                  <input 
                    type="number" 
                    min="0" 
                    max="15" 
                    value={anonHomeScore} 
                    onChange={(e) => setAnonHomeScore(e.target.value)} 
                    className="w-16 h-12 text-center text-2xl font-black border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" 
                    required 
                  />
                  <span className="text-xl font-black text-gray-300">x</span>
                  <input 
                    type="number" 
                    min="0" 
                    max="15" 
                    value={anonAwayScore} 
                    onChange={(e) => setAnonAwayScore(e.target.value)} 
                    className="w-16 h-12 text-center text-2xl font-black border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" 
                    required 
                  />
                  <div className="flex flex-col items-center">
                    <TeamFlag team={match.awayTeam} size="md" />
                    <span className="text-xs font-bold text-gray-500 mt-1">{match.awayTeam.code}</span>
                  </div>
                </div>

                {isCurrentScoreInvalid && (
                  <div className="text-xs text-red-600 font-bold bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg animate-pulse flex items-center gap-1.5 mt-2">
                    <span>⚠️</span> Este placar atingiu o limite de {pool.maxRepeatedBets} palpites repetidos! Escolha outro placar.
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || isCurrentScoreInvalid} 
                className={`btn-primary w-full py-3 text-lg font-bold shadow-lg transition-all ${
                  isCurrentScoreInvalid ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400 hover:shadow-none' : ''
                }`}
              >
                {isSubmitting ? 'Enviando...' : '🎯 Confirmar meu Palpite!'}
              </button>
            </form>
          </div>
        )}

        {/* Mural de Palpites Agrupado / Resultados */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span>{pool.status === 'finished' ? '🏆 Resultado Final' : '🎫 Mural de Palpites'}</span>
            </h2>
            {pool.status === 'finished' && (
              <div className="text-right">
                <div className="text-[10px] text-gray-400 uppercase font-bold">Prêmio por Ganhador</div>
                <div className="text-lg font-black text-green-600">R$ {stats.prizePerWinner.toFixed(2)}</div>
              </div>
            )}
          </div>
          
          {pool.status === 'finished' && stats.winnersCount > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-inner text-white">
              <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80 text-center">Ganhadores Oficiais</div>
              <div className="flex flex-wrap justify-center gap-2">
                {validatedBets.filter(b => b.won).map(winner => (
                  <div key={winner.id} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-white/30">
                    <span>🥇</span> {winner.userName}
                  </div>
                ))}
              </div>
            </div>
          )}

          {validatedBets.length === 0 ? (
            <div className="text-center py-10 text-gray-400 italic">Nenhum palpite validado ainda.</div>
          ) : (
            <div className="space-y-4">
              {/* Lógica de Agrupamento */}
              {(() => {
                const groups: Record<string, typeof validatedBets> = {};
                validatedBets.forEach(bet => {
                  const key = `${bet.homeScore}x${bet.awayScore}`;
                  if (!groups[key]) groups[key] = [];
                  groups[key].push(bet);
                });

                // Ordenar grupos por placar
                const sortedKeys = Object.keys(groups).sort((a, b) => {
                  const [ah, aa] = a.split('x').map(Number);
                  const [bh, ba] = b.split('x').map(Number);
                  return ah - bh || aa - ba;
                });

                const isMatchFinished = match.finished;
                const matchResultKey = isMatchFinished ? `${match.homeScore}x${match.awayScore}` : null;

                return sortedKeys.map(key => {
                  const groupBets = groups[key];
                  const [h, a] = key.split('x');
                  const isLimitReached = groupBets.length >= pool.maxRepeatedBets;
                  const isWinnerGroup = key === matchResultKey;

                  return (
                    <div key={key} className={`rounded-xl border-2 transition-all ${
                      isWinnerGroup ? 'border-yellow-400 bg-yellow-50 shadow-md scale-[1.02]' : 
                      isLimitReached ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'
                    }`}>
                      <div className="p-3 flex items-center justify-between border-b border-inherit">
                        <div className="flex items-center gap-3">
                          <div className={`text-xl font-black px-4 py-1 rounded-lg ${
                            isWinnerGroup ? 'bg-yellow-500 text-white animate-pulse' :
                            isLimitReached ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'
                          }`}>
                            {h} x {a}
                          </div>
                          {isWinnerGroup && (
                            <span className="text-[10px] font-bold bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded uppercase tracking-tighter">
                              Placar Correto 🏆
                            </span>
                          )}
                          {isLimitReached && !isWinnerGroup && (
                            <span className="text-[10px] font-bold bg-red-200 text-red-700 px-2 py-0.5 rounded uppercase tracking-tighter">
                              Limite Atingido
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-gray-500">
                          {groupBets.length} {groupBets.length === 1 ? 'aposta' : 'apostas'}
                        </div>
                      </div>
                      <div className="p-3 flex flex-wrap gap-2">
                        {groupBets.map(bet => (
                          <div key={bet.id} className={`px-3 py-1 rounded-full text-sm border shadow-sm flex items-center gap-1 ${
                            isWinnerGroup ? 'bg-yellow-100 border-yellow-200 text-yellow-800 font-bold' : 'bg-white border-gray-100 text-gray-700 font-medium'
                          }`}>
                            <span>{bet.userName}</span>
                            {bet.won && <span className="text-xs">🏆</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center">
              Limite de repetições por placar: <strong>{pool.maxRepeatedBets}</strong>
            </p>
          </div>
        </div>

        {/* Footer da Página Pública */}
        <div className="text-center text-gray-400 text-xs py-4">
          🏆 Bolão Copa 2026 - Transparência e Diversão
        </div>

        {showSuccessModal && successBetDetails && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-100 shadow-2xl space-y-6 text-center animate-scale-up">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
                🎉
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-800">Palpite Registrado!</h3>
                <p className="text-gray-500 text-sm mt-1">Seu palpite foi enviado pendente de validação</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 text-left text-sm font-medium">
                <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-400">Apostador:</span><span className="text-gray-800 font-bold">{successBetDetails.name}</span></div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-400">Palpite:</span><span className="text-green-700 font-extrabold">{match.homeTeam.flag} {match.homeTeam.code} {successBetDetails.score.split('x')[0]} x {successBetDetails.score.split('x')[1]} {match.awayTeam.code} {match.awayTeam.flag}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Valor da Aposta:</span><span className="text-gray-800 font-bold">R$ {pool.betValue.toFixed(2)}</span></div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800 leading-relaxed text-left">
                ⚠️ <strong>Atenção:</strong> Para que seu palpite seja validado e apareça oficialmente no mural de palpites públicos, você precisa enviar o comprovante de pagamento para o gerente.
              </div>

              {manager?.phone ? (
                <div className="space-y-3">
                  <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => setShowSuccessModal(false)}
                    className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-600 shadow-md hover:shadow-lg transition-all animate-bounce"
                  >
                    <span>📱</span> Enviar Comprovante no WhatsApp
                  </a>
                  <button onClick={() => setShowSuccessModal(false)} className="text-xs text-gray-400 hover:text-gray-600 font-semibold block mx-auto underline">
                    Fechar e Ver o Mural
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-red-500 font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100">
                    ℹ️ O gerente deste bolão não cadastrou um número de WhatsApp no painel. Contate-o diretamente para enviar o comprovante.
                  </div>
                  <button onClick={() => setShowSuccessModal(false)} className="btn-primary w-full">
                    Concluído
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
