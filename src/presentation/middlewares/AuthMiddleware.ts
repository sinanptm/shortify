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

         if (!token) {
            res.status(StatusCode.Unauthorized).json({ message: "Unauthorized: No Token Pr" });
            return;
         }
         const { email, id } = this.tokenService.verifyToken(req.cookies.auth_token);
         if (!id || !email) {
            res
               .status(StatusCode.Unauthorized)
               .json({ message: "Unauthorized: No or invalid Access token provided" });
            return;
         }

         req.user = { email, id };
         next();

      } catch (error: any) {
         if (error.message === "Token Expired") {
            res.status(StatusCode.Unauthorized).json({ message: "Access token expired" });
            return;
         }
         res.status(StatusCode.Unauthorized).json({ message: "Unauthorized: Invalid Access token" });
         return;
      }
   }
}