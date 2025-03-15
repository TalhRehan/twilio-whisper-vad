const { decodeULawToPCM } = require('./utils');

const processAudioStream = async (audioData) => {
    try {
        // Decode µ-law audio to PCM
        const pcmData = await decodeULawToPCM(audioData);
        console.log('Decoded PCM data:', pcmData);

        // Further processing (e.g., resampling, VAD)
    } catch (error) {
        console.error('Error decoding audio:', error);
    }
};

module.exports = { processAudioStream };