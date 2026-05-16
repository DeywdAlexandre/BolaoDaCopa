import { Pool, Bet, AuthorizedManager } from '../../types';

export function ManagersTab({
  managers, pools, bets, newEmail, setNewEmail, newName, setNewName,
  newFee, setNewFee, showSuccess, onAdd, onToggleBlock, onRemove,
  editingManager, setEditingManager, editFee, setEditFee, onUpdateFee
}: {
  managers: AuthorizedManager[]; pools: Pool[]; bets: Bet[];
  newEmail: string; setNewEmail: (v: string) => void;
  newName: string; setNewName: (v: string) => void;
  newFee: string; setNewFee: (v: string) => void;
  showSuccess: string | null; onAdd: () => void;
  onToggleBlock: (m: AuthorizedManager) => void;
  onRemove: (id: string, name: string) => void;
  editingManager: string | null; setEditingManager: (id: string | null) => void;
  editFee: string; setEditFee: (v: string) => void; onUpdateFee: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span>➕</span> Autorizar Novo Gerente</h2>
        {showSuccess && <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2"><span>✅</span> {showSuccess}</div>}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Nome" value={newName} onChange={(e) => setNewName(e.target.value)} className="input-field" />
          <input type="email" placeholder="Email Google" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="input-field" />
          <div className="relative"><input type="number" placeholder="Taxa %" value={newFee} onChange={(e) => setNewFee(e.target.value)} min="0" max="50" className="input-field pr-8" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span></div>
          <button onClick={onAdd} className="btn-primary">Autorizar</button>
        </div>
        <p className="text-xs text-gray-400 mt-3">Taxa da plataforma: percentual que você recebe sobre o total arrecadado.</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span>👔</span> Gerentes ({managers.length})</h2>
        {managers.length === 0 ? (<div className="text-center py-8 text-gray-400"><div className="text-4xl mb-2">📋</div><p>Nenhum gerente ainda</p></div>) : (
          <div className="space-y-3">
            {managers.map((manager) => {
              const mPools = pools.filter(p => p.managerCode === manager.code);
              const mBets = bets.filter(b => mPools.some(p => p.id === b.poolId));
              const isEditing = editingManager === manager.id;
              return (
                <div key={manager.id} className={`p-4 rounded-xl border-2 ${manager.blocked ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${manager.blocked ? 'bg-red-200' : 'bg-green-100'}`}>{manager.blocked ? '🚫' : '👔'}</div>
                      <div>
                        <div className="font-semibold text-gray-800 flex items-center gap-2">{manager.name}{manager.blocked && <span className="text-xs bg-red-200 text-red-700 px-2 py-0.5 rounded">BLOQUEADO</span>}</div>
                        <div className="text-sm text-gray-500">{manager.email}</div>
                        {manager.panelName && <div className="text-xs text-blue-600 font-semibold mt-1 italic">"{manager.panelName}"</div>}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-mono font-bold">{manager.code}</div>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input type="number" value={editFee} onChange={(e) => setEditFee(e.target.value)} className="w-16 px-2 py-1 border rounded text-center" min="0" max="50" /><span>%</span>
                          <button onClick={() => onUpdateFee(manager.id)} className="text-green-600 hover:text-green-800">✓</button>
                          <button onClick={() => setEditingManager(null)} className="text-red-600 hover:text-red-800">✕</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingManager(manager.id); setEditFee(manager.platformFee.toString()); }} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm hover:bg-yellow-200">Taxa: {manager.platformFee}%</button>
                      )}
                      <div className="text-sm text-gray-500">{mPools.length} bolões • {mBets.length} palpites</div>
                      <button onClick={() => onToggleBlock(manager)} className={`px-3 py-1 rounded-lg text-sm font-semibold ${manager.blocked ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}>{manager.blocked ? '✓ Desbloquear' : '🔒 Bloquear'}</button>
                      <button onClick={() => onRemove(manager.id, manager.name)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg">🗑️</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
