import { NextFunction, Request, Response } from "express";
import ITokenService from "@/domain/interface/services/ITokenService";
import { StatusCode } from "@/types";

export default class AuthMiddleware {
  constructor(private tokenService: ITokenService) {
    this.exec = this.exec.bind(this);
  }

  exec(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.auth_token;
      if (token) {
        const { email, id } = this.tokenService.verifyToken(token);
        if (id && email) {
          req.user = { email, id };
          return next();
        }
      }

      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        const tokenString = authHeader.split(" ")[1];
        const { email, id } = this.tokenService.verifyToken(tokenString);
        if (id && email) {
          req.user = { email, id };
          return next();
        }
      }

      res.status(StatusCode.Unauthorized).json({
        message: "Unauthorized: No valid token provided"
      });

    } catch (error: any) {
      if (error.message === "Token Expired") {
        res.status(StatusCode.Unauthorized).json({ message: "Access token expired" });
        return;
      }
      res.status(StatusCode.Unauthorized).json({ message: "Unauthorized: Invalid Access token" });
    }
  }
}
