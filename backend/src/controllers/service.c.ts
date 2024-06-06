import { Request,Response } from "express";
import { ErrorMessageInterface, DayType, HoursInterface, DayTypeWithID} from "../../types/consts";
import { getAllData, updateHour,saveDay, checkDay, updateDay} from "../models/service.m";
import dotenv from 'dotenv'
dotenv.config()

export const _updateHour = async(
    req:Request<DayType>,
    res:Response<HoursInterface|ErrorMessageInterface>
) => {
    try {
        const {date, work} = req.body.day
        const {time,available,notbooked,servicename,length,price} = req.body.hours
        const newHour = await updateHour(
            {date, work},{time,available,notbooked,servicename,length,price}
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

export const _updateDay = async(
    req:Request<DayTypeWithID>,
    res:Response<DayType|ErrorMessageInterface>
) => {
    try {
        const {date, work ,hours, id} = req.body.dayData
        console.log(hours);
        
        const newDay = await updateDay(
            {date, work, id , hours}
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