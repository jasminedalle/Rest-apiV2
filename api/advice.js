const axios = require('axios');

const BASE_URL = 'https://api.adviceslip.com/advice';

exports.config = {
    name: 'advice',
    author: 'Clarence',
    description: 'Fetches random advice or searches for specific advice',
    method: 'get',
    category: 'others',
    link: ['/advice?type=']
};

exports.initialize = async function ({ req, res }) {
    const { type, query } = req.query;

    try {
        if (type === 'random') {
            const response = await axios.get(`${BASE_URL}`);
            res.json(response.data);
        } else if (type === 'search' && query) {
            const response = await axios.get(`${BASE_URL}/search/${query}`);
            res.json(response.data);
        } else {
            res.status(400).json({
                error: "Invalid request. Please specify type as 'random' or 'search' with a query.",
                endpoint: "/advice?type=random or /advice?type=search&query=your_query"
            });
        }
    } catch (error) {
        console.error("Error fetching advice:", error);
        res.status(500).json({ error: "Failed to fetch advice." });
    }
};
