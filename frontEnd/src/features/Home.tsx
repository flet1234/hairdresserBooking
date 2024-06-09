import { useState, useEffect} from "react";
import axios from "axios";
import { useAuthContext } from "../App";
import { UserHistoryInterface, UserInfo } from "../../types/consts";
import dayjs from "dayjs";
import './style.css'


const Home = () => {
    const [users,setUsers] = useState([])
    const [userHistory,setUserHistory] = useState<UserHistoryInterface[]>([])
    const email = localStorage.getItem('email')
    const name = localStorage.getItem('name')
    const {token} = useAuthContext()

    useEffect(()=>{
        getUsers()
    },[])

    const getUsers = async () => {
        try {
            const responce = await axios.get(import.meta.env.VITE_API_URL+'/api/users',{
                headers: {
                    'x-access-token': token?.token
                },
                withCredentials: true
            })
            setUsers(responce.data)
        } catch (error) {
            if(axios.isAxiosError(error)){
                console.log(error.response?.data.message);
            }
           
        }
    }

    const getUserHistory = async () => {
        try {
            const responce = await axios.post(import.meta.env.VITE_API_URL+'/api/service/history',{email})
            setUserHistory(responce.data)
        } catch (error) {
            if(axios.isAxiosError(error)){
                console.log(error.response?.data.message);
            }
           
        }
    }

    return (
        <>
            <h2>Home</h2>
            <h2>Welcome {name}</h2>
            <button onClick={()=>getUserHistory()}>Show my history</button>
            <div className="user-history">
                {userHistory.map((item,i)=>{
                    return (
                        <div key={i}>
                            <h5>{dayjs(item.date).format('DD/MM/YYYY')}</h5>
                            <ul>
                                <li> Service: {item.servicename}</li>
                                <li> Comment: {item.comment}</li>
                            </ul>
                        
                            
                        </div>
                    )
                })}
            </div>
            <h3>Users:</h3>
            <div className="users">
                {users.map((user:UserInfo)=>{
                    return <div key={user.id} className="user">
                                <span>{user.id}</span>
                                <span>{user.name}</span>
                                <span>{user.email}</span>
                            </div>
                })}
            </div>
        </>
    )
}

export default Home