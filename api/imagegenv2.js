const axios = require('axios');

exports.config = {
    name: 'imagegenv2',
    author: 'Clarence',
    description: 'Generate and return raw image data based on your prompt.',
    method: 'get',
    category: 'image generation',
    link: ['/imagegenv2?prompt=']
};

exports.initialize = async function ({ req, res }) {
    try {
        const prompt = req.query.prompt;

        if (!prompt) {
            return res.status(400).json({
                status: false,
                creator: this.config.author,
                message: "[!] Please provide a 'prompt' query parameter!"
            });
        }

        const apiUrl = `${global.config.dainsapi}/imagenv3?prompt=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            headers: {
                'accept': 'application/json'
            }
        });

        if (!response.data) {
            return res.status(404).json({
                status: false,
                creator: this.config.author,
                message: "Failed to retrieve the image. Please try again later."
            });
        }

        res.setHeader('Content-Type', 'image/jpeg');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({
            status: false,
            creator: this.config.author,
            message: "An error occurred while processing your request."
        });
    }
};
