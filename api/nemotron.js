const axios = require('axios');
const fs = require('fs');
const path = require('path');

const chatHistoryDir = 'nemotronChatHistory';
const apiKey = `${global.config.apikey}`;

const systemPrompt = "Respond clearly and concisely. Provide detailed responses only when requested.";

exports.config = {
    name: 'NVIDIA-Nemotron',
    author: 'Clarence',
    method: 'get',
    category: 'ai',
    description: 'Conversational AI using Nemotron model. (Conversational)',
    link: ['/NVIDIA-Nemotron?q=hi&id=']
};

exports.initialize = async function ({ req, res }) {
    try {
        const prompt = req.query.q || '';
        const userId = req.query.id;

        if (!userId) {
            return res.status(400).json({ error: "Missing required parameter: id" });
        }

        if (prompt.toLowerCase() === 'clear') {
            clearChatHistory(userId);
            return res.json({ message: "Chat history cleared!" });
        }

        if (!prompt) {
            return res.status(400).json({ error: "Please provide a prompt." });
        }

        const chatHistory = loadChatHistory(userId);
        const chatMessages = [
            { role: 'system', content: systemPrompt },
            ...chatHistory,
            { role: 'user', content: prompt }
        ];

        const payload = {
            model: 'nvidia/Nemotron-4-340B-Instruct',
            messages: chatMessages
        };

        const { data } = await axios.post('https://api.deepinfra.com/v1/openai/chat/completions', payload, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const assistantResponse = data.choices[0].message.content;

        appendToChatHistory(userId, [
            { role: 'user', content: prompt },
            { role: 'assistant', content: assistantResponse }
        ]);

        res.json({
            status: true, 
            result: assistantResponse,
            author: 'AceGerome'
        });
    } catch (error) {
        console.error("Error in chat completion:", error);
        res.status(500).json({ status: false, error: 'An error occurred while processing your request.', author: 'AceGerome' });
    }
};

function loadChatHistory(uid) {
    const chatHistoryFile = path.join(chatHistoryDir, `memory_${uid}.json`);

    try {
        if (fs.existsSync(chatHistoryFile)) {
            const fileData = fs.readFileSync(chatHistoryFile, 'utf8');
            return JSON.parse(fileData);
        } else {
            return [];
        }
    } catch (error) {
        console.error(`Error loading chat history for UID ${uid}:`, error);
        return [];
    }
}

function appendToChatHistory(uid, chatHistory) {
    const chatHistoryFile = path.join(chatHistoryDir, `memory_${uid}.json`);

    try {
        if (!fs.existsSync(chatHistoryDir)) {
            fs.mkdirSync(chatHistoryDir);
        }
        const existingHistory = loadChatHistory(uid);
        const updatedHistory = [...existingHistory, ...chatHistory];
        fs.writeFileSync(chatHistoryFile, JSON.stringify(updatedHistory, null, 2));
    } catch (error) {
        console.error(`Error saving chat history for UID ${uid}:`, error);
    }
}

function clearChatHistory(uid) {
    const chatHistoryFile = path.join(chatHistoryDir, `memory_${uid}.json`);

    try {
        if (fs.existsSync(chatHistoryFile)) {
            fs.unlinkSync(chatHistoryFile);
        }
    } catch (err) {
        console.error("Error deleting chat history file:", err);
    }
}
