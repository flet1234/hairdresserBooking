import React, {ReactNode} from 'react'

export interface ConnectionInterface {
    host:string,
    user:string,
    password:string,
    database:string
}

export type UserInterface = {
    id:number
    email:string
    password:string
    name:string
    token:string
}

export type UserLogin = Pick<UserInterface, 'email' | 'password'>
export type UserLoginReturn = Pick<UserInterface, 'id' | 'email' | 'password'>
export type UserRegister = Pick<UserInterface, 'email' | 'password' | 'name'>
export type UserResponse = Pick<UserInterface, 'id' | 'email' | 'name' | 'token'>
export type UserInfo = Pick<UserInterface, 'id' | 'email' | 'name'>

export type UsersRecord = Record<string, UserInterface>

export interface ErrorMessageInterface {
    msg: string
}

export interface AuthContextInterface {
    token: UserResponse | null
    setToken: React.Dispatch<React.SetStateAction<UserResponse | null>>
}

export interface ProviderProps {
    children:ReactNode
}
export interface LoginRegisterProps {
    page:string
}