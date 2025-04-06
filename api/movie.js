import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const router = express.Router();
const OMDB_API_KEY = "4d146d7"; // Replace with your real OMDB key

// Get IMDb ID from OMDB
async function getIMDBId(movieName) {
    try {
        const res = await fetch(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(movieName)}`);
        const data = await res.json();
        return data.Response === "True" ? data : null;
    } catch (err) {
        console.error("OMDB error:", err);
        return null;
    }
}

// Get IMDb trailer page URL
async function getTrailerPageUrl(imdbID) {
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
}

// Extract multiple valid .mp4 trailer links
async function getAllMp4FromTrailerPage(trailerPageUrl) {
    try {
        const res = await fetch(trailerPageUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
        const html = await res.text();

        // Extract all .mp4 links and filter out .m3u8
        const allMp4Links = [...html.matchAll(/https:\/\/.*?\.mp4\?[^"]+/g)]
            .map(match => match[0].replace(/\\u0026/g, "&"))
            .filter(link => !link.includes(".m3u8"));

        return [...new Set(allMp4Links)]; // Remove duplicates if any
    } catch (err) {
        console.error("Error extracting mp4 trailer links:", err);
        return [];
    }
}

// Main route
router.get("/", async (req, res) => {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "Missing movie name" });

    const movieData = await getIMDBId(name);
    if (!movieData) return res.status(404).json({ error: "Movie not found" });

    const imdbID = movieData.imdbID;
    const trailerPageUrl = await getTrailerPageUrl(imdbID);
    const trailers = trailerPageUrl ? await getAllMp4FromTrailerPage(trailerPageUrl) : [];

    res.json({
        ...movieData,
        trailers: trailers // returns an array like [url1, url2, ...]
    });
});

export default router;
