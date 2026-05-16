export function Leaderboard({
  entries, currentUserId
}: {
  entries: { userId: string; userName: string; exactHits: number; totalBets: number; totalWon: number }[];
  currentUserId: string;
}) {
  if (entries.length === 0) {
    return (<div className="card text-center py-12"><div className="text-5xl mb-4">🏆</div><h3 className="text-xl font-bold text-gray-700 mb-2">Ranking em construção</h3><p className="text-gray-500">Aguarde os jogos terminarem!</p></div>);
  }

  let currentPosition = 0;
  let lastHits = -1;
  const rankedEntries = entries.map((entry, index) => {
    if (entry.exactHits !== lastHits) { currentPosition = index + 1; lastHits = entry.exactHits; }
    return { ...entry, position: currentPosition };
  });

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><span>🏆</span> Ranking de Acertos Exatos</h2>
      <div className="space-y-2">
        {rankedEntries.map((entry) => {
          const isCurrentUser = entry.userId === currentUserId;
          const medals = ['🥇', '🥈', '🥉'];
          return (
            <div key={entry.userId} className={`flex items-center gap-4 p-4 rounded-xl ${isCurrentUser ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-gray-50'}`}>
              <div className="text-2xl w-10 text-center">{entry.position <= 3 ? medals[entry.position - 1] : `${entry.position}º`}</div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">{entry.userName[0]?.toUpperCase()}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{entry.userName}{isCurrentUser && <span className="text-xs text-yellow-600 ml-2">(você)</span>}</div>
                <div className="text-sm text-gray-500">{entry.totalBets} palpites</div>
              </div>
              <div className="text-right"><div className="text-xl font-bold text-green-600">{entry.exactHits}</div><div className="text-xs text-gray-500">acertos</div></div>
              {entry.totalWon > 0 && <div className="text-right ml-4"><div className="text-lg font-bold text-yellow-600">R$ {entry.totalWon.toFixed(2)}</div><div className="text-xs text-gray-500">ganhos</div></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
