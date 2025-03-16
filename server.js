const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query is required" });

    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, {
            waitUntil: "domcontentloaded",
        });

        const results = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("h3")).map(el => el.innerText);
        });

        await browser.close();
        res.json({ results });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch results" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
