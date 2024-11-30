const axios = require('axios');

exports.config = {
    name: 'programeme',
    author: 'Clarence',
    description: 'Fetch a random programming meme.',
    method: 'get',
    category: 'others',
    link: ['/programeme']
};

exports.initialize = async function ({ req, res }) {
    try {
        const apiUrl = `${global.config.dainsapi}/programeme`;
        const response = await axios.get(apiUrl, {
            headers: { 'accept': 'application/json' }
        });

        if (!response.data || response.data.length === 0) {
            return res.status(404).json({
                status: false,
                creator: this.config.author,
                message: "No memes found. Please try again later."
            });
        }

        const meme = response.data[0];
        res.json({
            status: true,
            creator: this.config.author,
            title: meme.title,
            image: meme.imageUrl
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            creator: this.config.author,
            message: "An error occurred while fetching the meme."
        });
    }
};
