const axios = require('axios');
const cheerio = require('cheerio');

exports.config = {
    name: 'genre-manga',
    author: 'Clarence',
    description: 'Fetch a list of manga by genre with pagination and sorting options.',
    method: 'get',
    category: 'manga',
    link: ['/genre-manga?genre_id=&page=1&order=update']
};

exports.initialize = async function ({ req, res }) {
    try {
        const genre_id = req.query.genre_id;
        const page = req.query.page || 1;
        const order = req.query.order || "update";

        if (!genre_id) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Missing genre_id parameter!"
            });
        }

        const url = `${global.config.mangaapi}/manga/?page=${page}&genre[]=${genre_id}&order=${order}`;
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
            result: {
                data,
                pagination: {
                    prevPage,
                    nextPage
                }
            }
        });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({
                status: false,
                creator: this.config.author,
                message: error.response.data
            });
        } else {
            console.error("Error fetching manga by genre:", error);
            res.status(500).json({
                status: false,
                creator: this.config.author,
                message: "Failed to fetch manga by genre."
            });
        }
    }
};
