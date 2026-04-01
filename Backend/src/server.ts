import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import { env } from "./environments/environment";
import UserRouter from "./routers/UserRouter";
import cookieParser from "cookie-parser";
import ChatRouter from "./routers/ChatRouter";
import MessageRouter from "./routers/MessageRouter";
import { Server as server } from "socket.io";
import { chatSocket } from "./utils/Socket";

export class Server {
  public app = express();

  constructor() {
    this.setConfig();
    this.setRoutes();
    this.error404Handler();
    this.handleErrors();
  }

  setConfig() {
    this.connectToDatabase();
    this.allowCors();
    this.setCookieParser();
    this.configJSONandURL();
  }

  configSocket(io: server) {
    chatSocket(io);
  }

  allowCors() {
    this.app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      }),
    );
  }

  connectToDatabase() {
    mongoose
      .connect(env.mongo_uri)
      .then(() => console.log(`connected to db`))
      .catch((err) => console.log(err));
  }

  setRoutes() {
    this.app.use("/api/user", UserRouter);
    this.app.use("/api/chat", ChatRouter);
    this.app.use("/api/message", MessageRouter);
  }

  configJSONandURL() {
    this.app.use(express.json({ limit: "16kb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "16kb" }));
  }

  error404Handler() {
    this.app.use((req, res) => {
      res.status(404).json({
        message: "Not Found",
        status_code: 404,
      });
    });
  }
  handleErrors() {
    this.app.use((error: any, req: any, res: any, next: any) => {
      const errorStatus = req.errorStatus || 500;
      res.status(errorStatus).json({
        message: error.message || "Something went wrong, please try again",
        status_code: errorStatus,
      });
    });
  }

  setCookieParser() {
    this.app.use(cookieParser());
  }
}
