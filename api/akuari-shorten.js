const axios = require('axios');

exports.config = {
    name: 'akuari-shorten',
    author: 'Clarence',
    description: 'Shorten URLs using Akuari Shorten API',
    method: 'get',
    category: 'tools',
    link: ['/akuari-shorten?url=']
};

exports.initialize = async function ({ req, res }) {
    try {
        const url = req.query.url; 

        if (!url) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Please provide a 'url' query parameter!"
            });
        }

        const customId = Math.random().toString(36).substring(2, 10);

        const apiUrl = `https://s.akuari.my.id/shorten?url=${encodeURIComponent(url)}&customid=${customId}`;

        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data || !data.shortenedUrl) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "Failed to shorten the URL. Please try again later."
            });
        }

        res.json({
            status: true,
            creator: this.config.author,
            result: data.shortenedUrl
        });
    } catch (error) {
        console.error("Error shortening URL:", error);
        res.status(500).json({
            status: false,
            creator: this.config.author,
            message: "An error occurred while shortening the URL."
        });
    }
};
