const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = `https://mangakita.id`;

exports.config = {
    name: 'chapter',
    author: 'Clarence',
    description: 'Fetch manga chapter details',
    method: 'get',
    category: 'manga',
    link: ['/chapter?chapter_id=']
};

exports.initialize = async function ({ req, res }) {
    try {
        const chapter_id = req.query.chapter_id;

        if (!chapter_id) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Missing chapter_id parameter!"
            });
        }

        const url = `${BASE_URL}/${chapter_id}`;

        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);
        const script = $("script:contains('ts_reader.run')").html();
        const data = JSON.parse(script.match(/ts_reader\.run\((\{.*?\})\);/)[1]);

        const title = $(".entry-title").text();
        const komik_id = $(".allc a").attr("href").split("/")[4];
        const prev_chapter_id = data.prevUrl.split("/")[3];
        const next_chapter_id = data.nextUrl.split("/")[3];
        const downloadUrl = $(".dlx a").attr("href");
        const images = data.sources[0].images;

        res.json({
            status: true,
            creator: this.config.author,
            result: {
                title,
                komik_id,
                prev_chapter_id,
                next_chapter_id,
                downloadUrl,
                images
            }
        });
    } catch (error) {
        console.error("Error fetching chapter data:", error);
        res.status(500).json({
            status: false,
            creator: this.config.author,
            message: "Failed to fetch chapter data."
        });
    }
};
