import express from "express";
import axios from "axios";
import * as cheerio from "cheerio"; // Correct way to import cheerio
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const OMDB_API_KEY = "4d146d7"; // Replace with your actual OMDB API Key

app.use(express.json()); // Middleware to parse JSON requests

// Function to get IMDb ID from OMDB API
async function getIMDBId(movieName) {
    try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(movieName)}`);
        const data = response.data;
        if (data.Response === "True") {
            return data.imdbID;
        }
        return null;
    } catch (error) {
        console.error("Error fetching IMDb ID:", error);
        return null;
    }
}

// Function to scrape IMDb data
async function scrapeIMDB(imdbID) {
    try {
        const imdbURL = `https://www.imdb.com/title/${imdbID}/`;
        const response = await fetch(imdbURL, { 
            headers: { "User-Agent": "Mozilla/5.0" } 
        });

        if (!response.ok) throw new Error("Failed to fetch IMDb page");

        const html = await response.text();
        const $ = cheerio.load(html);
        const jsonData = $("script[type='application/ld+json']").html();
        if (!jsonData) return { error: "Failed to extract JSON data" };

        const imdbData = JSON.parse(jsonData);

        return {
            ratingValue: imdbData.aggregateRating?.ratingValue || "N/A",
            description: imdbData.description || "No description found.",
            director: imdbData.creator?.filter(creator => creator["@type"] === "Person").map(d => d.name).join(", ") || "Unknown",
            genres: imdbData.genre || [],
            releaseDate: imdbData.datePublished || "Unknown",
            languages: imdbData.inLanguage || "Unknown",
            images: {
                poster: imdbData.image || "No image found",
                trailer_thumbnail: imdbData.trailer?.thumbnailUrl || "No trailer image found"
            }
        };
    } catch (error) {
        console.error("Error scraping IMDb:", error);
        return { error: "Failed to scrape IMDb" };
    }
}

// API Route - POST request to fetch movie details (New route: /api/movie)
app.post("/api/movie", async (req, res) => {
    const { movieName } = req.body;

    if (!movieName) {
        return res.status(400).json({ error: "Movie name is required" });
    }

    const imdbID = await getIMDBId(movieName);
    if (!imdbID) {
        return res.status(404).json({ error: "Movie not found!" });
    }

    const movieDetails = await scrapeIMDB(imdbID);
    res.json(movieDetails);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api/movie`);
});
      
