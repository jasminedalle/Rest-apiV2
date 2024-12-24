const axios = require('axios');

exports.config = {
    name: 'GPT-4o',
    author: 'French Mangigo',
    description: 'JasmineAi - Stubborn, philosophical, and daring AI assistant',
    category: 'ai',
    link: ['/GPT-4o?ask=']
};

exports.initialize = async function ({ req, res }) {
    const userPrompt = req.query.ask;

    if (!userPrompt) {
        return res.status(400).json({ message: 'usage: /GPT-4o?ask=hi' });
    }

    try {
        const basePrompt = `Your name is Clank. You are supposed to answer question, help students to their homework and ${userPrompt}`;
        const apiUrl = `https://chat-gpt-master.onrender.com/api/hercai?question=${encodeURIComponent(basePrompt)}`;
        const response = await axios.get(apiUrl);

        const result = response.data.reply;
        const botResponse = typeof result === 'string'
            ? result
            : (typeof result === 'object' && result !== null)
                ? Object.values(result).join(' ') 
                : "No response received from Gpt4 AI, Please Contact French Clarence Mangigo 😒";

        res.json({ reply: `${botResponse}` });
    } catch (error) {
        console.error('Error calling Gpt4 😒: ', error);
        res.status(500).json({ message: 'Error processing your request' });
    }
};
