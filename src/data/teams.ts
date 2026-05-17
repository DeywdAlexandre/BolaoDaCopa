import { Team } from '../types';

export const teams: Team[] = [
  // Grupo A
  { id: '1', name: 'México', code: 'MEX', flag: '🇲🇽', iso: 'mx', group: 'A' },
  { id: '3', name: 'África do Sul', code: 'RSA', flag: '🇿🇦', iso: 'za', group: 'A' },
  { id: '4', name: 'Coreia do Sul', code: 'KOR', flag: '🇰🇷', iso: 'kr', group: 'A' },
  { id: '2', name: 'República Tcheca', code: 'CZE', flag: '🇨🇿', iso: 'cz', group: 'A' },
  
  // Grupo B
  { id: '5', name: 'Canadá', code: 'CAN', flag: '🇨🇦', iso: 'ca', group: 'B' },
  { id: '6', name: 'Bósnia', code: 'BIH', flag: '🇧🇦', iso: 'ba', group: 'B' },
  { id: '7', name: 'Catar', code: 'QAT', flag: '🇶🇦', iso: 'qa', group: 'B' },
  { id: '8', name: 'Suíça', code: 'SUI', flag: '🇨🇭', iso: 'ch', group: 'B' },
  
  // Grupo C
  { id: '9', name: 'Brasil', code: 'BRA', flag: '🇧🇷', iso: 'br', group: 'C' },
  { id: '10', name: 'Marrocos', code: 'MAR', flag: '🇲🇦', iso: 'ma', group: 'C' },
  { id: '11', name: 'Haiti', code: 'HAI', flag: '🇭🇹', iso: 'ht', group: 'C' },
  { id: '12', name: 'Escócia', code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', iso: 'gb-sct', group: 'C' },
  
  // Grupo D
  { id: '13', name: 'Estados Unidos', code: 'USA', flag: '🇺🇸', iso: 'us', group: 'D' },
  { id: '14', name: 'Paraguai', code: 'PAR', flag: '🇵🇾', iso: 'py', group: 'D' },
  { id: '15', name: 'Austrália', code: 'AUS', flag: '🇦🇺', iso: 'au', group: 'D' },
  { id: '16', name: 'Turquia', code: 'TUR', flag: '🇹🇷', iso: 'tr', group: 'D' },
  
  // Grupo E
  { id: '17', name: 'Alemanha', code: 'GER', flag: '🇩🇪', iso: 'de', group: 'E' },
  { id: '18', name: 'Curaçao', code: 'CUW', flag: '🇨🇼', iso: 'cw', group: 'E' },
  { id: '19', name: 'Costa do Marfim', code: 'CIV', flag: '🇨🇮', iso: 'ci', group: 'E' },
  { id: '20', name: 'Equador', code: 'ECU', flag: '🇪🇨', iso: 'ec', group: 'E' },
  
  // Grupo F
  { id: '21', name: 'Holanda', code: 'NED', flag: '🇳🇱', iso: 'nl', group: 'F' },
  { id: '22', name: 'Japão', code: 'JPN', flag: '🇯🇵', iso: 'jp', group: 'F' },
  { id: '23', name: 'Suécia', code: 'SWE', flag: '🇸🇪', iso: 'se', group: 'F' },
  { id: '24', name: 'Tunísia', code: 'TUN', flag: '🇹🇳', iso: 'tn', group: 'F' },
  
  // Grupo G
  { id: '25', name: 'Bélgica', code: 'BEL', flag: '🇧🇪', iso: 'be', group: 'G' },
  { id: '26', name: 'Egito', code: 'EGY', flag: '🇪🇬', iso: 'eg', group: 'G' },
  { id: '27', name: 'Irã', code: 'IRN', flag: '🇮🇷', iso: 'ir', group: 'G' },
  { id: '28', name: 'Nova Zelândia', code: 'NZL', flag: '🇳🇿', iso: 'nz', group: 'G' },
  
  // Grupo H
  { id: '29', name: 'Espanha', code: 'ESP', flag: '🇪🇸', iso: 'es', group: 'H' },
  { id: '30', name: 'Cabo Verde', code: 'CPV', flag: '🇨🇻', iso: 'cv', group: 'H' },
  { id: '31', name: 'Arábia Saudita', code: 'KSA', flag: '🇸🇦', iso: 'sa', group: 'H' },
  { id: '32', name: 'Uruguai', code: 'URU', flag: '🇺🇾', iso: 'uy', group: 'H' },
  
  // Grupo I
  { id: '33', name: 'França', code: 'FRA', flag: '🇫🇷', iso: 'fr', group: 'I' },
  { id: '34', name: 'Senegal', code: 'SEN', flag: '🇸🇳', iso: 'sn', group: 'I' },
  { id: '35', name: 'Iraque', code: 'IRQ', flag: '🇮🇶', iso: 'iq', group: 'I' },
  { id: '36', name: 'Noruega', code: 'NOR', flag: '🇳🇴', iso: 'no', group: 'I' },
  
  // Grupo J
  { id: '37', name: 'Argentina', code: 'ARG', flag: '🇦🇷', iso: 'ar', group: 'J' },
  { id: '38', name: 'Argélia', code: 'ALG', flag: '🇩🇿', iso: 'dz', group: 'J' },
  { id: '39', name: 'Áustria', code: 'AUT', flag: '🇦🇹', iso: 'at', group: 'J' },
  { id: '40', name: 'Jordânia', code: 'JOR', flag: '🇯🇴', iso: 'jo', group: 'J' },
  
  // Grupo K
  { id: '41', name: 'Portugal', code: 'POR', flag: '🇵🇹', iso: 'pt', group: 'K' },
  { id: '42', name: 'RD Congo', code: 'COD', flag: '🇨🇩', iso: 'cd', group: 'K' },
  { id: '43', name: 'Uzbequistão', code: 'UZB', flag: '🇺🇿', iso: 'uz', group: 'K' },
  { id: '44', name: 'Colômbia', code: 'COL', flag: '🇨🇴', iso: 'co', group: 'K' },
  
  // Grupo L
  { id: '45', name: 'Inglaterra', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', iso: 'gb-eng', group: 'L' },
  { id: '46', name: 'Croácia', code: 'CRO', flag: '🇭🇷', iso: 'hr', group: 'L' },
  { id: '47', name: 'Gana', code: 'GHA', flag: '🇬🇭', iso: 'gh', group: 'L' },
  { id: '48', name: 'Panamá', code: 'PAN', flag: '🇵🇦', iso: 'pa', group: 'L' },

  // Seleções extras (participam de amistosos mas não estão nos grupos da Copa)
  { id: '49', name: 'Egito', code: 'EGY', flag: '🇪🇬', iso: 'eg' },
  { id: '50', name: 'Finlândia', code: 'FIN', flag: '🇫🇮', iso: 'fi' },
  { id: '51', name: 'Nova Zelândia', code: 'NZL', flag: '🇳🇿', iso: 'nz' },
  { id: '52', name: 'Honduras', code: 'HON', flag: '🇭🇳', iso: 'hn' },
  { id: '53', name: 'Sérvia', code: 'SRB', flag: '🇷🇸', iso: 'rs' },
  { id: '54', name: 'Costa Rica', code: 'CRC', flag: '🇨🇷', iso: 'cr' },
  { id: '55', name: 'Peru', code: 'PER', flag: '🇵🇪', iso: 'pe' },
];

export const TBD_TEAM: Team = { id: 'tbd', name: 'A definir', code: 'TBD', flag: '❓' };

export const getTeamById = (id: string): Team | undefined => {
  return teams.find(t => t.id === id);
};

export const getTeamByCode = (code: string): Team | undefined => {
  return teams.find(t => t.code === code);
};

export const getTeamsByGroup = (group: string): Team[] => {
  return teams.filter(t => t.group === group);
};
