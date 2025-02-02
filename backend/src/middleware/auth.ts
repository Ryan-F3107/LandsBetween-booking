import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
/* 
Add userId property to Request type in the Express name space
Extends Express Request types
*/
declare global{
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

const verifyToken = (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies["auth_token"];
    if(!token){
        return res.status(401).json({message: "unauthorized"});
    }
    //decode token
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) //verifies token we got was created by us
        req.userId = (decoded as JwtPayload).userId;    // we add custom property(userId) onto express Request
        next();
    } catch(e){
        return res.status(401).json({message: "unauthorized"});
    }
}

export default verifyToken;