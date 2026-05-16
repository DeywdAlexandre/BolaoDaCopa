import { useState } from 'react';
import { Bet } from '../../types';
import { useToast } from '../shared/Toast';

export function UserProfile({
  user, onUpdateName, onLogout, bets
}: {
  user: { id: string; email: string; name: string } | null;
  onUpdateName: (name: string) => void;
  onLogout: () => void;
  bets: Bet[];
}) {
  const [name, setName] = useState(user?.name || '');
  const { toast } = useToast();

  const handleSave = () => {
    if (name.trim()) {
      onUpdateName(name.trim());
      toast('Nome atualizado!', 'success');
    }
  };

  // Estatísticas
  const totalBets = bets.length;
  const validatedBets = bets.filter(b => b.validated).length;
  const finishedBets = bets.filter(b => b.won !== undefined);
  const exactHits = finishedBets.filter(b => b.won).length;
  const hitRate = finishedBets.length > 0 ? ((exactHits / finishedBets.length) * 100).toFixed(0) : '-';

  return (
    <div className="space-y-4">
      {/* Perfil */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><span>👤</span> Meu Perfil</h2>
        <div className="max-w-md space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-3xl shadow-lg">{name?.[0]?.toUpperCase() || '👤'}</div>
            <div><div className="font-bold text-lg text-gray-800">{name || 'Sem nome'}</div><div className="text-sm text-gray-500">{user?.email}</div></div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Seu Nome (como aparece nos palpites)</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Digite seu nome" className="input-field" maxLength={50} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email (não editável)</label>
            <input type="email" value={user?.email || ''} disabled className="input-field bg-gray-100 text-gray-500 cursor-not-allowed" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex-1 btn-primary">Salvar Nome</button>
            <button onClick={onLogout} className="px-6 py-3 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-colors">Sair</button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span>📊</span> Minhas Estatísticas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🎫</div>
            <div className="text-2xl font-bold text-green-600">{totalBets}</div>
            <div className="text-xs text-gray-500">Palpites</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-2xl font-bold text-green-600">{validatedBets}</div>
            <div className="text-xs text-gray-500">Validados</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-2xl font-bold text-yellow-600">{exactHits}</div>
            <div className="text-xs text-gray-500">Acertos Exatos</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-2xl font-bold text-blue-600">{hitRate}%</div>
            <div className="text-xs text-gray-500">Taxa de Acerto</div>
          </div>
        </div>

        {finishedBets.length > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl text-center">
            <span className="text-sm text-gray-600">
              Você acertou <strong className="text-green-700">{exactHits}</strong> de <strong>{finishedBets.length}</strong> bolões finalizados
              {exactHits > 0 && ' 🎉'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
