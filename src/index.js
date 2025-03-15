require('dotenv').config();
const twilio = require('twilio');
const ws = require('ws');
const { processAudioStream } = require('./audioProcessor'); // Import the function

// Load Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const streamUrl = process.env.TWILIO_STREAM_URL;

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
    processAudioStream(data);
});

// Event: When the WebSocket connection is closed
socket.on('close', () => {
    console.log('WebSocket connection closed.');
});

// Event: When an error occurs
socket.on('error', (error) => {
    console.error('WebSocket error:', error);
});