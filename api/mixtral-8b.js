const axios = require('axios');

const hfApiKey = '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';

exports.config = {
    name: 'mixtral-8b',
    author: 'Clarence',
    method: 'get',
    category: 'ai',
    description: 'Generates a single completion response using Mixtral-8x7B-Instruct-v0.1.',
    link: ['/mixtral-8b?q=Hello']
};

exports.initialize = async function ({ req, res }) {
    try {
        const prompt = req.query.q || '';

        if (!prompt) {
            return res.status(400).json({ error: "The 'q' parameter is required." });
        }

        const payload = {
            model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 500,
            stream: false
        };

        const { data } = await axios.post('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1/v1/chat/completions', payload, {
            headers: {
                'Authorization': `Bearer ${hfApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const completionResponse = data.choices[0].message.content;

        res.json({
            response: completionResponse,
            usage: data.usage || {}
        });
    } catch (error) {
        console.error("Error in text completion:", error.response?.data || error.message);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};
