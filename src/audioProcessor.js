const { decodeULawToPCM, resampleAudio, splitAudioIntoChunks } = require('./utils');

const processAudioStream = async (audioData) => {
    try {
        // Decode µ-law audio to PCM
        const pcmData = await decodeULawToPCM(audioData);
        console.log('Decoded PCM data:', pcmData);

        // Resample and convert audio to 16kHz, 16-bit mono PCM
        const resampledData = await resampleAudio(pcmData);
        console.log('Resampled audio data:', resampledData);

        // Split audio into chunks of 500-700ms
        const chunks = splitAudioIntoChunks(resampledData);
        console.log('Number of chunks:', chunks.length);

        // Process each chunk (e.g., pass to VAD or Whisper)
        for (const chunk of chunks) {
            console.log('Processing chunk:', chunk.length, 'bytes');
            // Add your processing logic here (e.g., VAD, Whisper)
        }
    } catch (error) {
        console.error('Error processing audio:', error);
        throw error; // Propagate the error
    }
};

module.exports = { processAudioStream };