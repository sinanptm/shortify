export default interface ITokenService {
   createToken(email: string, id: string): string;
   verifyToken(token: string): { email: string; id: string };
}