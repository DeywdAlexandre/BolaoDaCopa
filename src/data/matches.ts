import { Match } from '../types';
import { teams, TBD_TEAM } from './teams';

const getTeam = (code: string) => teams.find(t => t.code === code)!;
const TBD = TBD_TEAM;

const friendlyMatches: Match[] = [
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
  }
];

const groupFixturesData: Record<string, {
  dates: string[];
  times: string[];
  stadiums: string[];
  cities: string[];
}> = {
  A: {
    dates: ['2026-06-11', '2026-06-11', '2026-06-15', '2026-06-15', '2026-06-19', '2026-06-19'],
    times: ['23:00', '23:00', '17:00', '20:00', '16:00', '20:00'],
    stadiums: ['Azteca Stadium', 'Akron Stadium', 'AT&T Stadium', 'BMO Field', 'MetLife Stadium', 'Azteca Stadium'],
    cities: ['Cidade do México', 'Guadalajara', 'Dallas', 'Toronto', 'Nova Jersey', 'Cidade do México']
  },
  B: {
    dates: ['2026-06-12', '2026-06-13', '2026-06-16', '2026-06-17', '2026-06-20', '2026-06-20'],
    times: ['16:00', '16:00', '19:00', '22:00', '16:00', '16:00'],
    stadiums: ['BMO Field', 'Levi\'s Stadium', 'BMO Field', 'Levi\'s Stadium', 'Rose Bowl', 'BMO Field'],
    cities: ['Toronto', 'Santa Clara', 'Toronto', 'Santa Clara', 'Los Angeles', 'Toronto']
  },
  C: {
    dates: ['2026-06-13', '2026-06-13', '2026-06-17', '2026-06-17', '2026-06-21', '2026-06-21'],
    times: ['19:00', '22:00', '13:00', '16:00', '20:00', '20:00'],
    stadiums: ['MetLife Stadium', 'Gillette Stadium', 'MetLife Stadium', 'Gillette Stadium', 'MetLife Stadium', 'Gillette Stadium'],
    cities: ['Nova Jersey', 'Boston', 'Nova Jersey', 'Boston', 'Nova Jersey', 'Boston']
  },
  D: {
    dates: ['2026-06-12', '2026-06-14', '2026-06-16', '2026-06-18', '2026-06-20', '2026-06-20'],
    times: ['22:00', '01:00', '13:00', '16:00', '20:00', '20:00'],
    stadiums: ['SoFi Stadium', 'BC Place', 'SoFi Stadium', 'BC Place', 'SoFi Stadium', 'BC Place'],
    cities: ['Los Angeles', 'Vancouver', 'Los Angeles', 'Vancouver', 'Los Angeles', 'Vancouver']
  },
  E: {
    dates: ['2026-06-14', '2026-06-14', '2026-06-18', '2026-06-18', '2026-06-22', '2026-06-22'],
    times: ['14:00', '20:00', '13:00', '16:00', '16:00', '16:00'],
    stadiums: ['NRG Stadium', 'Lincoln Financial Field', 'NRG Stadium', 'Lincoln Financial Field', 'NRG Stadium', 'Lincoln Financial Field'],
    cities: ['Houston', 'Filadélfia', 'Houston', 'Filadélfia', 'Houston', 'Filadélfia']
  },
  F: {
    dates: ['2026-06-14', '2026-06-14', '2026-06-18', '2026-06-18', '2026-06-22', '2026-06-22'],
    times: ['17:00', '23:00', '19:00', '22:00', '20:00', '20:00'],
    stadiums: ['AT&T Stadium', 'Estadio BBVA', 'AT&T Stadium', 'Estadio BBVA', 'AT&T Stadium', 'Estadio BBVA'],
    cities: ['Dallas', 'Monterrey', 'Dallas', 'Monterrey', 'Dallas', 'Monterrey']
  },
  G: {
    dates: ['2026-06-15', '2026-06-15', '2026-06-19', '2026-06-19', '2026-06-23', '2026-06-23'],
    times: ['16:00', '22:00', '13:00', '16:00', '16:00', '16:00'],
    stadiums: ['Lumen Field', 'SoFi Stadium', 'Lumen Field', 'SoFi Stadium', 'Lumen Field', 'SoFi Stadium'],
    cities: ['Seattle', 'Los Angeles', 'Seattle', 'Los Angeles', 'Seattle', 'Los Angeles']
  },
  H: {
    dates: ['2026-06-15', '2026-06-15', '2026-06-19', '2026-06-19', '2026-06-23', '2026-06-23'],
    times: ['13:00', '19:00', '19:00', '22:00', '20:00', '20:00'],
    stadiums: ['Mercedes-Benz Stadium', 'Hard Rock Stadium', 'Mercedes-Benz Stadium', 'Hard Rock Stadium', 'Mercedes-Benz Stadium', 'Hard Rock Stadium'],
    cities: ['Atlanta', 'Miami', 'Atlanta', 'Miami', 'Atlanta', 'Miami']
  },
  I: {
    dates: ['2026-06-16', '2026-06-16', '2026-06-20', '2026-06-20', '2026-06-24', '2026-06-24'],
    times: ['16:00', '19:00', '13:00', '16:00', '16:00', '16:00'],
    stadiums: ['MetLife Stadium', 'Gillette Stadium', 'MetLife Stadium', 'Gillette Stadium', 'MetLife Stadium', 'Gillette Stadium'],
    cities: ['Nova Jersey', 'Boston', 'Nova Jersey', 'Boston', 'Nova Jersey', 'Boston']
  },
  J: {
    dates: ['2026-06-16', '2026-06-17', '2026-06-20', '2026-06-21', '2026-06-24', '2026-06-24'],
    times: ['22:00', '01:00', '19:00', '22:00', '20:00', '20:00'],
    stadiums: ['Arrowhead Stadium', 'Levi\'s Stadium', 'Arrowhead Stadium', 'Levi\'s Stadium', 'Arrowhead Stadium', 'Levi\'s Stadium'],
    cities: ['Kansas City', 'Santa Clara', 'Kansas City', 'Santa Clara', 'Kansas City', 'Santa Clara']
  },
  K: {
    dates: ['2026-06-17', '2026-06-17', '2026-06-21', '2026-06-21', '2026-06-25', '2026-06-25'],
    times: ['14:00', '23:00', '13:00', '16:00', '16:00', '16:00'],
    stadiums: ['NRG Stadium', 'Azteca Stadium', 'NRG Stadium', 'Azteca Stadium', 'NRG Stadium', 'Azteca Stadium'],
    cities: ['Houston', 'Cidade do México', 'Houston', 'Cidade do México', 'Houston', 'Cidade do México']
  },
  L: {
    dates: ['2026-06-17', '2026-06-17', '2026-06-21', '2026-06-21', '2026-06-25', '2026-06-25'],
    times: ['17:00', '20:00', '19:00', '22:00', '20:00', '20:00'],
    stadiums: ['AT&T Stadium', 'BMO Field', 'AT&T Stadium', 'BMO Field', 'AT&T Stadium', 'BMO Field'],
    cities: ['Dallas', 'Toronto', 'Dallas', 'Toronto', 'Dallas', 'Toronto']
  }
};

const generateGroupStageMatches = (): Match[] => {
  const generated: Match[] = [];
  const groupsList = Object.keys(groupFixturesData);
  
  // Ordem clássica de confrontos da FIFA de 3 rodadas
  const matchIndexPairs = [
    [0, 1], // Rodada 1 Jogo 1
    [2, 3], // Rodada 1 Jogo 2
    [0, 2], // Rodada 2 Jogo 3
    [1, 3], // Rodada 2 Jogo 4
    [0, 3], // Rodada 3 Jogo 5
    [1, 2]  // Rodada 3 Jogo 6
  ];

  for (const g of groupsList) {
    const groupTeams = teams.filter(t => t.group === g);
    const template = groupFixturesData[g];

    for (let j = 0; j < 6; j++) {
      const [homeIdx, awayIdx] = matchIndexPairs[j];
      const home = groupTeams[homeIdx] || TBD_TEAM;
      const away = groupTeams[awayIdx] || TBD_TEAM;

      generated.push({
        id: `g_${g.toLowerCase()}_${j + 1}`,
        homeTeam: home,
        awayTeam: away,
        date: template.dates[j],
        time: template.times[j],
        stadium: template.stadiums[j],
        city: template.cities[j],
        phase: 'group',
        group: g,
        finished: false
      });
    }
  }
  return generated;
};

const groupMatches = generateGroupStageMatches();

const knockoutMatches: Match[] = [
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
  }
];

export const matches: Match[] = [
  ...friendlyMatches,
  ...groupMatches,
  ...knockoutMatches
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
    custom: 'Jogos Avulsos',
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
