// app.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const { validateID } = require('./utils');
const { Innertube, UniversalCache } = require('youtubei.js');

(async () => {
    const limiter = rateLimit({
        windowMs: 5 * 60 * 1000, // 5 minutes
        max: 800, // limit each IP to 450 requests per windowMs
    });
    const host = '0.0.0.0'
    const PORT = process.env.PORT || 3000;

    app.use(limiter);

    const cache = new UniversalCache(true);

    const youtube = await Innertube.create({
        lang: "en",
        location: "US",
        retrieve_player: false,
        cache,
    });

    app.get('/api/transcript/:videoId', async (req, res) => {
        try {
            const { videoId } = req.params;

            const info = await youtube.getInfo(videoId);
            const transcriptData = await info.getTranscript();

            const mappedTranscript = transcriptData?.transcript?.content?.body?.initial_segments
                ?.map((segment) => ({
                    start_ms: Number(segment.start_ms) ?? 0,
                    end_ms: Number(segment.end_ms) ?? 0,
                    text: segment.snippet.text.toLocaleLowerCase() ?? '',
                }))
                ?.filter((segment) => {
                    const bracketedWordPattern = /\[[^\]]+\]/u;

                    return !bracketedWordPattern.test(segment.text);
                }) ?? [];

            if (mappedTranscript?.length) {
                res.status(200).send(mappedTranscript);

                return;
            }

            res.send([]);
        } catch (error) {
            console.error('Error fetching transcript:', error);
            res.status(500).json({ error: 'Failed to fetch transcript' });
        }
    });

    app.get('/api/transcript/validate/:videoId', async (req, res) => {
        try {
            const { videoId } = req.params;

            const isValid = await validateID(videoId);

            if (isValid) {
                res.status(200).send({ isValid: true });

                return;
            }

            res.status(400).send({ isValid: false });
        } catch (error) {
            console.error('Error validating video ID:', error);
            res.status(500).json({ error: 'Failed to validate video ID' });
        }
    });

    // Start the server
    app.listen(PORT, host, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})();
