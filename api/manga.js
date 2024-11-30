const axios = require('axios');
const cheerio = require('cheerio');

exports.config = {
    name: 'manga',
    author: 'Clarence',
    description: 'Retrieve a list of Manga based on the specified page and order parameters.',
    method: 'get',
    category: 'manga',
    link: ['/manga?page=1&order=update']
};

exports.initialize = async function ({ req, res }) {
    try {
        const page = req.query.page || 1;
        const order = req.query.order || 'update';

        const url = `${global.config.mangaapi}/manga/?page=${page}&type=manga&order=${order}`;
        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);
        const data = [];

        const prevPage = $(".l").length > 0 || $(".prev").length > 0;
        const nextPage = $(".r").length > 0 || $(".next").length > 0;

        $(".listupd .bs").each((i, e) => {
            const title = $(e).find("a").attr("title");
            const image = $(e).find("img").attr("src");
            const chapter = $(e).find(".epxs").text().trim();
            const score = $(e).find(".numscore").text();
            const type = $(e).find("span.type").attr("class").split(" ").pop();
            const komik_id = $(e).find("a").attr("href").split("/")[4];

            data.push({
                title,
                image,
                chapter,
                score,
                type,
                komik_id,
            });
        });

        res.json({
            status: true,
            creator: this.config.author,
            result: data,
            prevPage,
            nextPage,
        });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({
                status: false,
                creator: this.config.author,
                message: error.response.data,
            });
        } else {
            console.error("Error fetching Manga data:", error);
            res.status(500).json({
                status: false,
                creator: this.config.author,
                message: "Failed to retrieve Manga data.",
            });
        }
    }
};
