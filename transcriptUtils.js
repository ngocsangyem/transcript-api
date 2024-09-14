const axios = require('axios');

async function validateID(id) {
    try {
        await axios.get(`https://video.google.com/timedtext?type=track&v=${id}&id=0&lang=en`);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = { validateID };
