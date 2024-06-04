import { useEffect,useState, useRef } from 'react';
import { createWorkDay, toggleWorkHour} from './adminSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import dayjs, { Dayjs } from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { Button } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import './dashboard.css'

  
  const initialValue = dayjs();
  
  function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  
    const isSelected =
      !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;
  
    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={isSelected ? 'W' : undefined}
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day}/>
      </Badge>
    );
  }
  
  export default function DateCalendarServerRequest() {
    const requestAbortController = useRef<AbortController | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedDays, setHighlightedDays] = useState<number[]>([]);
    const [selectedDate,setSelectedDate] = useState<Dayjs | null>(dayjs())
    const days = useAppSelector((state)=>state.adminReducer)
    const dispatch=useAppDispatch()
    const [showOption, setShowOption] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
      setShowOption(event.target.value);
    };
  
    const fetchHighlightedDays = (date: Dayjs) => {
      const workdays = days.filter(day=>dayjs(day.date).month()===date.month()).map(day => dayjs(day.date).date())
      setHighlightedDays(workdays)
      setIsLoading(false)
    }

    useEffect(() => {
        fetchHighlightedDays(initialValue)
        return () => requestAbortController.current?.abort();
    }, [days]);
  
    const handleMonthChange = (date: Dayjs) => {
      if (requestAbortController.current) {
        requestAbortController.current.abort();
      }
  
      setIsLoading(true);
      setHighlightedDays([]);
      fetchHighlightedDays(date);
    };

    const handleCreateWorkDay = () => {
        if(selectedDate){
            const today = selectedDate.format('YYYY-MM-DD')
            dispatch(createWorkDay(today))
        }
    }

    const filterDays = () => {
        if(showOption === 'one'){
            return days.filter(day=> dayjs(day.date).format('DD/MM/YYYY') === selectedDate?.format('DD/MM/YYYY'))
        } else if (showOption === 'all'){
            return days.filter(day => day.work === true)
        }
        return []
        
    }
    return (
        <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          
          defaultValue={initialValue}
          loading={isLoading}
          onMonthChange={handleMonthChange}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              highlightedDays,
            } as any,
          }}
          onChange={(newDate) => setSelectedDate(newDate)}
        />
        <Button onClick={handleCreateWorkDay}>Create work day for this date</Button>
        <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Option</InputLabel>
        <Select
          value={showOption}
          onChange={handleChange}
          label="Show">
          <MenuItem value={'one'}>One</MenuItem>
          <MenuItem value={'all'}>All</MenuItem>
        </Select>
      </FormControl>
    </div>
        <ul>
            {filterDays()?.map((day,index)=>(
                <li key={index}>
                    {dayjs(day.date).format('DD/MM/YYYY')} - Work: {day.work ? 'Yes' : 'No'} - Hours: {day.hours.map(hour => {
                      return <Button key={hour.time} onClick={()=>dispatch(toggleWorkHour({date:day.date, time: hour.time}))} color={hour.avaliable ? 'success' : hour.NotBooked ? 'error' : 'secondary' }>{hour.time}</Button>})}
                </li>
            ))}
        </ul>
      </LocalizationProvider>
    </> 
    )
  }