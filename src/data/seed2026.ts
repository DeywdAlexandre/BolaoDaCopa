import { Team, Match } from '../types';

export const teams2026: Team[] = [
  // Grupo A
  { id: 'mex', name: 'México', code: 'MEX', iso: 'mx', flag: '🇲🇽' },
  { id: 'rsa', name: 'África do Sul', code: 'RSA', iso: 'za', flag: '🇿🇦' },
  { id: 'kor', name: 'Coreia do Sul', code: 'KOR', iso: 'kr', flag: '🇰🇷' },
  { id: 'cze', name: 'Tchéquia', code: 'CZE', iso: 'cz', flag: '🇨🇿' },
  // Grupo B
  { id: 'can', name: 'Canadá', code: 'CAN', iso: 'ca', flag: '🇨🇦' },
  { id: 'bih', name: 'Bósnia e Herzegovina', code: 'BIH', iso: 'ba', flag: '🇧🇦' },
  { id: 'qat', name: 'Catar', code: 'QAT', iso: 'qa', flag: '🇶🇦' },
  { id: 'sui', name: 'Suíça', code: 'SUI', iso: 'ch', flag: '🇨🇭' },
  // Grupo C
  { id: 'bra', name: 'Brasil', code: 'BRA', iso: 'br', flag: '🇧🇷' },
  { id: 'mar', name: 'Marrocos', code: 'MAR', iso: 'ma', flag: '🇲🇦' },
  { id: 'hai', name: 'Haiti', code: 'HAI', iso: 'ht', flag: '🇭🇹' },
  { id: 'sco', name: 'Escócia', code: 'SCO', iso: 'gb-sct', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  // Grupo D
  { id: 'usa', name: 'Estados Unidos', code: 'USA', iso: 'us', flag: '🇺🇸' },
  { id: 'par', name: 'Paraguai', code: 'PAR', iso: 'py', flag: '🇵🇾' },
  { id: 'aus', name: 'Austrália', code: 'AUS', iso: 'au', flag: '🇦🇺' },
  { id: 'tur', name: 'Turquia', code: 'TUR', iso: 'tr', flag: '🇹🇷' },
  // Grupo E
  { id: 'ger', name: 'Alemanha', code: 'GER', iso: 'de', flag: '🇩🇪' },
  { id: 'cuw', name: 'Curaçao', code: 'CUW', iso: 'cw', flag: '🇨🇼' },
  { id: 'civ', name: 'Costa do Marfim', code: 'CIV', iso: 'ci', flag: '🇨🇮' },
  { id: 'ecu', name: 'Equador', code: 'ECU', iso: 'ec', flag: '🇪🇨' },
  // Grupo F
  { id: 'ned', name: 'Holanda', code: 'NED', iso: 'nl', flag: '🇳🇱' },
  { id: 'jpn', name: 'Japão', code: 'JPN', iso: 'jp', flag: '🇯🇵' },
  { id: 'swe', name: 'Suécia', code: 'SWE', iso: 'se', flag: '🇸🇪' },
  { id: 'tun', name: 'Tunísia', code: 'TUN', iso: 'tn', flag: '🇹🇳' },
  // Grupo G
  { id: 'bel', name: 'Bélgica', code: 'BEL', iso: 'be', flag: '🇧🇪' },
  { id: 'egy', name: 'Egito', code: 'EGY', iso: 'eg', flag: '🇪🇬' },
  { id: 'irn', name: 'Irã', code: 'IRN', iso: 'ir', flag: '🇮🇷' },
  { id: 'nzl', name: 'Nova Zelândia', code: 'NZL', iso: 'nz', flag: '🇳🇿' },
  // Grupo H
  { id: 'esp', name: 'Espanha', code: 'ESP', iso: 'es', flag: '🇪🇸' },
  { id: 'cpv', name: 'Cabo Verde', code: 'CPV', iso: 'cv', flag: '🇨🇻' },
  { id: 'sau', name: 'Arábia Saudita', code: 'SAU', iso: 'sa', flag: '🇸🇦' },
  { id: 'uru', name: 'Uruguai', code: 'URU', iso: 'uy', flag: '🇺🇾' },
  // Grupo I
  { id: 'fra', name: 'França', code: 'FRA', iso: 'fr', flag: '🇫🇷' },
  { id: 'sen', name: 'Senegal', code: 'SEN', iso: 'sn', flag: '🇸🇳' },
  { id: 'irq', name: 'Iraque', code: 'IRQ', iso: 'iq', flag: '🇮🇶' },
  { id: 'nor', name: 'Noruega', code: 'NOR', iso: 'no', flag: '🇳🇴' },
  // Grupo J
  { id: 'arg', name: 'Argentina', code: 'ARG', iso: 'ar', flag: '🇦🇷' },
  { id: 'alg', name: 'Argélia', code: 'ALG', iso: 'dz', flag: '🇩🇿' },
  { id: 'aut', name: 'Áustria', code: 'AUT', iso: 'at', flag: '🇦🇹' },
  { id: 'jor', name: 'Jordânia', code: 'JOR', iso: 'jo', flag: '🇯🇴' },
  // Grupo K
  { id: 'por', name: 'Portugal', code: 'POR', iso: 'pt', flag: '🇵🇹' },
  { id: 'cod', name: 'RD Congo', code: 'COD', iso: 'cd', flag: '🇨🇩' },
  { id: 'uzb', name: 'Uzbequistão', code: 'UZB', iso: 'uz', flag: '🇺🇿' },
  { id: 'col', name: 'Colômbia', code: 'COL', iso: 'co', flag: '🇨🇴' },
  // Grupo L
  { id: 'eng', name: 'Inglaterra', code: 'ENG', iso: 'gb-eng', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'cro', name: 'Croácia', code: 'CRO', iso: 'hr', flag: '🇭🇷' },
  { id: 'gha', name: 'Gana', code: 'GHA', iso: 'gh', flag: '🇬🇭' },
  { id: 'pan', name: 'Panamá', code: 'PAN', iso: 'pa', flag: '🇵🇦' }
];

export const generateInitialMatches = (): Partial<Match>[] => {
  const matches: Partial<Match>[] = [];
  const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const startDate = new Date('2026-06-11');

  groupNames.forEach((group, idx) => {
    const teams = teams2026.slice(idx * 4, (idx + 1) * 4);
    const baseId = 4000 + idx * 10;
    
    // Rodada 1
    const d1 = new Date(startDate); d1.setDate(startDate.getDate() + (idx % 3));
    matches.push({ external_id: baseId + 1, homeTeam: teams[0], awayTeam: teams[1], date: d1.toISOString().split('T')[0], time: '13:00', group, phase: 'group', finished: false });
    matches.push({ external_id: baseId + 2, homeTeam: teams[2], awayTeam: teams[3], date: d1.toISOString().split('T')[0], time: '16:00', group, phase: 'group', finished: false });

    // Rodada 2
    const d2 = new Date(startDate); d2.setDate(startDate.getDate() + 5 + (idx % 3));
    matches.push({ external_id: baseId + 3, homeTeam: teams[0], awayTeam: teams[2], date: d2.toISOString().split('T')[0], time: '16:00', group, phase: 'group', finished: false });
    matches.push({ external_id: baseId + 4, homeTeam: teams[1], awayTeam: teams[3], date: d2.toISOString().split('T')[0], time: '19:00', group, phase: 'group', finished: false });

    // Rodada 3
    const d3 = new Date(startDate); d3.setDate(startDate.getDate() + 10 + (idx % 3));
    matches.push({ external_id: baseId + 5, homeTeam: teams[3], awayTeam: teams[0], date: d3.toISOString().split('T')[0], time: '15:00', group, phase: 'group', finished: false });
    matches.push({ external_id: baseId + 6, homeTeam: teams[1], awayTeam: teams[2], date: d3.toISOString().split('T')[0], time: '15:00', group, phase: 'group', finished: false });
  });

  return matches;
};
