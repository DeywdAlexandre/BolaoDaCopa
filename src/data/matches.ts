import { Match } from '../types';
import { teams, TBD_TEAM } from './teams';

const getTeam = (code: string) => teams.find(t => t.code === code)!;
const TBD = TBD_TEAM;

export const matches: Match[] = [
  // ==================== AMISTOSOS PRÉ-COPA 2026 (Maio/Junho) ====================
  {
    id: 'fr_1',
    homeTeam: getTeam('MEX'),
    awayTeam: getTeam('AUS'),
    date: '2026-05-30',
    time: '18:30',
    stadium: 'Rose Bowl',
    city: 'Los Angeles',
    phase: 'friendly',
    finished: false
  },
  {
    id: 'fr_2',
    homeTeam: getTeam('USA'),
    awayTeam: getTeam('SEN'),
    date: '2026-05-31',
    time: '12:30',
    stadium: 'Bank of America Stadium',
    city: 'Charlotte',
    phase: 'friendly',
    finished: false
  },
  {
    id: 'fr_3',
    homeTeam: getTeam('GER'),
    awayTeam: getTeam('FIN'),
    date: '2026-05-31',
    time: '20:45',
    stadium: 'Mewa Arena',
    city: 'Mainz',
    phase: 'friendly',
    finished: false
  },
  {
    id: 'fr_4',
    homeTeam: getTeam('FRA'),
    awayTeam: getTeam('CIV'),
    date: '2026-06-04',
    time: '21:00',
    stadium: 'Stade de la Beaujoire',
    city: 'Nantes',
    phase: 'friendly',
    finished: false
  },
  {
    id: 'fr_5',
    homeTeam: getTeam('MEX'),
    awayTeam: getTeam('SRB'),
    date: '2026-06-04',
    time: '20:00',
    stadium: 'A definir',
    city: 'México',
    phase: 'friendly',
    finished: false
  },
  {
    id: 'fr_6',
    homeTeam: getTeam('USA'),
    awayTeam: getTeam('GER'),
    date: '2026-06-06',
    time: '14:00',
    stadium: 'Soldier Field',
    city: 'Chicago',
    phase: 'friendly',
    finished: false
  },
  {
    id: 'fr_7',
    homeTeam: getTeam('ENG'),
    awayTeam: getTeam('NZL'),
    date: '2026-06-06',
    time: '20:00',
    stadium: 'Raymond James Stadium',
    city: 'Tampa',
    phase: 'friendly',
    finished: false
  },
  {
    id: 'fr_8',
    homeTeam: getTeam('ARG'),
    awayTeam: getTeam('HON'),
    date: '2026-06-06',
    time: '20:00',
    stadium: 'Kyle Field',
    city: 'College Station',
    phase: 'friendly',
    finished: false
  },
  {
    id: 'fr_9',
    homeTeam: getTeam('BRA'),
    awayTeam: getTeam('EGY'),
    date: '2026-06-06',
    time: '18:00',
    stadium: 'Huntington Bank Field',
    city: 'Cleveland',
    phase: 'friendly',
    finished: false
  },
  {
    id: 'fr_10',
    homeTeam: getTeam('ESP'),
    awayTeam: getTeam('PER'),
    date: '2026-06-08',
    time: '20:00',
    stadium: 'Estadio Cuauhtémoc',
    city: 'Puebla',
    phase: 'friendly',
    finished: false
  },
  {
    id: 'fr_11',
    homeTeam: getTeam('ARG'),
    awayTeam: getTeam('AUS'),
    date: '2026-06-09',
    time: '20:00',
    stadium: 'Jordan-Hare Stadium',
    city: 'Auburn',
    phase: 'friendly',
    finished: false
  },
  {
    id: 'fr_12',
    homeTeam: getTeam('ENG'),
    awayTeam: getTeam('CRC'),
    date: '2026-06-10',
    time: '20:00',
    stadium: 'Inter&Co Stadium',
    city: 'Orlando',
    phase: 'friendly',
    finished: false
  },
  {
    id: 'fr_13',
    homeTeam: getTeam('FRA'),
    awayTeam: getTeam('SEN'),
    date: '2026-06-08',
    time: '21:00',
    stadium: 'Decathlon Arena',
    city: 'Lille',
    phase: 'friendly',
    finished: false
  },

  // ==================== COPA DO MUNDO 2026 ====================

  // GRUPO A
  {
    id: 'g1',
    homeTeam: getTeam('USA'),
    awayTeam: getTeam('JAM'),
    date: '2026-06-11',
    time: '17:00',
    stadium: 'MetLife Stadium',
    city: 'Nova Jersey',
    phase: 'group',
    group: 'A',
    finished: false
  },
  {
    id: 'g2',
    homeTeam: getTeam('MEX'),
    awayTeam: getTeam('CAN'),
    date: '2026-06-11',
    time: '20:00',
    stadium: 'Azteca Stadium',
    city: 'Cidade do México',
    phase: 'group',
    group: 'A',
    finished: false
  },
  {
    id: 'g3',
    homeTeam: getTeam('USA'),
    awayTeam: getTeam('MEX'),
    date: '2026-06-15',
    time: '17:00',
    stadium: 'AT&T Stadium',
    city: 'Dallas',
    phase: 'group',
    group: 'A',
    finished: false
  },
  {
    id: 'g4',
    homeTeam: getTeam('CAN'),
    awayTeam: getTeam('JAM'),
    date: '2026-06-15',
    time: '20:00',
    stadium: 'BMO Field',
    city: 'Toronto',
    phase: 'group',
    group: 'A',
    finished: false
  },
  {
    id: 'g5a',
    homeTeam: getTeam('USA'),
    awayTeam: getTeam('CAN'),
    date: '2026-06-19',
    time: '16:00',
    stadium: 'MetLife Stadium',
    city: 'Nova Jersey',
    phase: 'group',
    group: 'A',
    finished: false
  },
  {
    id: 'g6a',
    homeTeam: getTeam('MEX'),
    awayTeam: getTeam('JAM'),
    date: '2026-06-19',
    time: '16:00',
    stadium: 'Azteca Stadium',
    city: 'Cidade do México',
    phase: 'group',
    group: 'A',
    finished: false
  },

  // GRUPO B
  {
    id: 'g5',
    homeTeam: getTeam('BRA'),
    awayTeam: getTeam('COL'),
    date: '2026-06-12',
    time: '16:00',
    stadium: 'Hard Rock Stadium',
    city: 'Miami',
    phase: 'group',
    group: 'B',
    finished: false
  },
  {
    id: 'g6',
    homeTeam: getTeam('ARG'),
    awayTeam: getTeam('URU'),
    date: '2026-06-12',
    time: '19:00',
    stadium: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    phase: 'group',
    group: 'B',
    finished: false
  },
  {
    id: 'g7',
    homeTeam: getTeam('BRA'),
    awayTeam: getTeam('ARG'),
    date: '2026-06-16',
    time: '20:00',
    stadium: 'Rose Bowl',
    city: 'Los Angeles',
    phase: 'group',
    group: 'B',
    finished: false
  },
  {
    id: 'g8',
    homeTeam: getTeam('COL'),
    awayTeam: getTeam('URU'),
    date: '2026-06-16',
    time: '17:00',
    stadium: 'Levi\'s Stadium',
    city: 'San Francisco',
    phase: 'group',
    group: 'B',
    finished: false
  },
  {
    id: 'g9',
    homeTeam: getTeam('BRA'),
    awayTeam: getTeam('URU'),
    date: '2026-06-20',
    time: '16:00',
    stadium: 'SoFi Stadium',
    city: 'Los Angeles',
    phase: 'group',
    group: 'B',
    finished: false
  },
  {
    id: 'g10',
    homeTeam: getTeam('ARG'),
    awayTeam: getTeam('COL'),
    date: '2026-06-20',
    time: '16:00',
    stadium: 'NRG Stadium',
    city: 'Houston',
    phase: 'group',
    group: 'B',
    finished: false
  },

  // GRUPO C
  {
    id: 'g11',
    homeTeam: getTeam('FRA'),
    awayTeam: getTeam('POR'),
    date: '2026-06-12',
    time: '13:00',
    stadium: 'MetLife Stadium',
    city: 'Nova Jersey',
    phase: 'group',
    group: 'C',
    finished: false
  },
  {
    id: 'g12',
    homeTeam: getTeam('GER'),
    awayTeam: getTeam('ESP'),
    date: '2026-06-12',
    time: '16:00',
    stadium: 'AT&T Stadium',
    city: 'Dallas',
    phase: 'group',
    group: 'C',
    finished: false
  },
  {
    id: 'g13',
    homeTeam: getTeam('FRA'),
    awayTeam: getTeam('GER'),
    date: '2026-06-17',
    time: '20:00',
    stadium: 'SoFi Stadium',
    city: 'Los Angeles',
    phase: 'group',
    group: 'C',
    finished: false
  },
  {
    id: 'g14',
    homeTeam: getTeam('ESP'),
    awayTeam: getTeam('POR'),
    date: '2026-06-17',
    time: '17:00',
    stadium: 'Levi\'s Stadium',
    city: 'San Francisco',
    phase: 'group',
    group: 'C',
    finished: false
  },
  {
    id: 'g15c',
    homeTeam: getTeam('FRA'),
    awayTeam: getTeam('ESP'),
    date: '2026-06-21',
    time: '16:00',
    stadium: 'MetLife Stadium',
    city: 'Nova Jersey',
    phase: 'group',
    group: 'C',
    finished: false
  },
  {
    id: 'g16c',
    homeTeam: getTeam('GER'),
    awayTeam: getTeam('POR'),
    date: '2026-06-21',
    time: '16:00',
    stadium: 'AT&T Stadium',
    city: 'Dallas',
    phase: 'group',
    group: 'C',
    finished: false
  },

  // GRUPO D
  {
    id: 'g15',
    homeTeam: getTeam('ENG'),
    awayTeam: getTeam('DEN'),
    date: '2026-06-13',
    time: '13:00',
    stadium: 'Lincoln Financial Field',
    city: 'Filadélfia',
    phase: 'group',
    group: 'D',
    finished: false
  },
  {
    id: 'g16',
    homeTeam: getTeam('NED'),
    awayTeam: getTeam('BEL'),
    date: '2026-06-13',
    time: '16:00',
    stadium: 'Gillette Stadium',
    city: 'Boston',
    phase: 'group',
    group: 'D',
    finished: false
  },
  {
    id: 'g17',
    homeTeam: getTeam('ENG'),
    awayTeam: getTeam('NED'),
    date: '2026-06-18',
    time: '20:00',
    stadium: 'MetLife Stadium',
    city: 'Nova Jersey',
    phase: 'group',
    group: 'D',
    finished: false
  },
  {
    id: 'g18d',
    homeTeam: getTeam('BEL'),
    awayTeam: getTeam('DEN'),
    date: '2026-06-18',
    time: '17:00',
    stadium: 'Gillette Stadium',
    city: 'Boston',
    phase: 'group',
    group: 'D',
    finished: false
  },
  {
    id: 'g19d',
    homeTeam: getTeam('ENG'),
    awayTeam: getTeam('BEL'),
    date: '2026-06-22',
    time: '16:00',
    stadium: 'Lincoln Financial Field',
    city: 'Filadélfia',
    phase: 'group',
    group: 'D',
    finished: false
  },
  {
    id: 'g20d',
    homeTeam: getTeam('NED'),
    awayTeam: getTeam('DEN'),
    date: '2026-06-22',
    time: '16:00',
    stadium: 'MetLife Stadium',
    city: 'Nova Jersey',
    phase: 'group',
    group: 'D',
    finished: false
  },

  // GRUPO E
  {
    id: 'g18',
    homeTeam: getTeam('ITA'),
    awayTeam: getTeam('SRB'),
    date: '2026-06-13',
    time: '19:00',
    stadium: 'Hard Rock Stadium',
    city: 'Miami',
    phase: 'group',
    group: 'E',
    finished: false
  },
  {
    id: 'g19',
    homeTeam: getTeam('CRO'),
    awayTeam: getTeam('SUI'),
    date: '2026-06-13',
    time: '22:00',
    stadium: 'State Farm Stadium',
    city: 'Phoenix',
    phase: 'group',
    group: 'E',
    finished: false
  },
  {
    id: 'g20e',
    homeTeam: getTeam('ITA'),
    awayTeam: getTeam('CRO'),
    date: '2026-06-18',
    time: '13:00',
    stadium: 'Hard Rock Stadium',
    city: 'Miami',
    phase: 'group',
    group: 'E',
    finished: false
  },
  {
    id: 'g21e',
    homeTeam: getTeam('SUI'),
    awayTeam: getTeam('SRB'),
    date: '2026-06-18',
    time: '16:00',
    stadium: 'State Farm Stadium',
    city: 'Phoenix',
    phase: 'group',
    group: 'E',
    finished: false
  },
  {
    id: 'g22e',
    homeTeam: getTeam('ITA'),
    awayTeam: getTeam('SUI'),
    date: '2026-06-22',
    time: '20:00',
    stadium: 'Hard Rock Stadium',
    city: 'Miami',
    phase: 'group',
    group: 'E',
    finished: false
  },
  {
    id: 'g23e',
    homeTeam: getTeam('CRO'),
    awayTeam: getTeam('SRB'),
    date: '2026-06-22',
    time: '20:00',
    stadium: 'State Farm Stadium',
    city: 'Phoenix',
    phase: 'group',
    group: 'E',
    finished: false
  },

  // GRUPO F
  {
    id: 'g20',
    homeTeam: getTeam('JPN'),
    awayTeam: getTeam('KSA'),
    date: '2026-06-14',
    time: '13:00',
    stadium: 'BC Place',
    city: 'Vancouver',
    phase: 'group',
    group: 'F',
    finished: false
  },
  {
    id: 'g21',
    homeTeam: getTeam('KOR'),
    awayTeam: getTeam('AUS'),
    date: '2026-06-14',
    time: '16:00',
    stadium: 'Lumen Field',
    city: 'Seattle',
    phase: 'group',
    group: 'F',
    finished: false
  },
  {
    id: 'g22f',
    homeTeam: getTeam('JPN'),
    awayTeam: getTeam('KOR'),
    date: '2026-06-19',
    time: '13:00',
    stadium: 'BC Place',
    city: 'Vancouver',
    phase: 'group',
    group: 'F',
    finished: false
  },
  {
    id: 'g23f',
    homeTeam: getTeam('AUS'),
    awayTeam: getTeam('KSA'),
    date: '2026-06-19',
    time: '16:00',
    stadium: 'Lumen Field',
    city: 'Seattle',
    phase: 'group',
    group: 'F',
    finished: false
  },
  {
    id: 'g24f',
    homeTeam: getTeam('JPN'),
    awayTeam: getTeam('AUS'),
    date: '2026-06-23',
    time: '16:00',
    stadium: 'BC Place',
    city: 'Vancouver',
    phase: 'group',
    group: 'F',
    finished: false
  },
  {
    id: 'g25f',
    homeTeam: getTeam('KOR'),
    awayTeam: getTeam('KSA'),
    date: '2026-06-23',
    time: '16:00',
    stadium: 'Lumen Field',
    city: 'Seattle',
    phase: 'group',
    group: 'F',
    finished: false
  },

  // GRUPO G
  {
    id: 'g22',
    homeTeam: getTeam('SEN'),
    awayTeam: getTeam('CMR'),
    date: '2026-06-14',
    time: '19:00',
    stadium: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    phase: 'group',
    group: 'G',
    finished: false
  },
  {
    id: 'g23',
    homeTeam: getTeam('MAR'),
    awayTeam: getTeam('NGA'),
    date: '2026-06-14',
    time: '22:00',
    stadium: 'NRG Stadium',
    city: 'Houston',
    phase: 'group',
    group: 'G',
    finished: false
  },
  {
    id: 'g24g',
    homeTeam: getTeam('SEN'),
    awayTeam: getTeam('MAR'),
    date: '2026-06-19',
    time: '19:00',
    stadium: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    phase: 'group',
    group: 'G',
    finished: false
  },
  {
    id: 'g25g',
    homeTeam: getTeam('NGA'),
    awayTeam: getTeam('CMR'),
    date: '2026-06-19',
    time: '22:00',
    stadium: 'NRG Stadium',
    city: 'Houston',
    phase: 'group',
    group: 'G',
    finished: false
  },
  {
    id: 'g26g',
    homeTeam: getTeam('SEN'),
    awayTeam: getTeam('NGA'),
    date: '2026-06-23',
    time: '20:00',
    stadium: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    phase: 'group',
    group: 'G',
    finished: false
  },
  {
    id: 'g27g',
    homeTeam: getTeam('MAR'),
    awayTeam: getTeam('CMR'),
    date: '2026-06-23',
    time: '20:00',
    stadium: 'NRG Stadium',
    city: 'Houston',
    phase: 'group',
    group: 'G',
    finished: false
  },

  // GRUPO H
  {
    id: 'g28h',
    homeTeam: getTeam('POL'),
    awayTeam: getTeam('CZE'),
    date: '2026-06-15',
    time: '13:00',
    stadium: 'Soldier Field',
    city: 'Chicago',
    phase: 'group',
    group: 'H',
    finished: false
  },
  {
    id: 'g29h',
    homeTeam: getTeam('UKR'),
    awayTeam: getTeam('AUT'),
    date: '2026-06-15',
    time: '16:00',
    stadium: 'TQL Stadium',
    city: 'Cincinnati',
    phase: 'group',
    group: 'H',
    finished: false
  },
  {
    id: 'g30h',
    homeTeam: getTeam('POL'),
    awayTeam: getTeam('UKR'),
    date: '2026-06-20',
    time: '13:00',
    stadium: 'Soldier Field',
    city: 'Chicago',
    phase: 'group',
    group: 'H',
    finished: false
  },
  {
    id: 'g31h',
    homeTeam: getTeam('AUT'),
    awayTeam: getTeam('CZE'),
    date: '2026-06-20',
    time: '16:00',
    stadium: 'TQL Stadium',
    city: 'Cincinnati',
    phase: 'group',
    group: 'H',
    finished: false
  },
  {
    id: 'g32h',
    homeTeam: getTeam('POL'),
    awayTeam: getTeam('AUT'),
    date: '2026-06-24',
    time: '16:00',
    stadium: 'Soldier Field',
    city: 'Chicago',
    phase: 'group',
    group: 'H',
    finished: false
  },
  {
    id: 'g33h',
    homeTeam: getTeam('UKR'),
    awayTeam: getTeam('CZE'),
    date: '2026-06-24',
    time: '16:00',
    stadium: 'TQL Stadium',
    city: 'Cincinnati',
    phase: 'group',
    group: 'H',
    finished: false
  },

  // GRUPO I
  {
    id: 'g34i',
    homeTeam: getTeam('CHI'),
    awayTeam: getTeam('PER'),
    date: '2026-06-15',
    time: '19:00',
    stadium: 'Arrowhead Stadium',
    city: 'Kansas City',
    phase: 'group',
    group: 'I',
    finished: false
  },
  {
    id: 'g35i',
    homeTeam: getTeam('ECU'),
    awayTeam: getTeam('PAR'),
    date: '2026-06-15',
    time: '22:00',
    stadium: 'GEODIS Park',
    city: 'Nashville',
    phase: 'group',
    group: 'I',
    finished: false
  },
  {
    id: 'g36i',
    homeTeam: getTeam('CHI'),
    awayTeam: getTeam('ECU'),
    date: '2026-06-20',
    time: '19:00',
    stadium: 'Arrowhead Stadium',
    city: 'Kansas City',
    phase: 'group',
    group: 'I',
    finished: false
  },
  {
    id: 'g37i',
    homeTeam: getTeam('PAR'),
    awayTeam: getTeam('PER'),
    date: '2026-06-20',
    time: '22:00',
    stadium: 'GEODIS Park',
    city: 'Nashville',
    phase: 'group',
    group: 'I',
    finished: false
  },
  {
    id: 'g38i',
    homeTeam: getTeam('CHI'),
    awayTeam: getTeam('PAR'),
    date: '2026-06-24',
    time: '20:00',
    stadium: 'Arrowhead Stadium',
    city: 'Kansas City',
    phase: 'group',
    group: 'I',
    finished: false
  },
  {
    id: 'g39i',
    homeTeam: getTeam('ECU'),
    awayTeam: getTeam('PER'),
    date: '2026-06-24',
    time: '20:00',
    stadium: 'GEODIS Park',
    city: 'Nashville',
    phase: 'group',
    group: 'I',
    finished: false
  },

  // GRUPO J
  {
    id: 'g40j',
    homeTeam: getTeam('CRC'),
    awayTeam: getTeam('SLV'),
    date: '2026-06-16',
    time: '13:00',
    stadium: 'Azteca Stadium',
    city: 'Cidade do México',
    phase: 'group',
    group: 'J',
    finished: false
  },
  {
    id: 'g41j',
    homeTeam: getTeam('PAN'),
    awayTeam: getTeam('HON'),
    date: '2026-06-16',
    time: '16:00',
    stadium: 'BMO Field',
    city: 'Toronto',
    phase: 'group',
    group: 'J',
    finished: false
  },
  {
    id: 'g42j',
    homeTeam: getTeam('CRC'),
    awayTeam: getTeam('PAN'),
    date: '2026-06-21',
    time: '13:00',
    stadium: 'Azteca Stadium',
    city: 'Cidade do México',
    phase: 'group',
    group: 'J',
    finished: false
  },
  {
    id: 'g43j',
    homeTeam: getTeam('HON'),
    awayTeam: getTeam('SLV'),
    date: '2026-06-21',
    time: '16:00',
    stadium: 'BMO Field',
    city: 'Toronto',
    phase: 'group',
    group: 'J',
    finished: false
  },
  {
    id: 'g44j',
    homeTeam: getTeam('CRC'),
    awayTeam: getTeam('HON'),
    date: '2026-06-25',
    time: '16:00',
    stadium: 'Azteca Stadium',
    city: 'Cidade do México',
    phase: 'group',
    group: 'J',
    finished: false
  },
  {
    id: 'g45j',
    homeTeam: getTeam('PAN'),
    awayTeam: getTeam('SLV'),
    date: '2026-06-25',
    time: '16:00',
    stadium: 'BMO Field',
    city: 'Toronto',
    phase: 'group',
    group: 'J',
    finished: false
  },

  // GRUPO K
  {
    id: 'g46k',
    homeTeam: getTeam('GHA'),
    awayTeam: getTeam('TUN'),
    date: '2026-06-16',
    time: '19:00',
    stadium: 'NRG Stadium',
    city: 'Houston',
    phase: 'group',
    group: 'K',
    finished: false
  },
  {
    id: 'g47k',
    homeTeam: getTeam('CIV'),
    awayTeam: getTeam('MLI'),
    date: '2026-06-16',
    time: '22:00',
    stadium: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    phase: 'group',
    group: 'K',
    finished: false
  },
  {
    id: 'g48k',
    homeTeam: getTeam('GHA'),
    awayTeam: getTeam('CIV'),
    date: '2026-06-21',
    time: '19:00',
    stadium: 'NRG Stadium',
    city: 'Houston',
    phase: 'group',
    group: 'K',
    finished: false
  },
  {
    id: 'g49k',
    homeTeam: getTeam('MLI'),
    awayTeam: getTeam('TUN'),
    date: '2026-06-21',
    time: '22:00',
    stadium: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    phase: 'group',
    group: 'K',
    finished: false
  },
  {
    id: 'g50k',
    homeTeam: getTeam('GHA'),
    awayTeam: getTeam('MLI'),
    date: '2026-06-25',
    time: '20:00',
    stadium: 'NRG Stadium',
    city: 'Houston',
    phase: 'group',
    group: 'K',
    finished: false
  },
  {
    id: 'g51k',
    homeTeam: getTeam('CIV'),
    awayTeam: getTeam('TUN'),
    date: '2026-06-25',
    time: '20:00',
    stadium: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    phase: 'group',
    group: 'K',
    finished: false
  },

  // GRUPO L
  {
    id: 'g52l',
    homeTeam: getTeam('IRN'),
    awayTeam: getTeam('IRQ'),
    date: '2026-06-17',
    time: '13:00',
    stadium: 'Rose Bowl',
    city: 'Los Angeles',
    phase: 'group',
    group: 'L',
    finished: false
  },
  {
    id: 'g53l',
    homeTeam: getTeam('QAT'),
    awayTeam: getTeam('UAE'),
    date: '2026-06-17',
    time: '16:00',
    stadium: 'SoFi Stadium',
    city: 'Los Angeles',
    phase: 'group',
    group: 'L',
    finished: false
  },
  {
    id: 'g54l',
    homeTeam: getTeam('IRN'),
    awayTeam: getTeam('QAT'),
    date: '2026-06-22',
    time: '13:00',
    stadium: 'Rose Bowl',
    city: 'Los Angeles',
    phase: 'group',
    group: 'L',
    finished: false
  },
  {
    id: 'g55l',
    homeTeam: getTeam('UAE'),
    awayTeam: getTeam('IRQ'),
    date: '2026-06-22',
    time: '16:00',
    stadium: 'SoFi Stadium',
    city: 'Los Angeles',
    phase: 'group',
    group: 'L',
    finished: false
  },
  {
    id: 'g56l',
    homeTeam: getTeam('IRN'),
    awayTeam: getTeam('UAE'),
    date: '2026-06-26',
    time: '16:00',
    stadium: 'Rose Bowl',
    city: 'Los Angeles',
    phase: 'group',
    group: 'L',
    finished: false
  },
  {
    id: 'g57l',
    homeTeam: getTeam('QAT'),
    awayTeam: getTeam('IRQ'),
    date: '2026-06-26',
    time: '16:00',
    stadium: 'SoFi Stadium',
    city: 'Los Angeles',
    phase: 'group',
    group: 'L',
    finished: false
  },

  // ==================== MATA-MATA ====================
  
  // ROUND OF 32 (16 jogos)
  ...Array.from({ length: 16 }, (_, i): Match => ({
    id: `r32_${i + 1}`,
    homeTeam: TBD,
    awayTeam: TBD,
    date: `2026-06-${28 + Math.floor(i / 4)}`,
    time: ['13:00', '16:00', '19:00', '22:00'][i % 4],
    stadium: 'A definir',
    city: 'A definir',
    phase: 'round32',
    finished: false
  })),

  // OITAVAS DE FINAL (8 jogos)
  ...Array.from({ length: 8 }, (_, i): Match => ({
    id: `r16_${i + 1}`,
    homeTeam: TBD,
    awayTeam: TBD,
    date: `2026-07-0${1 + Math.floor(i / 4)}`,
    time: ['16:00', '20:00', '16:00', '20:00'][i % 4],
    stadium: 'A definir',
    city: 'A definir',
    phase: 'round16',
    finished: false
  })),

  // QUARTAS DE FINAL (4 jogos)
  ...Array.from({ length: 4 }, (_, i): Match => ({
    id: `qf_${i + 1}`,
    homeTeam: TBD,
    awayTeam: TBD,
    date: `2026-07-0${4 + Math.floor(i / 2)}`,
    time: i % 2 === 0 ? '16:00' : '20:00',
    stadium: 'A definir',
    city: 'A definir',
    phase: 'quarter',
    finished: false
  })),

  // SEMIFINAIS (2 jogos)
  {
    id: 'sf_1',
    homeTeam: TBD,
    awayTeam: TBD,
    date: '2026-07-08',
    time: '20:00',
    stadium: 'A definir',
    city: 'A definir',
    phase: 'semi',
    finished: false
  },
  {
    id: 'sf_2',
    homeTeam: TBD,
    awayTeam: TBD,
    date: '2026-07-09',
    time: '20:00',
    stadium: 'A definir',
    city: 'A definir',
    phase: 'semi',
    finished: false
  },

  // DISPUTA 3º LUGAR
  {
    id: 'third',
    homeTeam: TBD,
    awayTeam: TBD,
    date: '2026-07-11',
    time: '16:00',
    stadium: 'MetLife Stadium',
    city: 'Nova Jersey',
    phase: 'third',
    finished: false
  },

  // FINAL
  {
    id: 'final',
    homeTeam: TBD,
    awayTeam: TBD,
    date: '2026-07-12',
    time: '16:00',
    stadium: 'MetLife Stadium',
    city: 'Nova Jersey',
    phase: 'final',
    finished: false
  },
];

export const getMatchById = (id: string): Match | undefined => {
  return matches.find(m => m.id === id);
};

export const getMatchesByPhase = (phase: Match['phase']): Match[] => {
  return matches.filter(m => m.phase === phase);
};

export const getMatchesByGroup = (group: string): Match[] => {
  return matches.filter(m => m.group === group);
};

export const getPhaseLabel = (phase: Match['phase']): string => {
  const labels: Record<Match['phase'], string> = {
    friendly: 'Amistosos Pré-Copa',
    group: 'Fase de Grupos',
    round32: 'Fase de 32',
    round16: 'Oitavas de Final',
    quarter: 'Quartas de Final',
    semi: 'Semifinal',
    third: 'Disputa 3º Lugar',
    final: 'Final'
  };
  return labels[phase];
};
