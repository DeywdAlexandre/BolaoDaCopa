import { AuthorizedManager } from '../../types';
import { AdminStats } from '../../hooks/useAdminStats';

export function FinancesTab({ stats, managers }: { stats: AdminStats; managers: AuthorizedManager[] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200"><div className="text-3xl mb-2">💵</div><div className="text-3xl font-bold text-green-600">R$ {stats.totalCollected.toFixed(2)}</div><div className="text-gray-600">Total Arrecadado</div></div>
        <div className="card text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200"><div className="text-3xl mb-2">👑</div><div className="text-3xl font-bold text-yellow-600">R$ {stats.totalPlatformFees.toFixed(2)}</div><div className="text-gray-600">Sua Comissão</div></div>
        <div className="card text-center"><div className="text-3xl mb-2">📊</div><div className="text-3xl font-bold text-blue-600">{stats.totalCollected > 0 ? ((stats.totalPlatformFees / stats.totalCollected) * 100).toFixed(1) : 0}%</div><div className="text-gray-600">Taxa Média</div></div>
      </div>
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span>👔</span> Comissões por Gerente</h3>
        {stats.pendingFeesByManager.length === 0 ? (<div className="text-center py-8 text-gray-400"><p>Nenhuma comissão pendente</p></div>) : (
          <div className="space-y-3">
            {stats.pendingFeesByManager.map(item => {
              const mgr = managers.find(m => m.id === item.managerId);
              return (
                <div key={item.managerId} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-xl gap-4">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">👔</div><div><div className="font-semibold">{item.managerName}</div><div className="text-sm text-gray-500 font-mono">{item.managerCode}</div></div></div>
                  <div className="flex items-center gap-4"><div className="text-sm text-gray-500">Taxa: {mgr?.platformFee || 0}%</div><div className="text-xl font-bold text-yellow-600">R$ {item.pending.toFixed(2)}</div></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span>⚙️</span> Taxas Configuradas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-200"><th className="text-left py-3 px-2">Gerente</th><th className="text-left py-3 px-2">Código</th><th className="text-center py-3 px-2">Taxa</th><th className="text-center py-3 px-2">Status</th></tr></thead>
            <tbody>{managers.map(m => (
              <tr key={m.id} className="border-b border-gray-100">
                <td className="py-2 px-2 font-semibold">{m.name}</td>
                <td className="py-2 px-2 font-mono text-green-600">{m.code}</td>
                <td className="py-2 px-2 text-center"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">{m.platformFee}%</span></td>
                <td className="py-2 px-2 text-center">{m.blocked ? <span className="bg-red-100 text-red-700 px-2 py-1 rounded">Bloqueado</span> : <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Ativo</span>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
