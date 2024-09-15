// app.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const { validateID, processTranscript } = require('./utils');
const { Innertube } = require('youtubei.js');
const cors = require('cors');

(async () => {
    const limiter = rateLimit({
        windowMs: 5 * 60 * 1000, // 5 minutes
        max: 800, // limit each IP to 450 requests per windowMs
    });
    const host = '0.0.0.0'
    const PORT = process.env.PORT || 3000;

    app.use(limiter);
    app.use(cors());

    const youtube = await Innertube.create({
        lang: "en",
        location: "US",
        retrieve_player: false,
    });

    app.get('/api/transcript/:videoId', async (req, res) => {
        try {
            const { videoId } = req.params;
            const fields = req.query._fields ? req.query._fields.split(',') : null;

            const info = await youtube.getInfo(videoId);
            const transcriptData = await info.getTranscript();

            const processedTranscript = processTranscript(transcriptData, fields);

            res.status(200).send(processedTranscript);
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
