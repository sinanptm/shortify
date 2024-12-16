import { Router } from 'express';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import TokenService from '@/infrastructure/service/TokenService';

const route = Router();

const tokenService = new TokenService()
const authMiddleware = new AuthMiddleware(tokenService);

route.use(authMiddleware.exec.bind(authMiddleware));

route.post("/shorten",(req,res)=>{
    res.send("success")
})


export default route;