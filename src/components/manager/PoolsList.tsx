import { Match, Pool } from '../../types';
import { TeamFlag } from '../shared/TeamFlag';
import { usePoolStats } from '../../hooks/usePoolStats';

function PoolCard({ 
  pool, match, onClose, onFinish, onDelete, onReopen, getBetsByPool 
}: { 
  pool: Pool; 
  match: Match; 
  onClose: (id: string) => void;
  onFinish: (id: string) => void;
  onDelete: (id: string) => void;
  onReopen: (id: string) => void;
  getBetsByPool: (id: string) => any[];
}) {
  const stats = usePoolStats(pool);
  if (!stats) return null;

  const statusColors = { open: 'bg-green-100 text-green-700', closed: 'bg-yellow-100 text-yellow-700', finished: 'bg-gray-100 text-gray-700' };
  const statusLabels = { open: 'Aberto', closed: 'Fechado', finished: 'Finalizado' };
  const deadline = new Date(pool.bettingDeadline);
  const isExpired = new Date() > deadline;
  const canDelete = pool.status !== 'finished' && stats.validatedBetsCount === 0;

  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="text-center"><TeamFlag team={match.homeTeam} size="lg" /><div className="text-xs font-semibold mt-1">{match.homeTeam.code}</div></div>
          <div className="text-gray-400 font-bold">VS</div>
          <div className="text-center"><TeamFlag team={match.awayTeam} size="lg" /><div className="text-xs font-semibold mt-1">{match.awayTeam.code}</div></div>
          <div className="ml-4"><div className="font-bold text-gray-800">{match.homeTeam.name} x {match.awayTeam.name}</div><div className="text-sm text-gray-500">{new Date(match.date + 'T12:00:00').toLocaleDateString('pt-BR')} às {match.time}</div></div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${pool.includeExtraTime ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{pool.includeExtraTime ? '⏱️ Com Prorrogação' : '⚽ Tempo Normal'}</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[pool.status]}`}>{statusLabels[pool.status]}</span>
        </div>
      </div>

      <div className={`text-sm mb-4 p-2 rounded-lg ${isExpired ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
        ⏰ Prazo: {deadline.toLocaleDateString('pt-BR')} às {deadline.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}{isExpired && ' (Encerrado)'}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 mb-4 text-center">
        <div className="bg-gray-50 rounded-lg p-2 md:p-3"><div className="text-xs text-gray-500">Valor</div><div className="font-bold text-green-600 text-sm md:text-base">R$ {pool.betValue}</div></div>
        <div className="bg-gray-50 rounded-lg p-2 md:p-3"><div className="text-xs text-gray-500">Palpites</div><div className="font-bold text-sm md:text-base">{stats.validatedBetsCount}/{stats.totalBets}</div></div>
        <div className="bg-gray-50 rounded-lg p-2 md:p-3"><div className="text-xs text-gray-500">Arrecadado</div><div className="font-bold text-green-600 text-sm md:text-base">R$ {stats.totalCollected.toFixed(0)}</div></div>
        <div className="bg-gray-50 rounded-lg p-2 md:p-3"><div className="text-xs text-gray-500">Taxa ({pool.maintenanceFee}%)</div><div className="font-bold text-yellow-600 text-sm md:text-base">R$ {stats.managerFeeAmount.toFixed(0)}</div></div>
        <div className="bg-gray-50 rounded-lg p-2 md:p-3"><div className="text-xs text-gray-500">Prêmio</div><div className="font-bold text-blue-600 text-sm md:text-base">R$ {stats.prizePool.toFixed(0)}</div></div>
      </div>

      {pool.status === 'finished' && (
        <div className="bg-green-50 rounded-lg p-3 mb-4 text-center">
          <span className="text-green-700 font-semibold">🏆 {stats.winnersCount} vencedor(es) - R$ {stats.prizePerWinner.toFixed(2)} cada</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {pool.status === 'open' && <button onClick={() => onClose(pool.id)} className="text-sm bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200">Fechar Palpites</button>}
        {pool.status === 'closed' && (
          <>
            <button onClick={() => onReopen(pool.id)} className="text-sm bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200">Reabrir</button>
            <button onClick={() => onFinish(pool.id)} className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200">Finalizar e Calcular</button>
          </>
        )}
        {pool.status === 'finished' && (
          <button 
            onClick={() => {
              const vBets = getBetsByPool(pool.id).filter(b => b.validated);
              const winners = vBets.filter(b => b.won);
              const winnersText = winners.length > 0 
                ? winners.map((w, i) => `${i + 1}. ${w.userName}`).join('\n')
                : 'Nenhum acertador exato.';
              
              const text = `🏁 *RESULTADO FINAL - ${match.homeTeam.name} ${match.homeScore} x ${match.awayScore} ${match.awayTeam.name}*\n\n🏆 *GANHADORES DO DIA:*\n${winnersText}\n\n💰 *Total de Prêmios: R$ ${stats.prizePool.toFixed(0)}*\n\nParabéns aos feras! ⚽🔥`;
              
              if (navigator.share) {
                navigator.share({ title: 'Resultado do Bolão', text }).catch(() => {});
              } else {
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }
            }}
            className="text-sm bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2"
          >
            📢 Anunciar Vencedores
          </button>
        )}
        <button 
          onClick={() => {
            const url = `${window.location.origin}${window.location.pathname}?view-pool=${pool.id}`;
            const text = `🏆 *Mural de Apostas - ${match.homeTeam.code} x ${match.awayTeam.code}*\n💰 Prêmio: R$ ${stats.prizePool.toFixed(0)}\n🎫 Acompanhe os palpites em tempo real:\n${url}`;
            if (navigator.share) {
              navigator.share({ title: 'Mural de Apostas', text, url }).catch(() => {});
            } else {
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }
          }}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          📡 Compartilhar Mural
        </button>
        {canDelete ? <button onClick={() => onDelete(pool.id)} className="text-sm bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200">Excluir</button> : <span className="text-sm text-gray-400 px-4 py-2">🔒 Protegido</span>}
      </div>
    </div>
  );
}

export function PoolsList({ 
  pools, getMatch, onClose, onFinish, onDelete, onReopen, getBetsByPool 
}: {
  pools: Pool[];
  getMatch: (id: string) => Match | undefined;
  onClose: (id: string) => void;
  onFinish: (id: string) => void;
  onDelete: (id: string) => void;
  onReopen: (id: string) => void;
  getBetsByPool: (id: string) => any[];
}) {
  if (pools.length === 0) {
    return (<div className="card text-center py-12"><div className="text-5xl mb-4">🎯</div><h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum bolão criado</h3><p className="text-gray-500">Crie seu primeiro bolão!</p></div>);
  }

  return (
    <div className="space-y-4">
      {pools.map(pool => {
        const match = getMatch(pool.matchId);
        if (!match) return null;
        return (
          <PoolCard 
            key={pool.id} 
            pool={pool} 
            match={match} 
            onClose={onClose} 
            onFinish={onFinish} 
            onDelete={onDelete} 
            onReopen={onReopen} 
            getBetsByPool={getBetsByPool}
          />
        );
      })}
    </div>
  );
}
