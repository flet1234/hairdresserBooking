import { Request, Response, NextFunction} from 'express'
import { checkAdmin } from '../models/users.m'


export const verifyRights = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const {email} = req.body
        const admin = await checkAdmin(email)
        
        switch (admin) {
            case true:
                return next()
            default:
                res.status(401).json({msg:'Unauthorized'})
        }
    } catch (error) {
        console.error('Error in controllers verify Rights', error);
        res.status(500).json({msg:'Could not check rights'})
    }
}