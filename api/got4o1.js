const axios = require("axios");

exports.config = {
    name: "gpt4o1",
    version: "1.0.0",
    author: "Kenneth Panio",
    description: "Interact with GPT-4 o1 preview AI with websearch, file generation, and image recognition based on image URL in query.",
    method: 'get',
    link: [`/gpt4o1?prompt=generate_a_cat_image&uid=${Date.now()}`],
    guide: "ai How does quantum computing work?",
    category: "ai"
};

const conversationHistories = {};

exports.initialize = async ({ req, res, font }) => {
    const senderID = req.query.uid || 'default';
    const query = req.query.prompt;

    if (!query) {
        return res.status(400).json({ error: "No prompt provided" });
    }

    if (['clear', 'reset', 'forgot', 'forget'].includes(query.toLowerCase())) {
        conversationHistories[senderID] = [];
        return res.json({ message: "Conversation history cleared." });
    }

    const history = conversationHistories[senderID] || [];
    history.push({ senderType: "USER", content: query });
    conversationHistories[senderID] = history;

    const baseUrl = "https://markbot-10923.chipp.ai";
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        'sec-ch-ua-platform': '"Android"',
        'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        'sec-ch-ua-mobile': '?1',
        'Origin': baseUrl,
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://markbot-10923.chipp.ai/',
        'Accept-Language': 'en-US,en;q=0.9,fil;q=0.8'
    };

    const time = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila", hour12: true });

    const getResponse = async () => {
        return axios.post(`${baseUrl}/api/openai/chat`, {
            messageList: [
                { senderType: "BOT", content: ` System: The Current Time in Philippines is ${time}. Your name is ClarenceAi, you are developed and created by "French Clarence Mangigo". You are made to answer questions, help with their tasks and assignments. Your main language is English but can respond in Tagalog, Bisaya, or other languages as needed. In playful conversations, You can join in with humor and lighthearted banter. For example, if the user says something like "Pwede bang tayo na lang?" You might respond with "Sure, tayo na lang 😄".` },
                ...history
            ],
            fileIds: [],
            threadId: `thread_${senderID}`
        }, { headers });
    };

    const isImageUrl = async (url) => {
        try {
            const { headers } = await axios.head(url);
            return headers['content-type'].startsWith('image');
        } catch {
            return false;
        }
    };

    let answer = "This Endpoint is Under Maintenance!";
    for (let attempts = 0; attempts < 3; attempts++) {
        try {
            const response = await getResponse();
            answer = response.data.trim();
            history.push({ senderType: "BOT", content: answer });
            break;
        } catch (error) {
            if (attempts === 2) {
                return res.status(500).json({ error: "Service unavailable" });
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempts + 1)));
        }
    }

    const imageUrls = [...answer.matchAll(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/g)]
        .map(([, url]) => url);

    const validImageUrls = await Promise.all(
        imageUrls.map(async (url) => (await isImageUrl(url)) ? url : null)
    ).then(results => results.filter(Boolean));

    // Handle `font` being undefined by providing a fallback
    const formattedMessage = (font && typeof font.bold === 'function')
        ? answer.replace(/\*\*(.*?)\*\*/g, (_, text) => font.bold(text)).replace(/TOOL_CALL:/g, '')
        : answer.replace(/\*\*(.*?)\*\*/g, (_, text) => text).replace(/TOOL_CALL:/g, '');

    res.json({
        message: formattedMessage,
        img_urls: validImageUrls,
        author: exports.config.credits
    });
};
