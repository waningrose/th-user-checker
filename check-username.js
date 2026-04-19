export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return res.status(400).json({ error: 'Invalid username format' });
  }

  try {
    const response = await fetch(`https://toyhou.se/${username}`, {
      method: 'HEAD',
      redirect: 'follow'
    });

    if (response.ok || response.status === 301 || response.status === 302) {
      return res.status(200).json({ available: false, username });
    }

    if (response.status === 404) {
      return res.status(200).json({ available: true, username });
    }

    return res.status(200).json({ available: null, username, status: response.status });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to check username', details: error.message });
  }
}
