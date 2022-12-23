import * as dotenv from 'dotenv';
dotenv.config();
import * as express from 'express';
import { Application } from 'express';
import * as path from "path";
import Server from './src/index';
import * as WebSocket from 'ws';
import * as http from 'http';
import ServerSocket from './src/socket';
import NotificationController from 'src/controllers/notificationController';
const app: Application = express();
// app.use(express.static(path.resolve(__dirname, '../client/build')));
// app.use(express.static(path.resolve(__dirname, './uploads')));


const server: Server = new Server(app);
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
// Have Node serve the files for our built React app
const HttpServer = http.createServer(app);
const wss = new ServerSocket(HttpServer);

// const serverSocket = new ServerSocket(wss); // socket for notification

HttpServer.listen(port, () => {
  console.info(`Server running on : http://localhost:${port}`);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log('server startup error: address already in use');
  } else {
    console.log(err);
  }
});