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
    admin:boolean
}

export type DayTypeWithID = {
    id:number
    date:string
    work:boolean
    hours:Hours[]
}

export interface Hours {
    time:string
    available:boolean
    notbooked:boolean
    servicename?:string
    length?:string
    price?:number
}

export type UserLogin = Pick<UserInterface, 'email' | 'password'>
export type UserLoginReturn = Pick<UserInterface, 'id' | 'email' | 'password'>
export type UserRegister = Pick<UserInterface, 'email' | 'password' | 'name'>
export type UserResponse = Pick<UserInterface, 'id' | 'email' | 'name' | 'token' | 'admin'>
export type UserInfo = Pick<UserInterface, 'id' | 'email' | 'name'>

export type UsersRecord = Record<string, UserInterface>

export interface ErrorMessageInterface {
    msg: string
}

export interface AuthContextInterface {
    token: UserResponse | null
    setToken: React.Dispatch<React.SetStateAction<UserResponse | null>>
    admin:boolean
    setAdmin: React.Dispatch<React.SetStateAction<boolean>>
}

export interface ProviderProps {
    children:ReactNode
}
export interface LoginRegisterProps {
    page:string
}

