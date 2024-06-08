import { Button } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { ServiceHistory, ServiceInterface, ServiceListProps } from "../../types/consts"
import { useAppDispatch, useAppSelector } from "../store/store"
import { bookHour, transfromServiceLenghtTotNumber,addTime } from "./adminSlice"



const ServiceList = ({date,time, setTime ,setDate,setServicename,setReserved}:ServiceListProps) =>{
    const [services, setServices] = useState<ServiceInterface[]|null>(null)
    const dispatch = useAppDispatch()
    const name = localStorage.getItem('name')
    const email = localStorage.getItem('email')
    const days = useAppSelector((state)=>state.adminReducer.days)
    let user_email:string
    if(email){
        user_email=email
    }
    let user_name:string
    if(name){
        user_name=name
    }
    
    const dateTime = date+' '+time
    
    useEffect(()=>{
        const services = async() => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/service/services`)
            setServices(res.data)
        }
        services()
    },[])

    const applyService = async({user_email,date,servicename,comment}:ServiceHistory) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/service/history/save`,{user_email,date,servicename,comment})
        setReserved(true)
        return res.data
    }

    const checkIfTimeIsEnough = (date:string, startTime:string, serviceLenght:string) => {
        const [day] = days.filter(day => day.date === date)
        const range = transfromServiceLenghtTotNumber(serviceLenght)
        let count = 0
        for(let i=0;i<range;i++){
            let index = day.hours.findIndex(hour=> hour.time === addTime(startTime,i))
            if(day.hours[index] && day.hours[index].available){
                count ++
            } else {
                return false
            }
        }
        return true
    }

    return (
        <>
            {services?.map(service => {
                return (
                    <ul key={service.servicename}>
                        <li>Name of service: {service.servicename}</li>
                        <li>Time: {service.length}</li>
                        <li>Price: {service.price}</li>
                        {service.comment ? <li>{service.comment}</li> : ''}
                        <li>{checkIfTimeIsEnough(date,time,service.length) ? <Button onClick={()=>{
                            dispatch(bookHour({date,hour:{time,servicename:service.servicename,length:service.length,price:service.price,user_name,notbooked:false, available:false}}))
                            applyService({user_email,date:dateTime,servicename:service.servicename,comment:service.comment})
                            setDate(date)
                            setTime(time)
                            setServicename(service.servicename)
                        }}
                            >Apply</Button> : 'Not enough time!'}</li>
                    </ul>
                )
            })}
        </>
    )
}

export default ServiceList