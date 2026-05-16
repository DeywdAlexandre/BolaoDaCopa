import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { league, season } = req.query;
  const apiKey = req.headers['x-apisports-key'] as string;

  if (!apiKey) {
    return res.status(400).json({ errors: { requests: 'API Key missing' } });
  }

  try {
    const response = await fetch(`https://v3.football.api-sports.io/fixtures?league=${league}&season=${season}`, {
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
