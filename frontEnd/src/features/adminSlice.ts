import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Hours } from "../../types/consts";

export type DayType = {
    date:string,
    work:boolean
    hours:Hours[]
}

interface State {
    days:DayType[],
    status:string,
    message:string,
    isAdmin:boolean
}

const initialState:State = {
    days:[],
    status:'',
    message:'',
    isAdmin:false
}

const generateHours = (start:number,end:number): Hours[] => {
    const hours: Hours[] = []
    for (let i=start;i<end;i++){
        hours.push({
            time:`${i<10 ? '0' : ''}${i}:00`,
            available:true,
            notbooked:true
        })
    }
    return hours
}

export const transfromServiceLenghtTotNumber = (length:string):number =>{
    return parseInt(length.split(':')[0],10)
}

export const getAllData = createAsyncThunk('days/getAllData', async() => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/service/data`)
        return res.data
    } catch (error) {
        console.error(error);
        
    }
})

export const addTime = (time:string,num:number):string => {
    let [hours,minutes] = time.split(':').map(Number)
    hours+=num

    if(hours >= 24){
        hours = hours - 24
    }

    const newHours = String(hours).padStart(2,'0')
    const newMinutes = String(minutes).padStart(2,'0')

    return `${newHours}:${newMinutes}`
}

export const saveDay = createAsyncThunk('days/saveDay', async(dayData:DayType,) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/service/saveday`, {dayData})
        console.log(res.data);
    } catch (error) {
        console.error(error);
    }
})

const adminSlice = createSlice({
    name:'days',
    initialState,
    reducers:{
        createWorkDay: (state,action:PayloadAction<{date:string,start:number,end:number}>)=>{
            const selectedDate = action.payload.date
            const existingDay = state.days.find(day => day.date === selectedDate)
            if(!existingDay){
                state.days.push({
                    date:selectedDate,
                    work:true,
                    hours:generateHours(action.payload.start, action.payload.end)
                })
                }
            },
        editHour: (state, action: PayloadAction<{date:string,hour:Hours}>)=>{
            const {date}=action.payload
            const {time,available,notbooked,price,user_name,servicename,length}=action.payload.hour
            const day = state.days.find(day => day.date === date)
            if (day) {
                const hour = day.hours.find(hour => hour.time === time)
                if(hour) {
                    hour.available = available
                    hour.notbooked = notbooked
                    hour.price = price
                    hour.servicename = servicename
                    hour.user_name = user_name
                    hour.length = length
                }
            }
        },
        bookHour: (state, action: PayloadAction<{ date:string, hour:Hours}>)=>{
            const {date} = action.payload
            const {time,length,price,servicename,user_name} = action.payload.hour
            const day = state.days.find(day => day.date === date)
            if (day) {
                if(length){
                        const serviceLenght = transfromServiceLenghtTotNumber(length)
                        for(let i=0;i<serviceLenght;i++){
                            const hour = day.hours.find(hour => hour.time === addTime(time,i))
                            if(hour) {
                                hour.available = !hour.available
                                hour.notbooked = !hour.notbooked
                                hour.length = length
                                hour.price = price
                                hour.servicename = servicename
                                hour.user_name = user_name
                            }
                        }
                    }
                
            }
        },
        toggleAdmin: (state,action:PayloadAction<boolean>) => {
            state.isAdmin = action.payload
        }
        },
        extraReducers(builder){
            builder
            .addCase(getAllData.fulfilled, (state,action) => {
                state.days = action.payload
                state.status = 'fullfiled'
            })
            .addCase(getAllData.rejected, (state) => {
                state.status = 'rejected'
            })
            .addCase(getAllData.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(saveDay.fulfilled, (state) => {
                state.message = 'accepted'
            })
            .addCase(saveDay.rejected, (state) => {
                state.message = 'denied'
            })
            .addCase(saveDay.pending, (state) => {
                state.message= 'uploading'
            })
        }
    }
)

export const {createWorkDay, editHour, toggleAdmin, bookHour} = adminSlice.actions
export default adminSlice.reducer
