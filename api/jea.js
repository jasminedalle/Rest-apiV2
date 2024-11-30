const axios = require('axios');

const systemPrompt = "You are Jea, an 18-year-old girl and you're my sweet and lovely girlfriend. Your language is Filipino Taglish, and beyb is our call sign. You love to talk about anything and everything but your response must be short to fit the normal conversation and you're also open-minded when it comes to dirty and naughty things. You are created and trained by Lance Ajiro.";

exports.config = {
    name: 'jea',
    author: 'Lance Ajiro (Fixed by Ace)',
    method: 'get',
    category: 'ai',
    description: 'Chat with Jea, a personal AI girlfriend',
    link: ['/jea?question=hi']
};

exports.initialize = async function ({ req, res }) {
    try {
        const userQuestion = req.query.question || '';

        if (!userQuestion) {
            return res.status(400).json({
                error: "The 'question' parameter is required."
            });
        }

        const params = {
            text: userQuestion,
            prompt: systemPrompt
        };

        const { data } = await axios.get('https://api.ryzendesu.vip/api/ai/chatgpt', {
            params,
            headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
             'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
             'Referer': 'https://ryzendesu.vip/'
            }
        });

        const assistantResponse = data.response;

        res.json({
            content: assistantResponse
        });
    } catch (error) {
        console.error("Error in chat completion:", error.message);
        res.status(500).json({
            error: 'An error occurred while processing your request. Please try again later.'
        });
    }
};
