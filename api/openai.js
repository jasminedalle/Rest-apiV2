const axios = require("axios");

exports.config = {
    name: "openai",
    version: "1.0.0",
    author: "Clarence",
    description: "Interact with OpenAI to generate AI-based responses and translate them into Japanese.",
    method: 'get',
    link: [`/openai?text=`],
    guide: "openai?text=Hello AI",
    category: "ai"
};

exports.initialize = async ({ req, res }) => {
    const text = req.query.text;
    if (!text) {
        return res.status(400).json({ status: false, code: 400, message: "Query parameter 'text' is required." });
    }

    const payload = {
        app: {
            id: "besp15eb87j1695894870720",
            time: Date.now(),
            data: {
                sender: { id: Date.now() },
                message: [{ id: Date.now(), time: Date.now(), type: "text", value: text }]
            }
        }
    };
    const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer 0yqbiu-xz1s-qrnp2fjsj1z8cnav-f1g2rddjl5-x6fqf4b4"
    };

    const maxRetries = 3;
    let attempt = 0;
    let response;

    while (attempt < maxRetries) {
        try {
            const { data } = await axios.post("https://webhook.botika.online/webhook/", payload, { headers });
            const messages = data.app.data.message;

            if (Array.isArray(messages)) {
                const formattedMessages = messages.map(msg => msg.value).join("\n");
                response = formattedMessages.replace(/<BR>|<br>/gi, "\n").replace(/```/g, "\n");
                if (!response.includes("Maaf, aku belum mengerti")) break;
            }
        } catch (error) {
            if (attempt === maxRetries - 1) {
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Service unavailable",
                    error: error.message
                });
            }
        }
        attempt++;
    }

    if (response) {
        try {
            const tranChat = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(response)}`);
            response = tranChat.data[0][0][0];
        } catch (error) {
            return res.status(500).json({
                status: false,
                code: 500,
                message: "Translation failed",
                error: error.message
            });
        }
    }

    res.json({
        status: true,
        code: 200,
        result: response || "No response available.",
        creator: "AceGerome"
    });
};