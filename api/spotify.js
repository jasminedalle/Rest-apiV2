const axios = require('axios');

exports.config = {
    name: 'spotifydl',
    author: 'Clarence',
    description: 'Download Spotify track metadata and file',
    method: 'get',
    category: 'downloader',
    link: ['/spotifydl?url=']
};

exports.initialize = async function ({ req, res }) {
    try {
        const url = req.query.url;

        if (!url) {
            return res.status(400).json({
                status: false,
                creator: this.config.author,
                message: 'No Spotify URL provided. Please add ?url=SPOTIFY_URL to the request.',
                usage: {
                    endpoint: "/spotifydl",
                    example: "/spotifydl?url=https://open.spotify.com/track/example"
                }
            });
        }

        const metadataResponse = await axios.post(
            'https://spotydown.media/api/get-metadata',
            { url },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const downloadResponse = await axios.post(
            'https://spotydown.media/api/download-track',
            { url },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const trackData = metadataResponse.data.apiResponse.data[0];

        res.json({
            status: true,
            creator: this.config.author,
            metadata: {
                album: trackData.album,
                album_artist: trackData.album_artist,
                artist: trackData.artist,
                track_name: trackData.name,
                isrc: trackData.isrc,
                release_date: trackData.releaseDate,
                spotify_url: trackData.url,
                cover_image: trackData.cover_url
            },
            download: {
                file_url: downloadResponse.data.file_url
            }
        });
    } catch (error) {
        console.error("Error processing Spotify URL:", error);
        res.status(500).json({
            status: false,
            creator: this.config.author,
            message: 'An error occurred while processing the Spotify URL. Please try again later.'
        });
    }
};