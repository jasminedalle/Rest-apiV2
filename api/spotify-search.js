const axios = require('axios');

exports.config = {
    name: 'spotify',
    author: 'Clarence',
    description: 'Search for Spotify tracks based on a query and get download information',
    method: 'get',
    category: 'search',
    link: ['/spotify?search=']
};

async function getSpotifyToken() {
    try {
        const url = "https://accounts.spotify.com/api/token";
        const clientId = "0be741ce2d1448b0b0ffcf8e626ff2d9";
        const clientSecret = "d5675a90b653419e8eb853a40d82a6fa";
        const response = await axios.post(
            url,
            new URLSearchParams({
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Error generating Spotify token:", error);
        throw new Error("Failed to generate Spotify token.");
    }
}

function formatDuration(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

exports.initialize = async function ({ req, res }) {
    try {
        const keyword = req.query.search;
        const artist = req.query.artist;

        if (!keyword) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Enter the 'search' parameter!",
                usage: {
                    search_tracks: "/spotify?search=so far so good",
                    with_artist_optional: "/spotify?search=so far so good&artist=Rex Orange County"
                },
            });
        }

        const token = await getSpotifyToken();

        let query = `track:${keyword}`;
        if (artist) query += ` artist:${artist}`;
        const encodedQuery = encodeURIComponent(query);

        const url = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=1&offset=0&include_external=audio`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = response.data.tracks;

        if (!data || !data.items || data.items.length === 0) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: `No tracks found for '${keyword}'!`
            });
        }

        const track = data.items[0];
        const trackInfo = {
            name: track.name,
            album: track.album.name,
            artists: track.artists.map(artist => artist.name),
            release_date: track.album.release_date,
            duration_ms: formatDuration(track.duration_ms),
            popularity: track.popularity,
            preview_url: track.preview_url,
            spotify_url: track.external_urls.spotify,
            album_image: track.album.images[0]?.url || null
        };

        const spotifyDlUrl = `https://spotydown.media/api/download-track`;
        const downloadResponse = await axios.post(
            spotifyDlUrl,
            { url: track.external_urls.spotify },
            { headers: { "Content-Type": "application/json" } }
        );

        const downloadUrl = downloadResponse?.data?.file_url;

        return res.json({
            status: true,
            creator: this.config.author,
            track: trackInfo,
            download: {
                download_url: downloadUrl || "Download information is not available."
            }
        });
    } catch (error) {
        console.error("Error fetching Spotify data:", error);
        res.status(500).json({
            status: false,
            creator: this.config.author,
            message: "Internal server error. Please try again later."
        });
    }
};