# Twilio Whisper VAD Project

This project processes a live Twilio audio stream, decodes it, resamples it, and uses Whisper VAD to detect and record human speech.

## Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Add your Twilio credentials to the `.env` file.
4. Run `node src/index.js` to start the application.