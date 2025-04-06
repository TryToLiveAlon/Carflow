import fetch from "node-fetch";
import * as cheerio from "cheerio";

const OMDB_API_KEY = "4d146d7"; // Replace with your real OMDB key

// Get IMDb data
const getIMDBData = async (movieName) => {
    try {
        const res = await fetch(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(movieName)}`);
        const data = await res.json();
        return data.Response === "True" ? data : null;
    } catch (err) {
        console.error("OMDB error:", err);
        return null;
    }
};

// Get IMDb trailer page URL
const getTrailerPageUrl = async (imdbID) => {
    try {
        const imdbURL = `https://www.imdb.com/title/${imdbID}/`;
        const res = await fetch(imdbURL, { headers: { "User-Agent": "Mozilla/5.0" } });
        const html = await res.text();
        const $ = cheerio.load(html);

        const ldJson = $("script[type='application/ld+json']").html();
        if (!ldJson) return null;

        const json = JSON.parse(ldJson);
        return json?.trailer?.url || null;
    } catch (err) {
        console.error("Error getting trailer page:", err);
        return null;
    }
};

// Extract all .mp4 trailer links
const getAllMp4FromTrailerPage = async (trailerPageUrl) => {
    try {
        const res = await fetch(trailerPageUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
        const html = await res.text();

        const allMp4Links = [...html.matchAll(/https:\/\/.*?\.mp4\?[^"]+/g)]
            .map(match => match[0].replace(/\\u0026/g, "&"))
            .filter(link => !link.includes(".m3u8"));

        return [...new Set(allMp4Links)];
    } catch (err) {
        console.error("Error extracting mp4 trailer links:", err);
        return [];
    }
};

// 🎬 Main API Handler
const movieHandler = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ error: "Missing movie name" });

        const movieData = await getIMDBData(name);
        if (!movieData) return res.status(404).json({ error: "Movie not found" });

        const trailerPageUrl = await getTrailerPageUrl(movieData.imdbID);
        const trailers = trailerPageUrl ? await getAllMp4FromTrailerPage(trailerPageUrl) : [];

        res.json({
            ...movieData,
            trailers,
            provider: "https://t.me/TryToLiveAlon",
            api_documentation: "https://death-docs.vercel.app/API/Quick%20Start"
        });
    } catch (error) {
        console.error("Movie API Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default movieHandler;
