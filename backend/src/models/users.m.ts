import { db } from "../config/db";
import { UserRegister, UserInfo, UserLoginReturn } from '../../types/consts'


// Registr new user db
export const register = async({email,password, name}: UserRegister): Promise<UserInfo | null> => {
    try {
        
        const newUser = await db.transaction(async trx =>  {
            const [user] = await trx('users').insert({name,email}).returning('id')
         
            await trx('passwords').insert({user_id:user.id,hashed_password:password})

            return {id:user.id, email, name}
        })
        return newUser
    } catch (error) {
        console.error('Error at  models registration new user', error);
        throw new Error('Registration failed')   
    }
}

//Login db
export const login = async(email: string):Promise<UserLoginReturn | null> => {
    try {
        const isUser = await db.transaction(async trx => {
            const user = await trx('users').select('id','email','admin').where({email}).first()            

            const userPassword = await trx('passwords').select('hashed_password').where({user_id:user.id}).first()
            
            const selecteUser = {...user, password:userPassword.hashed_password}

            return selecteUser
        })
        return isUser
    } catch (error) {
        console.error('Error at models login', error);
        throw new Error('Login failed')
    }
}

//Get all users db
export const all = async():Promise<UserInfo[]> => {
    try {
        const users = await db('users').select('id','email','name').orderBy('name')
        return  users
    } catch (error) {
        console.error('Error models get all users', error);
        throw new Error('Could not get all users')
    }
}
