const ws = require('ws');

// Create a WebSocket server
const wss = new ws.Server({ port: 8080 });

wss.on('connection', (socket) => {
    console.log('Client connected to WebSocket server.');

    // Simulate sending audio data
    const sendAudioData = () => {
        const mockAudioData = Buffer.from([0x7F, 0xFF, 0x80, 0x00]); // Mock µ-law audio data
        socket.send(mockAudioData);
        console.log('Sent mock audio data:', mockAudioData);
    };

    // Send mock audio data every second
    setInterval(sendAudioData, 1000);

    // Handle client disconnection
    socket.on('close', () => {
        console.log('Client disconnected.');
    });
});

console.log('Mock WebSocket server running on ws://localhost:8080');