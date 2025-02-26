import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { movieName } = req.body;
    if (!movieName) {
        return res.status(400).json({ error: "Movie name is required!" });
    }

    const OMDB_API_KEY = "4d146d7"; // Replace with your actual OMDB API key

    try {
        // Fetch IMDb ID from OMDB API
        const omdbResponse = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(movieName)}`);
        const omdbData = omdbResponse.data;

        if (omdbData.Response !== "True") {
            return res.status(404).json({ error: "Movie not found!" });
        }

        const imdbID = omdbData.imdbID;
        const imdbURL = `https://www.imdb.com/title/${imdbID}/`;

        // Scrape IMDb
        const imdbResponse = await axios.get(imdbURL, { headers: { "User-Agent": "Mozilla/5.0" } });
        const $ = cheerio.load(imdbResponse.data);
        const jsonData = $("script[type='application/ld+json']").html();

        if (!jsonData) {
            return res.status(500).json({ error: "Failed to extract JSON data" });
        }

        const imdbData = JSON.parse(jsonData);

        const movieDetails = {
            title: imdbData.name || "Unknown",
            rating: imdbData.aggregateRating?.ratingValue || "N/A",
            description: imdbData.description || "No description available.",
            director: imdbData.creator?.filter(person => person["@type"] === "Person").map(d => d.name).join(", ") || "Unknown",
            genres: imdbData.genre || [],
            releaseDate: imdbData.datePublished || "Unknown",
            languages: imdbData.inLanguage || "Unknown",
            images: {
                poster: imdbData.image || "No image available",
                trailer: imdbData.trailer?.thumbnailUrl || "No trailer available"
            }
        };

        return res.status(200).json(movieDetails);
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
