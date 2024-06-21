import express from 'express'
import WebSocket ,{ WebSocketServer } from 'ws'

const app = express()
const httpServer = app.listen(8080)

let userCount = 0

const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    console.log('received: %s', data);
    // wss.clients.forEach(function each(client) {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(data, { binary: isBinary });
    //   }
    // });
  });
  console.log('Client connected',++userCount);
  ws.send('Hello! Message From Server!!');

  
});
