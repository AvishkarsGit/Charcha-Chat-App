import { getEnvironmentsVariable } from "../environments/environment";
import { JWT } from "../utils/JWT";
import jwt from "jsonwebtoken";

export class GlobalMiddleware {
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
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        req.errorStatus = 401;
        next(new Error("User doesn't exists"));
      }

      const decoded = await JWT.jwtVerify(
        token,
        getEnvironmentsVariable().access_token_secrete,
      );
      req.user = decoded;
      next();
    } catch (error) {
      req.errorStatus = 401;
      next(error);
    }
  }
}
