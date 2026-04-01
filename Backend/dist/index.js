"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const server_1 = require("./server");
const socket_io_1 = require("socket.io");
const server = new server_1.Server();
const app = server.app;
const port = process.env.PORT || 3000;
//create http server
const httpServer = http_1.default.createServer(app);
//socket io
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});
//initialize socket
server.configSocket(io);
httpServer.listen(port, () => {
    console.log(`Server listen at port :${port}`);
});
