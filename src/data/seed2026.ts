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
  { id: 'irn', name: 'Irã', code: 'IRN', iso: 'ir', flag: '🇮🇷' },
  // Adicionando mais seleções para chegar aos 12 grupos
  // Grupo G
  { id: 'sui', name: 'Suíça', code: 'SUI', iso: 'ch', flag: '🇨🇭' },
  { id: 'den', name: 'Dinamarca', code: 'DEN', iso: 'dk', flag: '🇩🇰' },
  { id: 'srb', name: 'Sérvia', code: 'SRB', iso: 'rs', flag: '🇷🇸' },
  { id: 'pol', name: 'Polônia', code: 'POL', iso: 'pl', flag: '🇵🇱' },
  // Grupo H
  { id: 'per', name: 'Peru', code: 'PER', iso: 'pe', flag: '🇵🇪' },
  { id: 'chi', name: 'Chile', code: 'CHI', iso: 'cl', flag: '🇨🇱' },
  { id: 'ecu', name: 'Equador', code: 'ECU', iso: 'ec', flag: '🇪🇨' },
  { id: 'par', name: 'Paraguai', code: 'PAR', iso: 'py', flag: '🇵🇾' },
  // Grupo I
  { id: 'egy', name: 'Egito', code: 'EGY', iso: 'eg', flag: '🇪🇬' },
  { id: 'nga', name: 'Nigéria', code: 'NGA', iso: 'ng', flag: '🇳🇬' },
  { id: 'tun', name: 'Tunísia', code: 'TUN', iso: 'tn', flag: '🇹🇳' },
  { id: 'alg', name: 'Argélia', code: 'ALG', iso: 'dz', flag: '🇩🇿' },
  // Grupo J
  { id: 'swe', name: 'Suécia', code: 'SWE', iso: 'se', flag: '🇸🇪' },
  { id: 'nor', name: 'Noruega', code: 'NOR', iso: 'no', flag: '🇳🇴' },
  { id: 'tur', name: 'Turquia', code: 'TUR', iso: 'tr', flag: '🇹🇷' },
  { id: 'gre', name: 'Grécia', code: 'GRE', iso: 'gr', flag: '🇬🇷' },
  // Grupo K
  { id: 'ukr', name: 'Ucrânia', code: 'UKR', iso: 'ua', flag: '🇺🇦' },
  { id: 'aut', name: 'Áustria', code: 'AUT', iso: 'at', flag: '🇦🇹' },
  { id: 'cze', name: 'Rep. Tcheca', code: 'CZE', iso: 'cz', flag: '🇨🇿' },
  { id: 'sco', name: 'Escócia', code: 'SCO', iso: 'gb-sct', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  // Grupo L
  { id: 'qat', name: 'Catar', code: 'QAT', iso: 'qa', flag: '🇶🇦' },
  { id: 'uae', name: 'Emirados Árabes', code: 'UAE', iso: 'ae', flag: '🇦🇪' },
  { id: 'oma', name: 'Omã', code: 'OMA', iso: 'om', flag: '🇴🇲' },
  { id: 'irq', name: 'Iraque', code: 'IRQ', iso: 'iq', flag: '🇮🇶' }
];

export const generateInitialMatches = (): Partial<Match>[] => {
  const matches: Partial<Match>[] = [];
  const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  
  // Data inicial da Copa 2026: 11 de Junho
  const startDate = new Date('2026-06-11');

  groupNames.forEach((group, groupIdx) => {
    const groupTeams = teams2026.slice(groupIdx * 4, (groupIdx + 1) * 4);
    if (groupTeams.length < 4) return;

    const baseId = 3000 + groupIdx * 100;

    // Rodada 1: Dias 0 a 4 do torneio
    const r1Date = new Date(startDate);
    r1Date.setDate(startDate.getDate() + (groupIdx % 4));
    const r1Str = r1Date.toISOString().split('T')[0];

    matches.push({ external_id: baseId + 1, homeTeam: groupTeams[0], awayTeam: groupTeams[1], date: r1Str, time: '13:00', group, phase: 'group', finished: false });
    matches.push({ external_id: baseId + 2, homeTeam: groupTeams[2], awayTeam: groupTeams[3], date: r1Str, time: '16:00', group, phase: 'group', finished: false });

    // Rodada 2: Dias 5 a 9 do torneio
    const r2Date = new Date(startDate);
    r2Date.setDate(startDate.getDate() + 5 + (groupIdx % 4));
    const r2Str = r2Date.toISOString().split('T')[0];

    matches.push({ external_id: baseId + 3, homeTeam: groupTeams[0], awayTeam: groupTeams[2], date: r2Str, time: '16:00', group, phase: 'group', finished: false });
    matches.push({ external_id: baseId + 4, homeTeam: groupTeams[1], awayTeam: groupTeams[3], date: r2Str, time: '19:00', group, phase: 'group', finished: false });

    // Rodada 3: Dias 10 a 14 do torneio
    const r3Date = new Date(startDate);
    r3Date.setDate(startDate.getDate() + 10 + (groupIdx % 4));
    const r3Str = r3Date.toISOString().split('T')[0];

    matches.push({ external_id: baseId + 5, homeTeam: groupTeams[3], awayTeam: groupTeams[0], date: r3Str, time: '15:00', group, phase: 'group', finished: false });
    matches.push({ external_id: baseId + 6, homeTeam: groupTeams[1], awayTeam: groupTeams[2], date: r3Str, time: '15:00', group, phase: 'group', finished: false });
  });

  return matches;
};
