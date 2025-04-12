import axios from "axios";
import cheerio from "cheerio";
import iso8601 from "iso8601-duration";
import { parse, format } from "date-fns";

function formatDuration(iso) {
    try {
        const duration = iso8601.parse(iso);
        const totalSeconds = (duration.minutes || 0) * 60 + (duration.seconds || 0);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } catch {
        return iso;
    }
}

function formatReleaseDate(raw) {
    try {
        const event = JSON.parse(raw);
        if (event.name) {
            const date = parse(event.name, 'yyyy-MM-dd', new Date());
            return format(date, 'MMMM d, yyyy');
        }
    } catch {
        return raw;
    }
    return raw;
}

async function searchGaana(songName) {
    const searchUrl = `https://gaana.com/search/${encodeURIComponent(songName)}`;
    const { data } = await axios.get(searchUrl, {
        headers: { "User-Agent": "Mozilla/5.0" }
    });
    const $ = cheerio.load(data);
    const songPath = $("a[href^='/song/']").first().attr("href");
    return songPath ? `https://gaana.com${songPath}` : null;
}

async function fetchLyricsData(songUrl) {
    const lyricsUrl = songUrl.replace('/song/', '/lyrics/');
    const { data } = await axios.get(lyricsUrl, {
        headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);
    const jsonScript = $("script[type='application/ld+json']").last().html();
    if (!jsonScript) throw new Error("No structured data found");

    const raw = JSON.parse(jsonScript);

    const lyricsMatch = jsonScript.match(/"text"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    const lyrics = lyricsMatch ? JSON.parse(`"${lyricsMatch[1]}"`) : "";

    return {
        name: raw.name || "",
        url: raw.url || "",
        image: raw.image || "",
        language: raw.inLanguage || "",
        duration: formatDuration(raw.timeRequired || ""),
        genre: raw.genre || "",
        release_date: formatReleaseDate(JSON.stringify(raw.releasedEvent || "")),
        lyrics: lyrics
    };
}

// ✅ Exported handler function
export default async function lyricsHandler(req, res) {
    const songName = req.query.songname;
    if (!songName) {
        return res.status(400).json({ error: 'Missing "songname" parameter' });
    }

    try {
        const songUrl = await searchGaana(songName);
        if (!songUrl) {
            return res.status(404).json({ error: "Song not found" });
        }

        const data = await fetchLyricsData(songUrl);
        return res.json(data);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to fetch lyrics", details: err.message });
    }
          }
