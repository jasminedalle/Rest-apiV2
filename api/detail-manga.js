const axios = require('axios');
const cheerio = require('cheerio');

exports.config = {
    name: 'detail',
    author: 'Clarence',
    description: 'Fetch manga details',
    method: 'get',
    category: 'manga',
    link: ['/detail?manga_id=']
};

exports.initialize = async function ({ req, res }) {
    try {
        const komik_id = req.query.manga_id;

        if (!komik_id) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Missing manga_id parameter!"
            });
        }

        const url = `${global.config.mangaapi}/manga/${komik_id}`;

        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);

        const title = $(".entry-title").text();
        const alternativeTitle = $(".seriestualt").text().trim();
        const image = $(".thumb img").attr("src");
        const score = $(".num").text();
        const synopsis = $(".entry-content").text().trim();
        const status = $(".infotable tr:contains('Status')")
            .text()
            .replace("Status", "")
            .trim();
        const type = $(".infotable tr:contains('Type')")
            .text()
            .replace("Type", "")
            .trim();
        const released = $(".infotable tr:contains('Released')")
            .text()
            .replace("Released", "")
            .trim();
        const author = $(".infotable tr:contains('Author')")
            .text()
            .replace("Author", "")
            .trim();
        const artist = $(".infotable tr:contains('Artist')")
            .text()
            .replace("Artist", "")
            .trim();
        const serialization = $(".infotable tr:contains('Serialization')")
            .text()
            .replace("Serialization", "")
            .trim();
        const postedBy = $(".infotable tr:contains('Posted By')")
            .text()
            .replace("Posted By", "")
            .trim();
        const postedOn = $(".infotable tr:contains('Posted On')")
            .text()
            .replace("Posted On", "")
            .trim();
        const updatedOn = $(".infotable tr:contains('Updated On')")
            .text()
            .replace("Updated On", "")
            .trim();
        const genres = $(".seriestugenre a")
            .map((i, e) => $(e).text())
            .get();
        const chapterList = $("#chapterlist ul li")
            .map((i, e) => ({
                title: $(e).find(".chapternum").text(),
                date: $(e).find(".chapterdate").text(),
                chapter_id: $(e).find("a").attr("href")?.split("/")[3],
            }))
            .get();

        res.json({
            status: true,
            creator: this.config.author,
            result: {
                title,
                alternativeTitle,
                image,
                score,
                synopsis,
                status,
                type,
                released,
                author,
                artist,
                serialization,
                postedBy,
                postedOn,
                updatedOn,
                genres,
                chapterList,
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
            console.error("Error fetching manga details:", error);
            res.status(500).json({
                status: false,
                creator: this.config.author,
                message: "Failed to fetch manga details."
            });
        }
    }
};
