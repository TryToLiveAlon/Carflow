// api/movie.js
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const OMDB_API_KEY = "4d146d7";

async function getIMDBId(movieName) {
  const res = await fetch(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(movieName)}`);
  const data = await res.json();
  return data.Response === "True" ? data.imdbID : null;
}

async function getTrailerMp4(url) {
  const html = await (await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  })).text();

  const $ = cheerio.load(html);
  const script = $("script")
    .map((_, el) => $(el).html())
    .get()
    .find(str => str && str.includes("imdbPlayerJson"));

  const match = script?.match(/imdbPlayerJson\s*=\s*({.*});/s);
  if (!match) return null;

  const json = JSON.parse(match[1]);
  const mp4 = json.videoPlayerObject?.video?.playbackURLs?.find(v => v.mimeType === "video/mp4");
  return mp4?.url || null;
}

async function scrapeIMDB(imdbID) {
  const imdbURL = `https://www.imdb.com/title/${imdbID}/`;
  const html = await (await fetch(imdbURL)).text();
  const $ = cheerio.load(html);
  const jsonData = $("script[type='application/ld+json']").html();
  const imdbData = JSON.parse(jsonData);

  const trailerUrl = imdbData.trailer?.url;
  const trailerMp4 = trailerUrl ? await getTrailerMp4(trailerUrl) : null;

  return {
    title: imdbData.name,
    rating: imdbData.aggregateRating?.ratingValue,
    director: imdbData.director?.[0]?.name || "Unknown",
    genres: imdbData.genre,
    poster: imdbData.image,
    trailer: trailerMp4,
  };
}

export default async function handler(req, res) {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: "Missing movie name" });

  const imdbID = await getIMDBId(name);
  if (!imdbID) return res.status(404).json({ error: "Movie not found" });

  const data = await scrapeIMDB(imdbID);
  res.json(data);
}
