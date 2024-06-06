import { useEffect,useState } from 'react';
import { createWorkDay, toggleWorkHour, getAllData, saveDay} from './adminSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import { Button } from '@mui/material';
import './dashboard.css'
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { DayType } from './adminSlice';

  const AdminBoard = () => {

    const [selectedDate,setSelectedDate] = useState<Date | null>(null)
    const days = useAppSelector((state)=>state.adminReducer.days)
    const status = useAppSelector((state)=>state.adminReducer.status)
    const message = useAppSelector((state)=> state.adminReducer.message)
    const dispatch=useAppDispatch()

    useEffect(()=>{
      const getData = async()=>{
            dispatch(getAllData())
          }
      getData()   
    },[])
    
    useEffect(()=>{
      if(selectedDate){
        const [day]:DayType[] = days.filter(day => day.date === selectedDate?.toLocaleDateString())
        dispatch(saveDay(day))
      }
    },[days])

    const available_days = days.filter(day=> day.work === true).filter(day=> day.hours.some(hour=> hour.available === true)).map(day => dayjs(day.date).toDate())
    
    const booked_days = days.filter(day=> day.work === true).filter(day=> day.hours.every(hour=> !hour.available && !hour.notbooked)).map(day => dayjs(day.date).toDate())

    const full_day = days.filter(day=> day.work === true).filter(day=> day.hours.every(hour=> !hour.available && hour.notbooked)).map(day => dayjs(day.date).toDate())
    
    interface HighlighStyle {
      [key:string]:Date[]
    }
    
    const highlightWithRanges: HighlighStyle[] = [
      {
        "available_day" : available_days
        
      },
      {
        "booked_day": booked_days
      },
      {
        "full_day": full_day
      },
    ];

    const loadImage = () => {
      switch (message) {
        case 'uploading':
          
          return 'Loading'
        case 'rejected':
          
          return 'Error!'
    
        default:
          return 'All good'
      }
    }
    
    const dayFetchLoad = () => {
      switch (status) {
        case 'loading':
          
          return 'Loading'
        case 'rejected':
          
          return 'Error!'
    
        default:
          return <DatePicker 
          // custom day dla style
          placeholderText = 'Click to select a date'
          showIcon
          toggleCalendarOnIconClick
          dateFormat="dd/MM/yyyy"
          selected={selectedDate} 
          onChange={(date:Date)=>setSelectedDate(date)}
          inline
          highlightDates={highlightWithRanges}
          // excludeDates={[
          //   {date:new Date(),message:'Today is pidr'}
          // ]} dal usera or filter dates
          // selectTime
          />
      }
    }

    const handleCreateWorkDay = () => {
        if(selectedDate){
            const today = selectedDate.toLocaleDateString()
            dispatch(createWorkDay(today))
        }
    }

    const checkDay = () => {
      return days.some(day => day.date === selectedDate?.toLocaleDateString())
    }

    const filterDays = () => {
      return days.filter(day=> day.date === selectedDate?.toLocaleDateString())
    }

    return (
      <>
      {dayFetchLoad()}
      {!checkDay()? <Button onClick={handleCreateWorkDay}>Create work day for this date</Button> : 'Click on hour to change it from opened to closed'}
        <ul>
            {filterDays()?.map((day,index)=>(
                <li key={index}>
                    {dayjs(day.date).format('DD/MM/YYYY')} - Work: {day.work ? 'Yes' : 'No'} - Hours: {day.hours.map(hour => {
                      return <Button key={hour.time} onClick={()=>dispatch(toggleWorkHour({date:day.date, time: hour.time}))} color={hour.available ? 'success' : hour.notbooked ? 'error' : 'secondary' }>{hour.time}</Button>})}
                </li>
               
            ))}
        </ul> 
        {loadImage()}
      </>
    )
  }
  
 export default AdminBoard