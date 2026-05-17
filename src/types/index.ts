// Tipos de usuário
export type UserRole = 'super_admin' | 'manager' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  role: UserRole;
  managerId?: string; // Para usuários, qual gerente ele segue
  createdAt: string;
}

// Seleções
export interface Team {
  id: string;
  name: string;
  code: string; // Ex: BRA, ARG, etc
  flag: string; // Emoji da bandeira (fallback)
  iso?: string; // ISO 2-letter code para imagem da bandeira
  group?: string;
}

// Jogos da Copa
export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  stadium: string;
  city: string;
  phase: 'custom' | 'friendly' | 'group' | 'round32' | 'round16' | 'quarter' | 'semi' | 'third' | 'final';
  group?: string;
  homeScore?: number;
  awayScore?: number;
  finished: boolean;
  externalId?: number; // ID da partida na API externa (API-Football)
}

// Bolão
export interface Pool {
  id: string;
  matchId: string;
  managerId: string;
  managerCode: string;
  betValue: number; // Valor do palpite em R$
  maxRepeatedBets: number; // Máximo de palpites iguais
  includeExtraTime: boolean; // Se inclui prorrogação
  maintenanceFee: number; // Taxa do gerente em %
  bonusAmount: number; // Bônus de jogos anteriores
  status: 'open' | 'closed' | 'finished';
  bettingDeadline: string; // Data/hora limite para apostas (ISO string)
  createdAt: string;
}

// Palpite
export interface Bet {
  id: string;
  poolId: string;
  matchId: string;
  userId: string;
  userName: string;
  userPhone?: string; // Telefone (para apostas manuais)
  homeScore: number;
  awayScore: number;
  validated: boolean; // Gerente confirmou pagamento
  isManualBet: boolean; // Se foi aposta criada pelo gerente
  won?: boolean; // Se ganhou
  createdAt: string;
}

// Estatísticas do leaderboard
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userPhoto?: string;
  exactHits: number; // Acertos exatos
  totalBets: number;
  totalWon: number; // Valor total ganho
}

// Gerente autorizado
export interface AuthorizedManager {
  id: string;
  email: string;
  name: string;
  code: string; // Código único do gerente
  platformFee: number; // Taxa da plataforma em % (ex: 3)
  panelName?: string; // Nome personalizado do painel (ex: Bolão do José)
  phone?: string; // WhatsApp do gerente para envio de comprovante
  blocked: boolean; // Se está bloqueado para criar bolões
  authorizedAt: string;
  authorizedBy: string; // ID do super admin
}

// Contexto de dados
export interface AppData {
  users: User[];
  matches: Match[];
  pools: Pool[];
  bets: Bet[];
  authorizedManagers: AuthorizedManager[];
}
