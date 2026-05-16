import { useState } from 'react';
import { Pool, Bet, Match } from '../../types';

export function BetsTab({ bets, pools, matches }: { bets: Bet[]; pools: Pool[]; matches: Match[] }) {
  const [filterPool, setFilterPool] = useState('all');
  const getMatch = (id: string) => matches.find(m => m.id === id);
  const getPool = (id: string) => pools.find(p => p.id === id);
  const filtered = filterPool === 'all' ? bets : bets.filter(b => b.poolId === filterPool);
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-500 mb-1">Bolão</label>
            <select value={filterPool} onChange={(e) => setFilterPool(e.target.value)} className="input-field py-2">
              <option value="all">Todos</option>
              {pools.map(p => { const m = getMatch(p.matchId); return <option key={p.id} value={p.id}>{m?.homeTeam.code} x {m?.awayTeam.code} ({p.managerCode})</option>; })}
            </select>
          </div>
          <span className="text-sm text-gray-500 pb-2">{sorted.length} palpites</span>
        </div>
      </div>

      {sorted.length === 0 ? (<div className="card text-center py-12"><div className="text-4xl mb-2">🎫</div><p className="text-gray-500">Nenhum palpite</p></div>) : (
        <>
          <div className="md:hidden space-y-3">
            {sorted.slice(0, 100).map(bet => {
              const pool = getPool(bet.poolId); const match = pool ? getMatch(pool.matchId) : null;
              return (
                <div key={bet.id} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-sm">{bet.userName}{bet.isManualBet && <span className="text-xs text-blue-600 ml-1">📝</span>}</div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${bet.validated ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{bet.validated ? '✓ Pago' : '⏳'}</span>
                  </div>
                  {bet.userPhone && <div className="text-xs text-gray-400 mb-1">📞 {bet.userPhone}</div>}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{match ? `${match.homeTeam.flag} ${match.homeTeam.code} x ${match.awayTeam.code} ${match.awayTeam.flag}` : '-'}</span>
                    <span className="font-bold text-lg">{bet.homeScore} x {bet.awayScore}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                    <span>{new Date(bet.createdAt).toLocaleDateString('pt-BR')}</span>
                    {bet.won === true && <span className="text-green-600 font-bold text-sm">🏆</span>}
                    {bet.won === false && <span className="text-red-500 text-sm">❌</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hidden md:block card overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200"><th className="text-left py-3 px-2">Usuário</th><th className="text-left py-3 px-2">Jogo</th><th className="text-center py-3 px-2">Palpite</th><th className="text-center py-3 px-2">Status</th><th className="text-center py-3 px-2">Resultado</th><th className="text-right py-3 px-2">Data</th></tr></thead>
              <tbody>{sorted.slice(0, 100).map(bet => {
                const pool = getPool(bet.poolId); const match = pool ? getMatch(pool.matchId) : null;
                return (
                  <tr key={bet.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-2"><div className="font-semibold">{bet.userName}</div>{bet.isManualBet && <div className="text-xs text-blue-600">📝 Manual</div>}{bet.userPhone && <div className="text-xs text-gray-400">{bet.userPhone}</div>}</td>
                    <td className="py-2 px-2">{match ? `${match.homeTeam.flag} ${match.homeTeam.code} x ${match.awayTeam.code} ${match.awayTeam.flag}` : '-'}</td>
                    <td className="py-2 px-2 text-center font-bold">{bet.homeScore} x {bet.awayScore}</td>
                    <td className="py-2 px-2 text-center"><span className={`px-2 py-0.5 rounded-full text-xs ${bet.validated ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{bet.validated ? '✓ Pago' : '⏳'}</span></td>
                    <td className="py-2 px-2 text-center">{bet.won === true && <span className="text-green-600 font-bold">🏆</span>}{bet.won === false && <span className="text-red-500">❌</span>}{bet.won === undefined && '-'}</td>
                    <td className="py-2 px-2 text-right text-gray-500">{new Date(bet.createdAt).toLocaleDateString('pt-BR')}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
          {sorted.length > 100 && <p className="text-center text-gray-400 text-sm py-4">Mostrando 100 de {sorted.length}</p>}
        </>
      )}
    </div>
  );
}
