const axios = require('axios');

async function validateID(id) {
    try {
        await axios.get(`https://video.google.com/timedtext?type=track&v=${id}&id=0&lang=en`);
        return true;
    } catch (error) {
        return false;
    }
}

function processTranscript(transcriptData, fields) {
    const mappedTranscript = transcriptData?.transcript?.content?.body?.initial_segments
        ?.map((segment) => ({
            start_ms: Number(segment.start_ms) ?? 0,
            end_ms: Number(segment.end_ms) ?? 0,
            text: segment.snippet.text.toLowerCase() ?? '',
        }))
        ?.filter((segment) => {
            const bracketedWordPattern = /\[[^\]]+\]/u;
            return !bracketedWordPattern.test(segment.text);
        }) ?? [];

    if (!mappedTranscript.length) {
        return [];
    }

    if (!fields) {
        return mappedTranscript;
    }

    return mappedTranscript.map(segment => {
        const filteredSegment = {};
        fields.forEach(field => {
            if (segment.hasOwnProperty(field)) {
                filteredSegment[field] = segment[field];
            }
        });
        return filteredSegment;
    });
}

module.exports = {
    validateID,
    processTranscript,
};
