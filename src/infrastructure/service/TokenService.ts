import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import ITokenService from "@/domain/interface/services/ITokenService";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/config/env";
import { AuthenticationError, AuthorizationError } from "@/domain/entities/CustomErrors";

export default class TokenService implements ITokenService {
    private signToken(payload: object, secret: string, expiresIn: string): string {
        return jwt.sign(payload, secret, { expiresIn });
    }
    private verifyToken(token: string, secret: string): JwtPayload {
        try {
            return jwt.verify(token, secret) as JwtPayload;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new AuthenticationError("Token Expired");
            }
            throw new AuthorizationError("Invalid token");
        }
    }

    createRefreshToken(email: string, id: string): string {
        return this.signToken({ email, id }, REFRESH_TOKEN_SECRET, "7d");
    }

    verifyRefreshToken(token: string): { email: string; id: string; } {
        const decoded = this.verifyToken(token, REFRESH_TOKEN_SECRET);
        return { email: decoded.email, id: decoded.id };
    }

    createAccessToken(email: string, id: string): string {
        return this.signToken({ email, id }, ACCESS_TOKEN_SECRET, "15m");
    }

    verifyAccessToken(token: string): { email: string; id: string; } {
        const { email, id } = this.verifyToken(token, ACCESS_TOKEN_SECRET);
        return { email, id };
    }
}