
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

export type UserLogin = Pick<UserInterface, 'email' | 'password'>
export type UserLoginReturn = Pick<UserInterface, 'id' | 'email' | 'password' | 'admin'>
export type UserRegister = Pick<UserInterface, 'email' | 'password' | 'name'>
export type UserResponse = Pick<UserInterface, 'id' | 'email' | 'name' | 'token'>
export type UserInfo = Pick<UserInterface, 'id' | 'email' | 'name'>

export type UsersRecord = Record<string, UserInterface>

export interface ErrorMessageInterface {
    msg: string
}

export interface HoursInterface {
    time:string
    available:boolean
    notbooked:boolean
    servicename?:string
    length?:string
    price?:number
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


export type DayType = {
    date:string,
    work:boolean
}