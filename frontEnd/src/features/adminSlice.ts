import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

interface Hours {
    time:string
    avaliable:boolean
    NotBooked:boolean
    serviceName?:string
    length?:string
    price?:number
}

type DayType = {
    date:string,
    work:boolean
    hours:Hours[]
}

const initialState:DayType[]=[]

const generateHours = (): Hours[] => {
    const hours: Hours[] = []
    for (let i=8;i<22;i++){
        hours.push({
            time:`${i<10 ? '0' : ''}${i}:00`,
            avaliable:true,
            NotBooked:true
        })
    }
    return hours
}

const adminSlice = createSlice({
    name:'days',
    initialState,
    reducers:{
        createWorkDay: (state,action:PayloadAction<string>)=>{
            const selectedDate = dayjs(action.payload).format('YYYY-MM-DD')
            const existingDay = state.find(day => day.date === selectedDate)
            if(!existingDay){
                state.push({
                    date:selectedDate,
                    work:true,
                    hours:generateHours()
                })
                }
            },
        toggleWorkHour: (state, action: PayloadAction<{ date: string; time: string}>)=>{
            const {date,time}=action.payload
            const day = state.find(day => day.date === date)
            if (day) {
                const hour = day.hours.find(hour => hour.time === time)
                if(hour) {
                    hour.avaliable = !hour.avaliable
                }
            }
        }
        }
    }
)

export const {createWorkDay, toggleWorkHour} = adminSlice.actions
export default adminSlice.reducer
