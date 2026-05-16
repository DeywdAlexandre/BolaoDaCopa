import { Team, Match } from '../types';

export const teams2026: Team[] = [
  // Grupo A
  { id: 'usa', name: 'Estados Unidos', code: 'USA', iso: 'us', flag: '🇺🇸' },
  { id: 'mex', name: 'México', code: 'MEX', iso: 'mx', flag: '🇲🇽' },
  { id: 'can', name: 'Canadá', code: 'CAN', iso: 'ca', flag: '🇨🇦' },
  { id: 'pan', name: 'Panamá', code: 'PAN', iso: 'pa', flag: '🇵🇦' },
  // Grupo B
  { id: 'bra', name: 'Brasil', code: 'BRA', iso: 'br', flag: '🇧🇷' },
  { id: 'arg', name: 'Argentina', code: 'ARG', iso: 'ar', flag: '🇦🇷' },
  { id: 'uru', name: 'Uruguai', code: 'URU', iso: 'uy', flag: '🇺🇾' },
  { id: 'col', name: 'Colômbia', code: 'COL', iso: 'co', flag: '🇨🇴' },
  // Grupo C
  { id: 'fra', name: 'França', code: 'FRA', iso: 'fr', flag: '🇫🇷' },
  { id: 'esp', name: 'Espanha', code: 'ESP', iso: 'es', flag: '🇪🇸' },
  { id: 'ger', name: 'Alemanha', code: 'GER', iso: 'de', flag: '🇩🇪' },
  { id: 'ita', name: 'Itália', code: 'ITA', iso: 'it', flag: '🇮🇹' },
  // Grupo D
  { id: 'eng', name: 'Inglaterra', code: 'ENG', iso: 'gb-eng', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'por', name: 'Portugal', code: 'POR', iso: 'pt', flag: '🇵🇹' },
  { id: 'bel', name: 'Bélgica', code: 'BEL', iso: 'be', flag: '🇧🇪' },
  { id: 'ned', name: 'Holanda', code: 'NED', iso: 'nl', flag: '🇳🇱' },
  // Grupo E
  { id: 'cro', name: 'Croácia', code: 'CRO', iso: 'hr', flag: '🇭🇷' },
  { id: 'mar', name: 'Marrocos', code: 'MAR', iso: 'ma', flag: '🇲🇦' },
  { id: 'jpn', name: 'Japão', code: 'JPN', iso: 'jp', flag: '🇯🇵' },
  { id: 'sen', name: 'Senegal', code: 'SEN', iso: 'sn', flag: '🇸🇳' },
  // Grupo F
  { id: 'kor', name: 'Coreia do Sul', code: 'KOR', iso: 'kr', flag: '🇰🇷' },
  { id: 'aus', name: 'Austrália', code: 'AUS', iso: 'au', flag: '🇦🇺' },
  { id: 'sau', name: 'Arábia Saudita', code: 'SAU', iso: 'sa', flag: '🇸🇦' },
  { id: 'irn', name: 'Irã', code: 'IRN', iso: 'ir', flag: '🇮🇷' }
];

export const generateInitialMatches = (): Partial<Match>[] => {
  const matches: Partial<Match>[] = [];
  const groups = ['A', 'B', 'C', 'D', 'E', 'F']; 
  const dates = ['2026-06-11', '2026-06-12', '2026-06-13', '2026-06-14', '2026-06-15', '2026-06-16'];

  groups.forEach((group, idx) => {
    const groupTeams = teams2026.slice(idx * 4, (idx + 1) * 4);
    if (groupTeams.length < 4) return;

    const baseId = 2000 + idx * 100;
    const matchDate = dates[idx % dates.length];

    // Rodada 1
    matches.push({ external_id: baseId + 1, homeTeam: groupTeams[0], awayTeam: groupTeams[1], date: matchDate, time: '13:00', group, phase: 'group', finished: false });
    matches.push({ external_id: baseId + 2, homeTeam: groupTeams[2], awayTeam: groupTeams[3], date: matchDate, time: '16:00', group, phase: 'group', finished: false });

    // Rodada 2
    matches.push({ external_id: baseId + 3, homeTeam: groupTeams[0], awayTeam: groupTeams[2], date: matchDate, time: '19:00', group, phase: 'group', finished: false });
    matches.push({ external_id: baseId + 4, homeTeam: groupTeams[1], awayTeam: groupTeams[3], date: matchDate, time: '21:00', group, phase: 'group', finished: false });

    // Rodada 3
    matches.push({ external_id: baseId + 5, homeTeam: groupTeams[3], awayTeam: groupTeams[0], date: matchDate, time: '15:00', group, phase: 'group', finished: false });
    matches.push({ external_id: baseId + 6, homeTeam: groupTeams[1], awayTeam: groupTeams[2], date: matchDate, time: '15:00', group, phase: 'group', finished: false });
  });

  return matches;
};
