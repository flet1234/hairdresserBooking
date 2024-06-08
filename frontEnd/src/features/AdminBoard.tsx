import { useEffect,useState } from 'react';
import { createWorkDay, getAllData, saveDay, editHour} from './adminSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import { Button } from '@mui/material';
import './dashboard.css'
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { DayType } from './adminSlice';


  const AdminBoard = () => {

    const [selectedDate,setSelectedDate] = useState<Date | null>(null)
    const [startHour,setStartHour] = useState<number | null>(null)
    const [endHour,setEndHour] = useState<number | null>(null)
    const [editMode, setEditMode] = useState<number | null>(null)
    const [hAvailable, sethAvailable] = useState<boolean>(false)
    const [hNotbooked, sethNotbooked] = useState<boolean>(false)
    const [hPrice, sethPrice] = useState<number | undefined>()
    const [hServicename, sethServicename] = useState<string | undefined>()
    const [hUser_name, sethUser_name] = useState<string | undefined>()
    const [hLength, sethLenght] = useState<string | undefined>()
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
      setEditMode(null)
    },[selectedDate])

    useEffect(()=>{
      if(selectedDate){
        const [day]:DayType[] = days.filter(day => day.date === selectedDate?.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }))
        dispatch(saveDay(day))
      }
    },[days])

    const available_days = days.filter(day=> day.work === true).filter(day=> day.hours.some(hour=> hour.available === true)).map(day => dayjs(day.date).toDate())
    
    const booked_days = days.filter(day=> day.work === true).filter(day=> day.hours.every(hour=> !hour.available)).filter(day => day.hours.some(hour=>!hour.notbooked)).map(day => dayjs(day.date).toDate())

    const full_days = days.filter(day=> day.work === true).filter(day=> day.hours.every(hour=> !hour.available && hour.notbooked)).map(day => dayjs(day.date).toDate())
    
    interface HighlighStyle {
      [key:string]:Date[]
    }
    
    const highlightWithRanges: HighlighStyle[] = [
      {
        "available_days" : available_days
      },
      {
        "booked_days": booked_days
      },
      {
        "full_days": full_days
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
          placeholderText = 'Click to select a date'
          showIcon
          toggleCalendarOnIconClick
          dateFormat="dd/MM/yyyy"
          selected={selectedDate} 
          onChange={(date:Date)=>setSelectedDate(date)}
          inline
          highlightDates={highlightWithRanges}
          />
      }
    }

    const handleCreateWorkDay = () => {
        if(selectedDate){
            const today = selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
            if(startHour && endHour){
              dispatch(createWorkDay({date:today,start:startHour,end:endHour}))
            } 
        }
    }

    const checkDay = () => {
      return days.some(day => day.date === selectedDate?.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }))
    }

    const filterDays = () => {
      return days.filter(day=> day.date === selectedDate?.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }))
    }

    return (
      <>
      {dayFetchLoad()}
      <br />
      {!checkDay()? <>
      <Button onClick={handleCreateWorkDay}>Create work day for this date</Button> <br />
        <label>Start hour: </label>
        <input
          type='number'
          onChange={(e) => setStartHour(Number(e.target.value))}
          max={23}
          min={0}
        />
        <label>End hour: </label>
        <input
          type='number'
          max={23}
          min={0}
          onChange={(e) => setEndHour(Number(e.target.value))}
        />
      </>
  : ''}
        <ul>
            {filterDays()?.map((day,index)=>(
                <div key={index}>
                  <h4>{dayjs(day.date).format('DD/MM/YYYY')}</h4>
                    <ul> 
                    {day.hours.map((hour, i) => {
                      return (
                        <li key={i}>
                          {editMode === i ? (
                            <>
                              {hour.time} 
                              Available: {hour.available ? 
                              <input type='checkbox' defaultChecked onChange={(e)=>sethAvailable(e.target.checked)}/> : 
                              <input type='checkbox' onChange={(e)=>sethAvailable(e.target.checked)}/>}
                              Not Booked: {hour.notbooked ?  
                              <input type='checkbox' defaultChecked onChange={(e)=>sethNotbooked(e.target.checked)}/> :  
                              <input type='checkbox' onChange={(e)=>sethNotbooked(e.target.checked)}/>}
                              Username:<input defaultValue={hour.user_name} type='text' onChange={(e)=>sethUser_name(e.target.value)}/>
                              Servicename:<input defaultValue={hour.servicename} type='text' onChange={(e)=>sethServicename(e.target.value)}/>
                              Length(hours):<input defaultValue={hour.length} type='number' onChange={(e)=>sethLenght(()=>{return `${e.target.value}:00:00`})}/>
                              Price:<input defaultValue={hour.price} type='number' onChange={(e)=>sethPrice(Number(e.target.value))}/>
                              <Button onClick={()=>{
                               setEditMode(null); dispatch(editHour({
                                date:day.date, hour:{
                                  time:hour.time, available:hAvailable,notbooked:hNotbooked,price:hPrice,servicename:hServicename,
                                  user_name:hUser_name,length:hLength
                                  }
                                }))}}>Save Changes</Button><Button onClick={()=>setEditMode(null)}>Cancel</Button>
                            </>
                          ) : (
                            <>
                              {hour.time}: {hour.available ? 'Available' : 'Not available'} | {hour.notbooked ? 'Not booked' : 'Booked'} | Length:  {hour.length} | Price: {hour.price} | Service: {hour.servicename} | Username: {hour.user_name}<Button onClick={()=>{
                                sethAvailable(hour.available)
                                sethNotbooked(hour.notbooked)
                                sethPrice(hour.price)
                                sethLenght(hour.length)
                                sethServicename(hour.servicename)
                                sethUser_name(hour.user_name)
                                setEditMode(i)
                              }
                              }>Edit</Button>
                            </>
                          )}
                        </li>
                      );
                      })}
                    </ul>
                </div>
            ))}
        </ul> 
        {loadImage()}
      </>
    )
  }
  
 export default AdminBoard