const axios = require('axios');

exports.config = {
  name: 'catfact',
  author: 'Clarence',
  description: 'Sends a random cat image fetched from the CatAPI along with an interesting cat fact.',
  method: 'get',
  category: 'social',
  link: ['/catfact']
};

exports.initialize = async function ({ req, res }) {
  try {
    const [imageResponse, factResponse] = await Promise.all([
      axios.get('https://api.thecatapi.com/v1/images/search'),
      axios.get('https://catfact.ninja/facts')
    ]);

    if (imageResponse.status !== 200 || !imageResponse.data || !imageResponse.data[0]?.url) {
      throw new Error('Invalid or missing response from CatAPI');
    }

    if (factResponse.status !== 200 || !factResponse.data || !factResponse.data.data || factResponse.data.data.length === 0) {
      throw new Error('Invalid or missing cat facts');
    }

    const imageURL = imageResponse.data[0].url;
    const facts = factResponse.data.data;
    const randomFactIndex = Math.floor(Math.random() * facts.length);
    const factText = facts[randomFactIndex].fact;

    res.json({
      fact: factText,
      image: imageURL
    });
  } catch (error) {
    console.error('Error fetching cat image and fact:', error);
    res.status(500).json({ error: 'Failed to fetch cat image and fact' });
  }
};
