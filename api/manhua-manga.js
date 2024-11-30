const axios = require('axios');
const cheerio = require('cheerio');

exports.config = {
    name: 'manhua',
    author: 'Clarence',
    description: 'Retrieve a list of Manhua manga based on the page and order parameters.',
    method: 'get',
    category: 'manga',
    link: ['/manhua?page=1&order=update']
};

exports.initialize = async function ({ req, res }) {
    try {
        const page = req.query.page || 1;
        const order = req.query.order || 'update';

        const url = `${global.config.mangaapi}/manga/?page=${page}&type=manhua&order=${order}`;
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
            console.error("Error fetching Manhua data:", error);
            res.status(500).json({
                status: false,
                creator: this.config.author,
                message: "Failed to retrieve Manhua data.",
            });
        }
    }
};
