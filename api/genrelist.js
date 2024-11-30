const axios = require('axios');
const cheerio = require('cheerio');

exports.config = {
    name: 'genrelist',
    author: 'Clarence',
    description: 'Fetch a list of available manga genres.',
    method: 'get',
    category: 'manga',
    link: ['/genrelist']
};

exports.initialize = async function ({ req, res }) {
    try {
        const url = `${global.config.mangaapi}/daftar-manga/`;
        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);
        const data = [];

        $("div.filter:nth-child(1) ul li").each((i, e) => {
            const name = $(e).text().trim();
            const genre_id = $(e).find("input").attr("value");

            data.push({
                name,
                genre_id,
            });
        });

        res.json({
            status: true,
            creator: this.config.author,
            result: data,
        });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({
                status: false,
                creator: this.config.author,
                message: error.response.data
            });
        } else {
            console.error("Error fetching genre list:", error);
            res.status(500).json({
                status: false,
                creator: this.config.author,
                message: "Failed to fetch genre list."
            });
        }
    }
};
