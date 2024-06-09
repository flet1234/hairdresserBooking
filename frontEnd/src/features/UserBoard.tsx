import { useEffect,useState } from 'react';
import { getAllData, saveDay} from './adminSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import './dashboard.css'
import './style.css'
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { DayType } from './adminSlice';
import ServiceList from './ServiceList';
import { UserboardProps } from '../../types/consts';
import sciccors from '..//assets//scissors_11631186.png'


  const UserBoard = ({setDate,setTime,setServicename,setReserved}:UserboardProps) => {

    const [selectedDate,setSelectedDate] = useState<Date | null>(null)
    const [selectedHour,setSelectedHour] = useState<string | null>(null)
    const days = useAppSelector((state)=>state.adminReducer.days)
    const status = useAppSelector((state)=>state.adminReducer.status)
    const dispatch=useAppDispatch()

    useEffect(()=>{
      const getData = async()=>{
            dispatch(getAllData())
          }
      getData()   
    },[])

    useEffect(()=>{
      if(selectedDate){
        const [day]:DayType[] = days.filter(day => day.date === selectedDate?.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }))
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
    
    const dayFetchLoad = () => {
      switch (status) {
        case 'loading':
          return (
            <div className="scissors-animation">
              <img className="scissors" src={sciccors} alt="Scissors"/>
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
          onChange={(date:Date)=>{setSelectedDate(date); setSelectedHour(null)}}
          inline
          highlightDates={highlightWithRanges}
          includeDates={available_days}
          // selectTime
          />
      }
    }

    const filterDays = () => {
      return days.filter(day=> day.date === selectedDate?.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }))
    }

    return (
      <div className='date-picker-container'>
      {dayFetchLoad()}
        <ul>
            {filterDays()?.map((day,index)=>(
                <li key={index}>
                    {dayjs(day.date).format('DD/MM/YYYY')} - Hours: {day.hours.filter(hour=> hour.available).map(hour => {
                      return <button style={{display:'inline',marginLeft:'2px'}} key={hour.time} onClick={()=>setSelectedHour(hour.time)}>{hour.time}</button>})}
                </li>
               
            ))}
        </ul> 
        {!selectedHour ? '' : !selectedDate ? '' : <ServiceList setReserved={setReserved} setDate={setDate} setServicename={setServicename} setTime={setTime} time={selectedHour} date={selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}/>}
      </div>
    )
  }
  
 export default UserBoard