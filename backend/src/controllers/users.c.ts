import { Request, Response } from "express";
import { UserResponse, ErrorMessageInterface, UserLogin, UserRegister, UserInfo } from '../../types/consts'
import { register, login, all} from "../models/users.m";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const _register = async (
    req: Request<UserRegister>,
    res: Response<UserResponse | ErrorMessageInterface>
) => {
    try {
        
        
        const {email,password,name}: UserRegister = req.body
        const lowerEmail = email.toLowerCase()

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password ,salt)
        
        const newUser = await register({
            email:lowerEmail,
            password:hashedPassword,
            name:name
        })
        
        res.json(newUser as UserResponse)
    } catch (error) {
        console.error("Error in controllers _register", error);
        res.status(400).json({msg:'Email already exist'} as ErrorMessageInterface)
    }
}

export const _login = async(
    req:Request<UserLogin>,
    res:Response<UserResponse | ErrorMessageInterface>
) => {
    try {
        const {email,password} : UserLogin = req.body
        const user = await login(email.toLowerCase())

        if(!user) {
            return res.status(404).json({msg: 'Email not found'} as ErrorMessageInterface)
        }
        
        const isMatch = bcrypt.compareSync(password,user.password);
        if(!isMatch){
            return res.status(404).json({msg:'Wrong password'} as ErrorMessageInterface)
        }

        const {id:userId,email:userEmail,name:user_name} = user
        
        const secret = process.env.ACCESS_TOKEN_SECRET || '19MynameisMaksim91'

        const accessToken:string = jwt.sign({userId, userEmail}, secret, {expiresIn: '1h'})
        const refreshToken = jwt.sign({userId, userEmail}, secret ,{expiresIn: '7d'})

        res.cookie('token', accessToken, {
            maxAge: 60*60*1000,
            httpOnly:true
        })

        res.cookie('refreshToken', refreshToken, {
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })
        
        res.json(<UserResponse>{
            refreshToken:refreshToken,
            token:accessToken,
            id:userId,
            email:userEmail,
            name:user_name,
        })
    } catch (error) {
        console.error('Error in controllers _login', error);
        res.status(500).json({msg:'Something went wrong'})
    }
}

export const _all = async(
    req:Request,
    res:Response<UserInfo[] | ErrorMessageInterface>
) => {
    try {
        const users = await all()
        res.json(users)
    } catch (error) {
        console.error('Error in controllers _all', error);
        res.status(500).json({msg:'Could not fetch users'} as ErrorMessageInterface)
    }
}