import { Request, Response, NextFunction} from 'express'
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { error } from 'console'
dotenv.config()

export const verifyToken = (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const accessToken = req.cookies.token || req.headers['x-access-token']
    console.log('accessToken',accessToken);
    
    if(!accessToken) {
        return res.status(401).json({msg:'Unauthorized'})
    }

    const secret = process.env.ACCESS_TOKEN_SECRET || '19MynameisMaksim91'

    jwt.verify(accessToken,secret,(err: VerifyErrors | null, decoded: JwtPayload | string | undefined)=>{
        if(err){
            return res.status(403).json({error: err.message, msg: 'Frobidden'})
        }
        if(decoded){
            req.user = decoded
        }
        next()
    })
}