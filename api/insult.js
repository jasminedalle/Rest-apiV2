const axios = require('axios');

exports.config = {
  name: 'insult',
  author: '',
  description: 'Fetches a random insult',
  method: 'get',
  category: 'others',
  link: ['/insult']
};

exports.initialize = async function ({ req, res }) {
  try {
    const lang = req.query.lang || 'en';
    const response = await axios.get(`https://evilinsult.com/generate_insult.php?type=json&lang=${lang}`);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching insult:', error);
    res.status(500).json({ error: 'Failed to fetch insult' });
  }
};
