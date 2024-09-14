// app.js
const express = require('express');
const { validateID } = require('./transcriptUtils'); // Adjust the path accordingly
const cors = require('cors');
const app = express();
const { Innertube } = require('youtubei.js');

app.use(cors())

const port = 3000;

// Define a route to fetch video transcript
app.get('/api/transcript/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;
        const isValid = validateID(videoId);

        if (!isValid) {
            res.status(400).json({ error: 'Invalid video ID' });

            return;
        }

        const youtube = await Innertube.create({
            lang: "en",
            location: "US",
            retrieve_player: false,
        });

        const info = await youtube.getInfo(videoId);
        const transcriptData = await info.getTranscript();

        const mappedTranscript = transcriptData?.transcript?.content?.body?.initial_segments.map(
            (segment) => ({
                start_ms: Number(segment.start_ms) ?? 0,
                end_ms: Number(segment.end_ms) ?? 0,
                text: segment.snippet.text ?? '',
            })
        ) ?? [];

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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
