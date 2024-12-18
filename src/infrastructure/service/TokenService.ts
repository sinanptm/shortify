import jwt, {  TokenExpiredError } from "jsonwebtoken";
import ITokenService from "@/domain/interface/services/ITokenService";
import { TOKEN_SECRET } from "@/config/env";
import { AuthenticationError, AuthorizationError } from "@/domain/entities/CustomErrors";

export default class TokenService implements ITokenService {
    createToken(email: string, id: string): string {
        return jwt.sign({ email, id }, TOKEN_SECRET, { expiresIn:"30d" });
    }

    verifyToken(token: string): { email: string; id: string; } {
        try {
            return jwt.verify(token, TOKEN_SECRET) as { email: string, id: string; };
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new AuthenticationError("Token Expired");
            }
            throw new AuthorizationError("Invalid token");
        }
    }
}