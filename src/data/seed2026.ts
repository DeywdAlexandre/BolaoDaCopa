import { Team, Match } from '../types';

export const teams2026: Team[] = [
  { id: 'usa', name: 'Estados Unidos', code: 'USA', iso: 'us', flag: '🇺🇸' },
  { id: 'mex', name: 'México', code: 'MEX', iso: 'mx', flag: '🇲🇽' },
  { id: 'can', name: 'Canadá', code: 'CAN', iso: 'ca', flag: '🇨🇦' },
  { id: 'bra', name: 'Brasil', code: 'BRA', iso: 'br', flag: '🇧🇷' },
  { id: 'arg', name: 'Argentina', code: 'ARG', iso: 'ar', flag: '🇦🇷' },
  { id: 'fra', name: 'França', code: 'FRA', iso: 'fr', flag: '🇫🇷' },
  { id: 'esp', name: 'Espanha', code: 'ESP', iso: 'es', flag: '🇪🇸' },
  { id: 'ger', name: 'Alemanha', code: 'GER', iso: 'de', flag: '🇩🇪' },
  { id: 'por', name: 'Portugal', code: 'POR', iso: 'pt', flag: '🇵🇹' },
  { id: 'ita', name: 'Itália', code: 'ITA', iso: 'it', flag: '🇮🇹' },
  { id: 'eng', name: 'Inglaterra', code: 'ENG', iso: 'gb-eng', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'bel', name: 'Bélgica', code: 'BEL', iso: 'be', flag: '🇧🇪' },
  { id: 'cro', name: 'Croácia', code: 'CRO', iso: 'hr', flag: '🇭🇷' },
  { id: 'ned', name: 'Holanda', code: 'NED', iso: 'nl', flag: '🇳🇱' },
  { id: 'uru', name: 'Uruguai', code: 'URU', iso: 'uy', flag: '🇺🇾' },
  { id: 'col', name: 'Colômbia', code: 'COL', iso: 'co', flag: '🇨🇴' },
  { id: 'mar', name: 'Marrocos', code: 'MAR', iso: 'ma', flag: '🇲🇦' },
  { id: 'jpn', name: 'Japão', code: 'JPN', iso: 'jp', flag: '🇯🇵' },
  { id: 'kor', name: 'Coreia do Sul', code: 'KOR', iso: 'kr', flag: '🇰🇷' },
  { id: 'sen', name: 'Senegal', code: 'SEN', iso: 'sn', flag: '🇸🇳' }
];

export const generateInitialMatches = (): Partial<Match>[] => {
  const matches: Partial<Match>[] = [];
  const groups = ['A', 'B', 'C', 'D', 'E']; // Exemplo inicial, podemos expandir

  groups.forEach((group, idx) => {
    const groupTeams = teams2026.slice(idx * 4, (idx + 1) * 4);
    if (groupTeams.length < 4) return;

    // Simular 3 rodadas por grupo
    matches.push({
      external_id: 1000 + idx * 10 + 1,
      homeTeam: groupTeams[0],
      awayTeam: groupTeams[1],
      date: '2026-06-11',
      time: '16:00',
      group,
      phase: 'group',
      finished: false
    });
    matches.push({
      external_id: 1000 + idx * 10 + 2,
      homeTeam: groupTeams[2],
      awayTeam: groupTeams[3],
      date: '2026-06-11',
      time: '20:00',
      group,
      phase: 'group',
      finished: false
    });
  });

  return matches;
};
