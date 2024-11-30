const axios = require('axios');

exports.config = {
    name: 'bibleverse',
    author: 'Clarence',
    description: 'Fetches a random verse for the day',
    method: 'get',
    category: 'others',
    link: ['/bibleverse']
};

exports.initialize = async function ({ req, res }) {
    try {
        const dayNow = new Date().getDate();

        const response = await axios.get(`https://beta.ourmanna.com/api/v1/get/?format=text&order=random&order_by=verse&day=${dayNow}`);

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching verse:", error);
        res.status(500).json({ error: "Failed to fetch verse data from external API." });
    }
};
