import { AdminStats } from '../../hooks/useAdminStats';

export function DashboardTab({ stats }: { stats: AdminStats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="card text-center p-4"><div className="text-2xl md:text-3xl mb-1">👔</div><div className="text-2xl md:text-3xl font-bold text-green-600">{stats.totalManagers}</div><div className="text-gray-500 text-xs md:text-sm">Gerentes</div></div>
        <div className="card text-center p-4"><div className="text-2xl md:text-3xl mb-1">🎯</div><div className="text-2xl md:text-3xl font-bold text-green-600">{stats.totalPools}</div><div className="text-gray-500 text-xs md:text-sm">Bolões</div></div>
        <div className="card text-center p-4"><div className="text-2xl md:text-3xl mb-1">🎫</div><div className="text-2xl md:text-3xl font-bold text-green-600">{stats.totalBets}</div><div className="text-gray-500 text-xs md:text-sm">Palpites</div></div>
        <div className="card text-center p-4"><div className="text-2xl md:text-3xl mb-1">💵</div><div className="text-xl md:text-3xl font-bold text-green-600">R$ {stats.totalCollected.toFixed(0)}</div><div className="text-gray-500 text-xs md:text-sm">Arrecadado</div></div>
        <div className="col-span-2 card text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300"><div className="text-2xl md:text-3xl mb-1">👑</div><div className="text-2xl md:text-3xl font-bold text-yellow-600">R$ {stats.totalPlatformFees.toFixed(2)}</div><div className="text-gray-500 text-xs md:text-sm">Sua Comissão</div></div>
      </div>
      {stats.pendingFeesByManager.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span>💰</span> Comissões por Gerente</h3>
          <div className="space-y-2">
            {stats.pendingFeesByManager.map(item => (
              <div key={item.managerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3"><span className="font-mono bg-green-100 text-green-700 px-2 py-1 rounded text-sm">{item.managerCode}</span><span className="font-semibold">{item.managerName}</span></div>
                <span className="font-bold text-yellow-600">R$ {item.pending.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
