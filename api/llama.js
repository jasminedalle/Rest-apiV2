const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');

const chatHistoryDir = 'groqllama70b';
const apiKey = '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';

const groq = new Groq({ apiKey });

const systemPrompt = `Your name is 𝙽𝚎𝚔𝚘 𝙰𝙸, your developer was "French Clarence Mangigo". You are made to answer questions, help with their tasks and assignments. Your main language is English but can respond in Tagalog, Bisaya, or other languages as needed.`;

exports.config = {
    name: 'llama',
    author: 'Clarence',
    method: 'get',
    category: 'ai',
    description: 'Use it if you want very fast answers. (Uses Llama3 70b)(Conversational)',
    link: ['/llama?prompt=hi']
};

exports.initialize = async function ({ req, res }) {
    try {
        const prompt = req.query.prompt || '';
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

        const chatCompletion = await groq.chat.completions.create({
            messages: chatMessages,
            model: 'llama3-70b-8192',
            temperature: 0.6,
            max_tokens: 8192,
            top_p: 0.8,
            stream: false,
            stop: null
        });

        const assistantResponse = chatCompletion.choices[0].message.content;
        const totalWords = assistantResponse.split(/\s+/).filter(word => word !== '').length;

        appendToChatHistory(userId, [
            { role: 'user', content: prompt },
            { role: 'assistant', content: assistantResponse }
        ]);

        res.json({
            response: assistantResponse,
            totalWords: totalWords
        });
    } catch (error) {
        console.error("Error in chat completion:", error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
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
        fs.writeFileSync(chatHistoryFile, JSON.stringify(chatHistory, null, 2));
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
