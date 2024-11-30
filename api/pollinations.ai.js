const axios = require("axios");

exports.config = {
  name: 'pollinations.ai',
  author: 'Clarence',
  description: 'Fetches an image based on a text prompt from Pollinations AI',
  method: 'get',
  category: 'image generation',
  link: ['/pollinations.ai?prompt=Dog']
};

exports.initialize = async function ({ req, res }) {
  try {
    const { prompt } = req.query;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt parameter is required' });
    }

    const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
      responseType: 'arraybuffer'
    });

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
};
