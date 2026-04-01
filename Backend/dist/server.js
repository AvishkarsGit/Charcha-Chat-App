"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("./environments/environment");
const UserRouter_1 = __importDefault(require("./routers/UserRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const ChatRouter_1 = __importDefault(require("./routers/ChatRouter"));
const MessageRouter_1 = __importDefault(require("./routers/MessageRouter"));
const Socket_1 = require("./utils/Socket");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
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
    configSocket(io) {
        (0, Socket_1.chatSocket)(io);
    }
    allowCors() {
        this.app.use((0, cors_1.default)({
            origin: "http://localhost:5173",
            credentials: true,
        }));
    }
    connectToDatabase() {
        mongoose_1.default
            .connect(environment_1.env.mongo_uri)
            .then(() => console.log(`connected to db`))
            .catch((err) => console.log(err));
    }
    setRoutes() {
        this.app.use("/api/user", UserRouter_1.default);
        this.app.use("/api/chat", ChatRouter_1.default);
        this.app.use("/api/message", MessageRouter_1.default);
    }
    configJSONandURL() {
        this.app.use(express_1.default.json({ limit: "16kb" }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
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
        this.app.use((error, req, res, next) => {
            const errorStatus = req.errorStatus || 500;
            res.status(errorStatus).json({
                message: error.message || "Something went wrong, please try again",
                status_code: errorStatus,
            });
        });
    }
    setCookieParser() {
        this.app.use((0, cookie_parser_1.default)());
    }
}
exports.Server = Server;
