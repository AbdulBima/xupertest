const WebSocket = require('ws');
const port = 8084; // Change to a different port, e.g., 8081

const wss = new WebSocket.Server({ port });

const clients = new Set();

const broadcast = (message) => {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => {
    clients.delete(ws);
  });
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });
});

const notifyBookUpdate = (update) => {
  broadcast(JSON.stringify(update));
};

module.exports = { notifyBookUpdate };
