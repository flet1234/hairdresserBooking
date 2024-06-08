import { Request,Response } from "express";
import { ErrorMessageInterface, DayType, HoursInterface, DayTypeWithID} from "../../types/consts";
import { getAllData, updateHour,saveDay, checkDay, saveHistory, getServices, getUserHistory} from "../models/service.m";
import dotenv from 'dotenv'
dotenv.config()

export const _updateHour = async(
    req:Request<DayType>,
    res:Response<HoursInterface|ErrorMessageInterface>
) => {
    try {
        const {date, work} = req.body.day
        const {time,available,notbooked,servicename,length,price,user_name} = req.body.hours
        const newHour = await updateHour(
            {date, work},{time,available,notbooked,servicename,length,price,user_name}
        )
        res.json(newHour as HoursInterface)
    } catch (error) {
        console.error('Error in service_controllers _updateHour');
        res.status(400).json({msg:'Something went wrong'} as ErrorMessageInterface)
        
    }
}

export const _getAllData = async(
    req:Request,
    res:Response
) => {
    try {
        const allData = await getAllData()
        res.json(allData)
    } catch (error) {
        console.error('Error in service_controllers _getAllData');
        res.status(400).json({msg:'Could not fetch data'} as ErrorMessageInterface)
    }
}

export const _saveDay = async(
    req:Request<DayType>,
    res:Response<DayType|ErrorMessageInterface>
) => {
    try {
        const {date, work ,hours} = req.body.dayData
        const newDay = await saveDay(
            {date, work},hours
        )
        res.json(newDay as DayType)
    } catch (error) {
        console.error('Error in service_controllers _saveDay');
        res.status(400).json({msg:'Something went wrong'} as ErrorMessageInterface)
        
    }
}

export const _CheckDay = async(
    req:Request,
    res:Response
) => {
    try {
        const {date} = req.body
        console.log(date);
        const result = await checkDay(date)
        console.log(result);
        
        res.json(result)
        
    } catch (error) {
        console.error('Error in service_controllers _CheckDay');
        res.status(400).json({msg:'Could not check day'} as ErrorMessageInterface)
    }
}

export const _saveHistory = async(
    req:Request,
    res:Response
) => {
    try {
        const historyObj = req.body
        const result = await saveHistory(historyObj)
        res.json(result)

    } catch (error) {
        console.error('Error in service_controllers _saveHistory');
        res.status(403).json({msg:'user not found'} as ErrorMessageInterface)
    }
}

export const _getServices = async(
    req:Request,
    res:Response
) => {
    try {
        const services = await getServices()
        
        res.json(services)
    } catch (error) {
        console.error('Error in service_controllers _getServices');
        res.status(400).json({msg:'cant get services'} as ErrorMessageInterface)
    }   
}

export const _getUserHistory = async(
    req:Request,
    res:Response
) => {
    try {
        const {email} = req.body
        const result = await getUserHistory(email)
        res.json(result)
    } catch (error) {
        console.error('Error in service_controllers _getUserHistory');
        res.status(400).json({msg:'cant get user history'} as ErrorMessageInterface)
    }
    

}