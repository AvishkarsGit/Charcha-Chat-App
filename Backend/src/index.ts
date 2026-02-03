import http from "http";
import { Server } from "./server";

import { Server as SocketServer } from "socket.io";

const server = new Server();
const app = server.app;

const port = process.env.PORT || 3000;

//create http server
const httpServer = http.createServer(app);

//socket io
const io = new SocketServer(httpServer, {
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
