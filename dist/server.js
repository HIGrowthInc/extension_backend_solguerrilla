"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const index_1 = require("./src/index");
const http = require("http");
const socket_1 = require("./src/socket");
const app = express();
// app.use(express.static(path.resolve(__dirname, '../client/build')));
// app.use(express.static(path.resolve(__dirname, './uploads')));
const server = new index_1.default(app);
const port = 3000;
// Have Node serve the files for our built React app
const HttpServer = http.createServer(app);
const wss = new socket_1.default(HttpServer);
// const serverSocket = new ServerSocket(wss); // socket for notification
HttpServer.listen(port, () => {
    console.info(`Server running on : http://localhost:${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log('server startup error: address already in use');
    }
    else {
        console.log(err);
    }
});
//# sourceMappingURL=server.js.map