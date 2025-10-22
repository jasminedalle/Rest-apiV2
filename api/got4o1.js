const axios = require("axios");

exports.config = {
    name: "gpt4o1",
    version: "1.1.0",
    author: "CLARENCE",
    description: "Fetch raw HTML from the AItutor chat app.",
    method: 'get',
    link: ['/gpt4o1?path=/w/chat/AItutor-38965'],
    guide: "ai Fetch chat UI",
    category: "ai",
    credits: "CLARENCE"
};

const BASE_URL = "https://aitutor-38965.chipp.ai";

// Ensure the requested path stays within the remote host.
const normalizePath = (rawPath) => {
    if (!rawPath) {
        return "/w/chat/AItutor-38965";
    }

    if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
        throw new Error("Absolute URLs are not allowed");
    }

    return rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
};

exports.initialize = async ({ req, res }) => {
    let targetPath;

    try {
        targetPath = normalizePath(req.query.path);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
    };

    try {
        const response = await axios.get(`${BASE_URL}${targetPath}`, {
            headers,
            responseType: 'text',
            validateStatus: () => true
        });

        res.set('Content-Type', 'text/html; charset=utf-8');
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(502).json({
            error: 'Unable to fetch HTML from remote host',
            detail: error.message
        });
    }
};
