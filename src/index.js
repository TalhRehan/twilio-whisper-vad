require('dotenv').config(); // Ensure environment variables are loaded
const twilio = require('twilio');
const ws = require('ws');
const { processAudioStream } = require('./audioProcessor');

// Load Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const streamUrl = process.env.TWILIO_STREAM_URL;

if (!accountSid || !authToken || !streamUrl) {
    console.error('Twilio credentials or stream URL are missing. Check your .env file.');
    process.exit(1); // Exit if credentials are missing
}

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Create a WebSocket connection to Twilio's audio stream
const socket = new ws(streamUrl);

// Event: When the WebSocket connection is opened
socket.on('open', () => {
    console.log('WebSocket connection opened.');

    // Authenticate with Twilio (if required)
    const authMessage = JSON.stringify({
        accountSid,
        authToken,
    });
    socket.send(authMessage);
});

// Event: When a message (audio stream) is received
socket.on('message', (data) => {
    console.log('Received audio stream data:', data);

    // Process the audio stream using the imported function
    processAudioStream(data).catch((error) => {
        console.error('Error processing audio stream:', error);
    });
});

// Event: When the WebSocket connection is closed
socket.on('close', () => {
    console.log('WebSocket connection closed.');
});

// Event: When an error occurs
socket.on('error', (error) => {
    console.error('WebSocket error:', error);
});