import { NextFunction, Response } from "express";
import ITokenService from "@/domain/interface/services/ITokenService";
import { CustomRequest, StatusCode } from "@/types";
import logger from "@/utils/logger";

export default class AuthMiddleware {
   constructor(private tokenService: ITokenService) {
      this.exec = this.exec.bind(this);
   }

   exec(req: CustomRequest, res: Response, next: NextFunction) {
      try {
         const authHeader = req.headers.authorization || req.headers.Authorization;
         const tokenString = Array.isArray(authHeader) ? authHeader[0] : authHeader;

         if (!tokenString?.startsWith("Bearer ")) {
            res
               .status(StatusCode.Unauthorized)
               .json({ message: "Unauthorized: No or invalid Access token provided" });
               return
         }

         const token = tokenString.split(" ")[1];

         if (!token) {
            res.status(StatusCode.Unauthorized).json({ message: "Unauthorized: Access Token is missing" });
            return
         }

         const { email, id, } = this.tokenService.verifyAccessToken(token);
         if (!id || !email ) {
            logger.warn("Unauthorized: Invalid Access Token Attempt");
            res.status(StatusCode.Unauthorized).json({ message: "Unauthorized: Invalid Access Token" });
            return
         }

         req.user = { email, id };
         next();
      } catch (error: any) {
         if (error.message === "Token Expired") {
            res.status(StatusCode.Unauthorized).json({ message: "Access token expired" });
            return
         }
         res.status(StatusCode.Unauthorized).json({ message: "Unauthorized: Invalid Access token" });
         return
      }
   }
}