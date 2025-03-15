const { exec } = require('child_process');//Used to run external commands (e.g., FFmpeg) from Node.js.
const fs = require('fs');//Used to read and write files (e.g., temporary audio files).
const path = require('path');//Used to handle file paths

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

module.exports = { decodeULawToPCM };