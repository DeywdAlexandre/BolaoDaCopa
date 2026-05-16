const API_URL = 'https://v3.football.api-sports.io';
const LEAGUE_ID = 1; // ID padrão da Copa do Mundo na API-Football
const SEASON = 2026;

export interface ApiMatch {
  fixture: {
    id: number;
    status: {
      short: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  teams: {
    home: { name: string; id: number };
    away: { name: string; id: number };
  };
}

export async function fetchWorldCupResults(apiKey: string): Promise<ApiMatch[]> {
  if (!apiKey) throw new Error('API Key não configurada');

  const response = await fetch(`${API_URL}/fixtures?league=${LEAGUE_ID}&season=${SEASON}`, {
    method: 'GET',
    headers: {
      'x-apisports-key': apiKey
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.errors?.requests || 'Falha ao buscar dados da API');
  }

  const data = await response.json();
  
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(Object.values(data.errors)[0] as string);
  }

  return data.response;
}
