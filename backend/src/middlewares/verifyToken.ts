import { Request, Response, NextFunction} from 'express'
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const verifyToken = (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const accessToken = req.cookies.token || req.headers['x-access-token']
    const refreshToken = req.cookies.refreshToken || req.headers['x-refresh-token']
    
    const secret = process.env.ACCESS_TOKEN_SECRET || '19MynameisMaksim91'

    if(!accessToken) {
        if(!refreshToken){
            
            return res.status(401).json({msg:'Unauthorized'})}
        
        jwt.verify(refreshToken,secret,(err: VerifyErrors | null, decoded: JwtPayload | string | undefined)=>{
            if(err){
                return res.status(403).json({error: err.message, msg: 'Forbidden'})
            }
            if(typeof decoded === 'object' && decoded){
                const userId = decoded.userId
                const userEmail = decoded.userEmail

                const newAccessToken:string = jwt.sign({userId, userEmail}, secret, {expiresIn: '1h'})
                const newRefreshToken:string = jwt.sign({userId, userEmail}, secret ,{expiresIn: '7d'})

                res.cookie('token', newAccessToken, {
                            maxAge: 60*60*1000,
                            httpOnly:true
                         })

                res.cookie('refreshToken', newRefreshToken, {
                    maxAge:7*24*60*60*1000,
                    httpOnly:true
                })  
                // req.user = decoded as JwtPayload
                next()
            } else {
                return res.status(403).json({msg:'Forbidden'})
            }
        })
    } else if (accessToken){
        jwt.verify(accessToken,secret,(err: VerifyErrors | null, decoded: JwtPayload | string | undefined)=>{
            if(err){
                return res.status(403).json({error: err.message, msg: 'Forbidden'})
            }
            else if(decoded){
                // req.user = decoded as JwtPayload
                    next()
            }
    }
    
)
}
}