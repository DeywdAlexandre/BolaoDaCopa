import { Match, Pool, Bet } from '../../types';
import { TeamFlag } from '../shared/TeamFlag';

export function MyBets({ bets, matches, pools }: { bets: Bet[]; matches: Match[]; pools: Pool[] }) {
  const getMatch = (matchId: string) => matches.find(m => m.id === matchId);
  const getPool = (poolId: string) => pools.find(p => p.id === poolId);

  if (bets.length === 0) {
    return (<div className="card text-center py-12"><div className="text-5xl mb-4">🎫</div><h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum palpite ainda</h3><p className="text-gray-500">Faça seu primeiro palpite nos bolões disponíveis!</p></div>);
  }

  return (
    <div className="space-y-3">
      {bets.map(bet => {
        const match = getMatch(bet.matchId);
        const pool = getPool(bet.poolId);
        if (!match || !pool) return null;
        return (
          <div key={bet.id} className={`card border-l-4 ${bet.won === true ? 'border-l-green-500 bg-green-50' : bet.won === false ? 'border-l-red-300 bg-red-50' : bet.validated ? 'border-l-green-400' : 'border-l-yellow-400'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TeamFlag team={match.homeTeam} size="sm" />
                  <span className="font-bold text-lg">{bet.homeScore}</span>
                  <span className="text-gray-400">x</span>
                  <span className="font-bold text-lg">{bet.awayScore}</span>
                  <TeamFlag team={match.awayTeam} size="sm" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{match.homeTeam.name} x {match.awayTeam.name}</div>
                  <div className="text-sm text-gray-500">{new Date(match.date + 'T12:00:00').toLocaleDateString('pt-BR')} • R$ {pool.betValue}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {bet.won === true && <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">🏆 ACERTOU!</span>}
                {bet.won === false && <span className="bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm font-bold">❌ Errou</span>}
                {bet.won === undefined && <span className={`px-3 py-1 rounded-full text-sm font-semibold ${bet.validated ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{bet.validated ? '✅ Validado' : '⏳ Aguardando pagamento'}</span>}
              </div>
            </div>
            {match.finished && match.homeScore !== undefined && <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-500">Placar final: <strong>{match.homeScore} x {match.awayScore}</strong></div>}
          </div>
        );
      })}
    </div>
  );
}
