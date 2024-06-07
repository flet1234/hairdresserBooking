import { useEffect,useState } from 'react';
import { getAllData, saveDay} from './adminSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import { Button } from '@mui/material';
import './dashboard.css'
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { DayType } from './adminSlice';
import ServiceList from './ServiceList';

  const UserBoard = () => {

    const [selectedDate,setSelectedDate] = useState<Date | null>(null)
    const [selectedHour,setSelectedHour] = useState<string | null>(null)
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
    
    interface HighlighStyle {
      [key:string]:Date[]
    }
    
    const highlightWithRanges: HighlighStyle[] = [
      {
        "available_days" : available_days
      }
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
          placeholderText = 'Click to select a date'
          showIcon
          toggleCalendarOnIconClick
          dateFormat="dd/MM/yyyy"
          selected={selectedDate} 
          onChange={(date:Date)=>{setSelectedDate(date); setSelectedHour(null)}}
          inline
          highlightDates={highlightWithRanges}
          includeDates={available_days}
          // selectTime
          />
      }
    }

    const filterDays = () => {
      return days.filter(day=> day.date === selectedDate?.toLocaleDateString())
    }

    return (
      <>
      {dayFetchLoad()}
        <ul>
            {filterDays()?.map((day,index)=>(
                <li key={index}>
                    {dayjs(day.date).format('DD/MM/YYYY')} - Hours: {day.hours.filter(hour=> hour.available).map(hour => {
                      return <Button key={hour.time} onClick={()=>setSelectedHour(hour.time)}>{hour.time}</Button>})}
                </li>
               
            ))}
        </ul> 
        {loadImage()} <br />
        {!selectedHour ? '' : !selectedDate ? '' : <ServiceList time={selectedHour} date={selectedDate.toLocaleDateString()}/>}
      </>
    )
  }
  
 export default UserBoard