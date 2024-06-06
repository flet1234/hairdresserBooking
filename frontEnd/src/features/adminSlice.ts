import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Hours {
    time:string
    available:boolean
    notbooked:boolean
    serviceName?:string
    length?:string
    price?:number
}

export type DayType = {
    date:string,
    work:boolean
    hours:Hours[]
}

interface State {
    days:DayType[],
    status:string,
    message:string
}

const initialState:State = {
    days:[],
    status:'',
    message:''
}

const generateHours = (): Hours[] => {
    const hours: Hours[] = []
    for (let i=8;i<22;i++){
        hours.push({
            time:`${i<10 ? '0' : ''}${i}:00`,
            available:true,
            notbooked:true
        })
    }
    return hours
}

export const getAllData = createAsyncThunk('days/getAllData', async() => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/service/data`)
        return res.data
    } catch (error) {
        console.error(error);
        
    }
})

// export const saveDay = createAsyncThunk('days/saveDay', async(dayData:DayType,) => {
//     try {
//         const date = dayData.date
//         const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/service/data`,{date})
//         console.log(res.data);
//         if(res.data.length > 0){
//             const id=res.data[0].id
//             const dayDataWithId = {...dayData, id}
//             console.log(dayDataWithId); 
//             const res2 = await axios.put(`${import.meta.env.VITE_API_URL}/api/service/saveday`, {dayData})
//             console.log(res2.data);
//         } else {
//             const res3 = await axios.post(`${import.meta.env.VITE_API_URL}/api/service/saveday`, {dayData})
//             console.log(res3.data);
//         }
        
//     } catch (error) {
//         console.error(error);
//     }
// })

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
        createWorkDay: (state,action:PayloadAction<string>)=>{
            const selectedDate = action.payload
            const existingDay = state.days.find(day => day.date === selectedDate)
            if(!existingDay){
                state.days.push({
                    date:selectedDate,
                    work:true,
                    hours:generateHours()
                })
                }
            },
        toggleWorkHour: (state, action: PayloadAction<{ date: string; time: string}>)=>{
            const {date,time}=action.payload
            const day = state.days.find(day => day.date === date)
            if (day) {
                const hour = day.hours.find(hour => hour.time === time)
                if(hour) {
                    hour.available = !hour.available
                }
            }
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

export const {createWorkDay, toggleWorkHour} = adminSlice.actions
export default adminSlice.reducer
