import { useEffect,useState } from 'react';
import { createWorkDay, getAllData, saveDay, editHour} from './adminSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import './dashboard.css'
import './style.css'
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
          
          return  (
                  <div className="loading-animation">
                    <img className="loading" src="..\src\assets\loading_248958.png" alt="Load image"/>
                    <div className="objectload"></div>
                  </div>
                  )
        case 'rejected':
          
          return 'Error!'
    
        default:
          return (
            <div style={{height:'20px'}}></div>
            )
      }
    }
    
    const dayFetchLoad = () => {
      switch (status) {
        case 'loading':
          
          return (
            <div className="scissors-animation">
              <img className="scissors" src="..\src\assets\scissors_11631186.png" alt="Scissors"/>
              <h4>Loading...</h4>
              <div className="object"></div>
            </div>
            )
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
      <div className='admin-board-container'>
        {dayFetchLoad()}
        <br />
        {!checkDay()? 
        <>
          <button onClick={handleCreateWorkDay}>Create work day for this date</button> <br />
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
                  {loadImage()}
                    <ul> 
                    {day.hours.map((hour, i) => {
                      return (
                        <li key={i}>
                          {editMode === i ? (
                            <div className='edit-container'>
                              <h4>{hour.time}</h4>
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
                              <button onClick={()=>{
                               setEditMode(null); dispatch(editHour({
                                date:day.date, hour:{
                                  time:hour.time, available:hAvailable,notbooked:hNotbooked,price:hPrice,servicename:hServicename,
                                  user_name:hUser_name,length:hLength
                                  }
                                }))}}>Save Changes</button><button onClick={()=>setEditMode(null)}>Cancel</button>
                            </div>
                          ) : (
                            <>
                              <h4>{hour.time}:</h4>{hour.available ? 'Available' : 'Not available'} | {hour.notbooked ? 'Not booked' : 'Booked'} | Length:  {hour.length} | Price: {hour.price} | Service: {hour.servicename} | Username: {hour.user_name}<button onClick={()=>{
                                sethAvailable(hour.available)
                                sethNotbooked(hour.notbooked)
                                sethPrice(hour.price)
                                sethLenght(hour.length)
                                sethServicename(hour.servicename)
                                sethUser_name(hour.user_name)
                                setEditMode(i)
                              }
                              }>Edit</button>
                            </>
                          )}
                        </li>
                      );
                      })}
                    </ul>
                </div>
            ))}
        </ul> 
      </div>
    )
  }
  
 export default AdminBoard