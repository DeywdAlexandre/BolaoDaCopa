import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path, ...queryParams } = req.query;
  const apiKey = req.headers['x-apisports-key'] as string;

  if (!apiKey) {
    return res.status(400).json({ errors: { requests: 'API Key missing' } });
  }

  // Constrói a query string com os parâmetros recebidos
  const queryString = new URLSearchParams(queryParams as any).toString();
  const targetPath = Array.isArray(path) ? path.join('/') : (path || 'fixtures');

  try {
    const url = `https://v3.football.api-sports.io/${targetPath}?${queryString}`;
    console.log('Fetching from API-Football:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-apisports-key': apiKey
      }
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ errors: { requests: 'Internal Server Error' } });
  }
}
