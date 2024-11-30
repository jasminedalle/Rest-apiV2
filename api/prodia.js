const axios = require('axios');

exports.config = {
    name: 'prodia',
    author: 'Clarence',
    description: 'Generate stunning images using AI based on your prompt.',
    method: 'get',
    category: 'image generation',
    link: ['/prodia?prompt=']
};

exports.initialize = async function ({ req, res }) {
    try {
        const prompt = req.query.prompt;

        if (!prompt) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Please provide a 'prompt' query parameter!"
            });
        }

        const apiUrl = `${global.config.dainsapi}/prodia?prompt=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl, {
            headers: {
                'accept': 'application/json'
            }
        });

        if (!response.data) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "Failed to fetch data from the API. Please try again later."
            });
        }

        res.json({
            status: true,
            creator: this.config.author,
            result: response.data
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            creator: this.config.author,
            message: "An error occurred while processing your request."
        });
    }
};
