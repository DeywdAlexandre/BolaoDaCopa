import { Match, Pool } from '../../types';
import { getPhaseLabel } from '../../data/matches';

export function CreatePoolForm({
  matches, selectedMatch, setSelectedMatch, betValue, setBetValue,
  maxRepeated, setMaxRepeated, includeExtraTime, setIncludeExtraTime,
  maintenanceFee, setMaintenanceFee, bonusAmount, setBonusAmount,
  bettingDeadline, setBettingDeadline, onCreate, existingPools, isBlocked
}: {
  matches: Match[]; selectedMatch: string; setSelectedMatch: (v: string) => void;
  betValue: string; setBetValue: (v: string) => void;
  maxRepeated: string; setMaxRepeated: (v: string) => void;
  includeExtraTime: boolean; setIncludeExtraTime: (v: boolean) => void;
  maintenanceFee: string; setMaintenanceFee: (v: string) => void;
  bonusAmount: string; setBonusAmount: (v: string) => void;
  bettingDeadline: string; setBettingDeadline: (v: string) => void;
  onCreate: () => void; existingPools: Pool[]; isBlocked: boolean;
}) {
  const groupedMatches = matches.reduce((acc, match) => {
    const label = match.group ? `Grupo ${match.group}` : getPhaseLabel(match.phase);
    if (!acc[label]) acc[label] = [];
    acc[label].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const selectedMatchData = matches.find(m => m.id === selectedMatch);
  const poolCountForMatch = existingPools.filter(p => p.matchId === selectedMatch).length;
  const maxDeadline = selectedMatchData ? `${selectedMatchData.date}T${selectedMatchData.time}` : '';

  if (isBlocked) {
    return (<div className="card text-center py-12"><div className="text-5xl mb-4">🚫</div><h3 className="text-xl font-bold text-red-700 mb-2">Criação Bloqueada</h3><p className="text-gray-500">Entre em contato com o administrador.</p></div>);
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><span>➕</span> Criar Novo Bolão</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Selecione o Jogo</label>
          <select value={selectedMatch} onChange={(e) => { setSelectedMatch(e.target.value); setBettingDeadline(''); }} className="input-field">
            <option value="">-- Escolha um jogo --</option>
            {Object.entries(groupedMatches).map(([group, groupMatches]) => (
              <optgroup key={group} label={group}>
                {groupMatches.map(match => {
                  const poolCount = existingPools.filter(p => p.matchId === match.id).length;
                  return (<option key={match.id} value={match.id}>{match.homeTeam.flag} {match.homeTeam.name} x {match.awayTeam.name} {match.awayTeam.flag} - {new Date(match.date + 'T12:00:00').toLocaleDateString('pt-BR')} {match.time}{poolCount > 0 ? ` (${poolCount} bolão${poolCount > 1 ? 's' : ''})` : ''}</option>);
                })}
              </optgroup>
            ))}
          </select>
        </div>
        {selectedMatchData && (
          <>
            {poolCountForMatch > 0 && <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm">ℹ️ Você já tem {poolCountForMatch} bolão(s) para este jogo.</div>}
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-6">
                <div><div className="text-4xl">{selectedMatchData.homeTeam.flag}</div><div className="font-bold">{selectedMatchData.homeTeam.name}</div></div>
                <div className="text-2xl font-bold text-gray-400">VS</div>
                <div><div className="text-4xl">{selectedMatchData.awayTeam.flag}</div><div className="font-bold">{selectedMatchData.awayTeam.name}</div></div>
              </div>
              <div className="text-sm text-gray-500 mt-2">{new Date(selectedMatchData.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} às {selectedMatchData.time}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">💰 Valor (R$)</label><input type="number" min="1" value={betValue} onChange={(e) => setBetValue(e.target.value)} className="input-field" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">🔄 Máx. Palpites Iguais</label><input type="number" min="1" max="10" value={maxRepeated} onChange={(e) => setMaxRepeated(e.target.value)} className="input-field" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">📊 Sua Taxa (%)</label><input type="number" min="0" max="50" value={maintenanceFee} onChange={(e) => setMaintenanceFee(e.target.value)} className="input-field" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">🎁 Bônus (R$)</label><input type="number" min="0" value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)} className="input-field" /></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">⏰ Prazo para Apostas (opcional)</label>
              <input type="datetime-local" value={bettingDeadline} onChange={(e) => setBettingDeadline(e.target.value)} max={maxDeadline} className="input-field" />
              <p className="text-xs text-gray-500 mt-1">Deixe vazio para usar o horário do jogo ({selectedMatchData.time}).</p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input type="checkbox" id="extraTime" checked={includeExtraTime} onChange={(e) => setIncludeExtraTime(e.target.checked)} className="w-5 h-5 text-green-600 rounded" />
              <label htmlFor="extraTime" className="text-gray-700"><span className="font-semibold">⏱️ Incluir Prorrogação</span><p className="text-sm text-gray-500">Placar da prorrogação conta (pênaltis nunca)</p></label>
            </div>
            <button onClick={onCreate} className="btn-primary w-full text-lg">🎯 Criar Bolão</button>
          </>
        )}
      </div>
    </div>
  );
}
