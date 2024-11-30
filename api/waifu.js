const axios = require('axios');

exports.config = {
    name: 'waifu',
    author: 'Clarence',
    description: 'Fetches waifu images based on a specific query.',
    method: 'get',
    category: 'anime',
    link: ['/waifu?q=']
};

exports.initialize = async function ({ req, res }) {
    try {
        const { q } = req.query;  

        let query = q;
        const validCommands = [
            'maid', 'waifu', 'marin-kitagawa', 'mori-calliope', 'raiden-shogun',
            'oppai', 'selfies', 'uniform', 'ass', 'hentai', 'milf', 'oral', 'paizuri', 'ecchi'
        ];

        
        if (!q || !validCommands.includes(q)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid or missing "q" parameters. Please use one of the following valid query:',
                validQuery: validCommands
            });
        }

        const fetchWaifuData = async (query) => {
            try {
                const response = await axios.get(`https://api.waifu.im/search?${query}`);
                const data = response.data.images[0];

                const imageData = data ? {
                    url: data.url,
                    signature: data.signature,
                    extension: data.extension,
                    imageId: data.image_id,
                    favorites: data.favorites,
                    color: data.dominant_color,
                    source: data.source,
                    artist: data.artist,
                    uploadedAt: data.uploaded_at,
                    likedAt: data.liked_at,
                    isNsfw: data.is_nsfw,
                    width: data.width,
                    height: data.height,
                    byteSize: data.byte_size,
                } : null;

                return imageData;
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching waifu image data');
            }
        };

        const waifuData = await fetchWaifuData(query);

        if (!waifuData) {
            return res.status(404).json({ error: 'No image found for the given command' });
        }

        res.json(waifuData);
    } catch (error) {
        console.error("Error fetching Waifu image:", error.message);
        res.status(500).json({
            status: false,
            creator: this.config.author,
            message: 'Failed to retrieve a Waifu image.'
        });
    }
};
