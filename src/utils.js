const { exec } = require('child_process'); // Used to run external commands (e.g., FFmpeg) from Node.js.
const fs = require('fs'); // Used to read and write files (e.g., temporary audio files).
const path = require('path'); // Used to handle file paths.
const ffmpeg = require('ffmpeg-static');

/**
 * Splits audio data into chunks of 500-700ms.
 * @param {Buffer} audioData - The input audio data.
 * @param {number} sampleRate - The sample rate of the audio (e.g., 16000).
 * @param {number} bitDepth - The bit depth of the audio (e.g., 16).
 * @returns {Buffer[]} - An array of audio chunks.
 */
const splitAudioIntoChunks = (audioData, sampleRate = 16000, bitDepth = 16) => {
    const bytesPerSample = bitDepth / 8; // 2 bytes for 16-bit audio
    const samplesPerChunkMin = sampleRate * 0.5; // 500ms
    const samplesPerChunkMax = sampleRate * 0.7; // 700ms
    const bytesPerChunkMin = samplesPerChunkMin * bytesPerSample; // 16000 bytes for 500ms
    const bytesPerChunkMax = samplesPerChunkMax * bytesPerSample; // 22400 bytes for 700ms

    const chunks = [];
    let offset = 0;

    while (offset < audioData.length) {
        // Determine the size of the next chunk (random between min and max)
        const chunkSize = Math.min(
            Math.floor(bytesPerChunkMin + Math.random() * (bytesPerChunkMax - bytesPerChunkMin)),
            audioData.length - offset
        );

        // Extract the chunk
        const chunk = audioData.slice(offset, offset + chunkSize);
        chunks.push(chunk);

        // Move the offset
        offset += chunkSize;
    }

    return chunks;
};

/**
 * Decodes µ-law encoded audio to PCM format.
 * @param {Buffer} ulawData - The µ-law encoded audio data.
 * @returns {Promise<Buffer>} - The decoded PCM audio data.
 */
const decodeULawToPCM = (ulawData) => {
    return new Promise((resolve, reject) => {
        // Create temporary file paths
        const inputFile = path.join(__dirname, 'temp_input.ulaw');
        const outputFile = path.join(__dirname, 'temp_output.pcm');

        // Write the µ-law audio data to a temporary file
        fs.writeFileSync(inputFile, ulawData);

        // FFmpeg command to decode µ-law to PCM
        const command = `ffmpeg -f mulaw -ar 8000 -i ${inputFile} -f s16le -ar 8000 ${outputFile}`;

        // Execute the FFmpeg command
        exec(command, (err) => {
            if (err) {
                // Clean up temporary files
                fs.unlinkSync(inputFile);
                fs.unlinkSync(outputFile);
                return reject(new Error(`FFmpeg error: ${err.message}`));
            }

            // Read the decoded PCM data
            const pcmData = fs.readFileSync(outputFile);

            // Clean up temporary files
            fs.unlinkSync(inputFile);
            fs.unlinkSync(outputFile);

            // Resolve with the PCM data
            resolve(pcmData);
        });
    });
};

/**
 * Resamples audio to 16kHz and converts it to 16-bit mono PCM format.
 * @param {Buffer} inputData - The input audio data (8000Hz µ-law or PCM).
 * @returns {Promise<Buffer>} - The resampled and converted audio data.
 */
const resampleAudio = (inputData) => {
    return new Promise((resolve, reject) => {
        // Create temporary file paths
        const inputFile = path.join(__dirname, 'temp_input.wav');
        const outputFile = path.join(__dirname, 'temp_output.wav');

        // Write the input audio data to a temporary file
        fs.writeFileSync(inputFile, inputData);

        // FFmpeg command to resample and convert audio
        const command = `${ffmpeg} -i ${inputFile} -ar 16000 -ac 1 -acodec pcm_s16le ${outputFile}`;

        // Execute the FFmpeg command
        exec(command, (err) => {
            if (err) {
                // Clean up temporary files
                fs.unlinkSync(inputFile);
                fs.unlinkSync(outputFile);
                return reject(new Error(`FFmpeg error: ${err.message}`));
            }

            // Read the resampled and converted audio data
            const outputData = fs.readFileSync(outputFile);

            // Clean up temporary files
            fs.unlinkSync(inputFile);
            fs.unlinkSync(outputFile);

            // Resolve with the output audio data
            resolve(outputData);
        });
    });
};

// Export all functions in a single module.exports statement
module.exports = { splitAudioIntoChunks, decodeULawToPCM, resampleAudio };