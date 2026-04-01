
import { env } from "../environments/environment";
import { JWT } from "../utils/JWT";

export class GlobalMiddleware {
  static checkError(schema: any, property = "body") {
    return (req: any, res: any, next: any) => {
      const result = schema.safeParse(req[property]);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: result.error.issues.map((err: any) => ({
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

  static async auth(req: any, res: any, next: any) {
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
        env.access_token_secrete,
      );
      req.user = decoded;
      next();
    } catch (error) {
      req.errorStatus = 401;
      next(error);
    }
  }
}
