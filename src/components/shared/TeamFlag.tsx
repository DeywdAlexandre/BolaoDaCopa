import { Team } from '../../types';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<Size, string> = {
  xs: 'w-5 h-4',
  sm: 'w-7 h-5',
  md: 'w-9 h-7',
  lg: 'w-12 h-9',
  xl: 'w-16 h-12',
};

const fallbackTextSize: Record<Size, string> = {
  xs: 'text-sm',
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

export function TeamFlag({ team, size = 'md' }: { team: Team; size?: Size }) {
  if (!team.iso) {
    return <span className={fallbackTextSize[size]}>{team.flag}</span>;
  }

  return (
    <img 
      src={`https://flagcdn.com/w80/${team.iso}.png`}
      srcSet={`https://flagcdn.com/w160/${team.iso}.png 2x`}
      alt={team.name}
      className={`${sizeClasses[size]} object-cover rounded-sm shadow-sm inline-block`}
      loading="lazy"
      onError={(e) => {
        // Fallback para emoji se imagem falhar
        const span = document.createElement('span');
        span.textContent = team.flag;
        span.className = fallbackTextSize[size];
        (e.target as HTMLElement).replaceWith(span);
      }}
    />
  );
}

// Componente para exibir time completo: bandeira + nome ou código
export function TeamBadge({ team, size = 'md', showName = false, showCode = true, className = '' }: { 
  team: Team; size?: Size; showName?: boolean; showCode?: boolean; className?: string 
}) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <TeamFlag team={team} size={size} />
      {showName && <span className="font-semibold text-sm truncate">{team.name}</span>}
      {showCode && !showName && <span className="font-semibold text-xs">{team.code}</span>}
    </div>
  );
}

// Componente para confronto: Time A vs Time B
export function MatchHeader({ homeTeam, awayTeam, size = 'lg', showNames = true }: {
  homeTeam: Team; awayTeam: Team; size?: Size; showNames?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <div className="text-center shrink-0">
        <TeamFlag team={homeTeam} size={size} />
        <div className="text-xs font-semibold mt-1">{homeTeam.code}</div>
      </div>
      <div className="text-xl md:text-2xl font-bold text-gray-300">VS</div>
      <div className="text-center shrink-0">
        <TeamFlag team={awayTeam} size={size} />
        <div className="text-xs font-semibold mt-1">{awayTeam.code}</div>
      </div>
      {showNames && (
        <div className="ml-1 md:ml-2 min-w-0">
          <div className="font-bold text-gray-800 text-sm md:text-base truncate">
            {homeTeam.name} x {awayTeam.name}
          </div>
        </div>
      )}
    </div>
  );
}
