"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalMiddleware = void 0;
const environment_1 = require("../environments/environment");
const JWT_1 = require("../utils/JWT");
class GlobalMiddleware {
    static checkError(schema, property = "body") {
        return (req, res, next) => {
            const result = schema.safeParse(req[property]);
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: result.error.issues.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
            }
            //attached validated data
            req[property] = result.data;
            next();
        };
    }
    static async auth(req, res, next) {
        try {
            const token = req.cookies?.accessToken ||
                req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                req.errorStatus = 401;
                next(new Error("User doesn't exists"));
            }
            const decoded = await JWT_1.JWT.jwtVerify(token, environment_1.env.access_token_secrete);
            req.user = decoded;
            next();
        }
        catch (error) {
            req.errorStatus = 401;
            next(error);
        }
    }
}
exports.GlobalMiddleware = GlobalMiddleware;
