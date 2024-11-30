const axios = require('axios');

exports.config = {
    name: "rant",
    author: "Clarence",
    description: "Retrieve posts based on recipient.",
    method: 'get',
    category: "social",
    link: ["/rant?q="],
};

async function fetchPosts(q, page = 1, limit = 5) {
    const url = 'https://api.sendthesong.xyz/api/posts';

    try {
        const response = await axios.get(url, {
            params: { q, page, limit },
            headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
             'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
             'Referer': 'https://sendthesong.xyz/'
            }
        });

        if (response.status === 200) {
            const data = response.data.data.map((post) => ({
                recipient: post.recipient,
                message: post.message,
                song_link: `https://open.spotify.com/track/${post.song_id}`,
                song_name: post.song_name,
                song_artist: post.song_artist,
                song_image: post.song_image,
                created_at: post.created_at,
            }));

            return {
                status: "success",
                data,
                page: response.data.page || 1,
                author: "Clarence",
            };
        } else {
            console.error(`Request failed with status ${response.status}: ${response.statusText}`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        return null;
    }
}

exports.initialize = async function ({ req, res }) {
    const { q, page = 1, limit = 5 } = req.query; 
    if (!q) {
        return res.status(400).json({ error: 'The "q" parameter is required.' });
    }

    const postsData = await fetchPosts(q, page, limit);

    if (postsData) {
        return res.status(200).json(postsData);
        return res.status(500).json({ error: "Failed to fetch posts." });
    }
};
