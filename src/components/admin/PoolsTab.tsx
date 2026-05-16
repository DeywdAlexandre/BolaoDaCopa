import { useState } from 'react';
import { Pool, Match, Bet, AuthorizedManager } from '../../types';

export function PoolsTab({ pools, matches, managers, getBetsByPool }: { pools: Pool[]; matches: Match[]; managers: AuthorizedManager[]; getBetsByPool: (id: string) => Bet[] }) {
  const [filterManager, setFilterManager] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const filteredPools = pools.filter(p => { if (filterManager !== 'all' && p.managerCode !== filterManager) return false; if (filterStatus !== 'all' && p.status !== filterStatus) return false; return true; });
  const getMatch = (id: string) => matches.find(m => m.id === id);
  const getManager = (code: string) => managers.find(m => m.code === code);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex flex-wrap gap-4">
          <div><label className="block text-xs text-gray-500 mb-1">Gerente</label><select value={filterManager} onChange={(e) => setFilterManager(e.target.value)} className="input-field py-2"><option value="all">Todos</option>{managers.map(m => <option key={m.id} value={m.code}>{m.name} ({m.code})</option>)}</select></div>
          <div><label className="block text-xs text-gray-500 mb-1">Status</label><select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field py-2"><option value="all">Todos</option><option value="open">Aberto</option><option value="closed">Fechado</option><option value="finished">Finalizado</option></select></div>
          <div className="flex items-end"><span className="text-sm text-gray-500">{filteredPools.length} bolões</span></div>
        </div>
      </div>
      {filteredPools.length === 0 ? (<div className="card text-center py-12"><div className="text-4xl mb-2">🎯</div><p className="text-gray-500">Nenhum bolão</p></div>) : (
        <div className="space-y-3">
          {filteredPools.map(pool => {
            const match = getMatch(pool.matchId); const mgr = getManager(pool.managerCode); const pBets = getBetsByPool(pool.id); const vBets = pBets.filter(b => b.validated);
            const total = vBets.length * pool.betValue + pool.bonusAmount; const fee = total * ((mgr?.platformFee || 0) / 100);
            if (!match) return null;
            const sc = { open: 'bg-green-100 text-green-700', closed: 'bg-yellow-100 text-yellow-700', finished: 'bg-gray-200 text-gray-700' };
            return (
              <div key={pool.id} className="card">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{match.homeTeam.flag}</div>
                    <div className="text-center"><div className="font-bold text-sm">{match.homeTeam.code} x {match.awayTeam.code}</div>{match.homeScore !== undefined && <div className="text-lg font-bold">{match.homeScore} - {match.awayScore}</div>}</div>
                    <div className="text-2xl">{match.awayTeam.flag}</div>
                    <div className="ml-4 text-sm"><div className="font-semibold">{mgr?.name || '?'}</div><div className="text-gray-500 font-mono">{pool.managerCode}</div></div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className={`px-2 py-1 rounded-full font-semibold ${sc[pool.status]}`}>{pool.status === 'open' ? 'Aberto' : pool.status === 'closed' ? 'Fechado' : 'Finalizado'}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">R$ {pool.betValue}</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{pBets.length} palp.</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">R$ {total.toFixed(0)}</span>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold">Taxa: R$ {fee.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
