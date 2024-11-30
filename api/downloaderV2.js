const fg = require('api-dylux');

exports.config = {
    name: 'downloaderV2',
    author: 'Lance Cochangco',
    description: 'Download content from various platforms automatically detected via URL',
    method: 'get',
    category: 'downloader',
    link: ['/downloaderV2?url=https://vt.tiktok.com/ZMFMun818/']
};

exports.initialize = async function ({ req, res }) {
    try {
        const { url, username } = req.query;

        if (!url && !username) {
            return res.json({ status: false, creator: this.config.author, message: "[!] Please provide a URL or username!" });
        }

        let data;
        let platform;

        // Define regex patterns for each platform, excluding YouTube
        const patterns = {
            tiktok: /(?:tiktok\.com\/@[\w.-]+\/video\/\d+|vt\.tiktok\.com\/\w+)/,
            instagram_story: /(?:instagram\.com\/stories\/|instagram\.com\/p\/|instagram\.com\/reel\/|instagram\.com\/tv\/)/,
            facebook: /(?:facebook\.com\/.+\/videos\/|fb\.watch\/)/,
            twitter: /(?:twitter\.com\/.+\/status\/\d+)/,
            soundcloud: /(?:soundcloud\.com\/[\w-]+\/[\w-]+)/,
        };

        // Detect platform based on URL using regex
        if (patterns.tiktok.test(url)) {
            platform = 'tiktok';
            data = await fg.tiktok(url);
        } else if (patterns.instagram_story.test(url)) {
            platform = 'instagram_story';
            if (!username) {
                return res.json({ status: false, creator: this.config.author, message: "[!] Please provide the Instagram username!" });
            }
            data = await fg.igstory(username);
        } else if (patterns.facebook.test(url)) {
            platform = 'facebook';
            data = await fg.fbdl(url);
        } else if (patterns.twitter.test(url)) {
            platform = 'twitter';
            data = await fg.twitter(url);
        } else if (patterns.soundcloud.test(url)) {
            platform = 'soundcloud';
            data = await fg.soundcloudDl(url);
        } else {
            return res.json({ status: false, creator: this.config.author, message: "[!] Platform not supported or invalid URL!" });
        }

        if (!data) {
            return res.json({ status: false, creator: this.config.author, message: "[!] Failed to fetch data!" });
        }

        res.json({
            status: true,
            creator: this.config.author,
            platform,
            result: data
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to retrieve data." });
    }
};