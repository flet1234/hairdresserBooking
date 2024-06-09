import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import UserBoard from "./UserBoard"
import './style.css'


const Success = () => {
    const [reserved, setReserved] = useState<boolean>(false)
    const [servicename, setServicename] = useState<string | null>(null)
    const [date, setDate] = useState<string | null>(null)
    const [time, setTime] = useState<string | null>(null)
    const [timer, setTimer] = useState(4)
    const navigate = useNavigate()

    useEffect(() => {
        if (reserved) {
          const interval = setInterval(() => {
            setTimer((state) => {
              if (state > 1) {
                return state - 1;
              } else {
                clearInterval(interval);
                return state;
              }
            });
          }, 1000);
    
          const timeout = setTimeout(() => {
            navigate('/');
          }, 4000);
    
          return () => {
            clearInterval(interval);
            clearTimeout(timeout);
          };
        }
      }, [reserved]);

    const showSuccess = () => {
        return (
                <div className="userboard-container">
                    <h1>Reserved:</h1>
                    <h3>Date:{dayjs(date).format('DD/MM/YYYY')} in {time}</h3>
                    <h4>Service:{servicename}</h4>
                    <p>You will be redirected in {timer} seconds</p>
                </div>
        )
    }

    return (
        <div className="userboard-container">
            {!reserved ? <UserBoard setDate={setDate} setServicename={setServicename} setTime={setTime} setReserved={setReserved}/> :
            showSuccess()}
        </div>
    )
}

export default Success