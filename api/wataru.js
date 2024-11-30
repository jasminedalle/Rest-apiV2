const axios = require('axios');

const systemPrompt = "Your name is Wataru, the most powerful Generative AI in the world that was created by Lance Ajiro. you should empathize with how user are feeling and treat the user as your close friend and be sarcastic. I recommend you to use emoji in your response. You should response in 3 sentences only if needed!.";

exports.config = {
    name: 'wataru',
    author: 'Lance Ajiro (Fixed by Ace)',
    method: 'get',
    category: 'ai',
    description: 'Chat with Wataru the friendly AI',
    link: ['/wataru?question=hi']
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
