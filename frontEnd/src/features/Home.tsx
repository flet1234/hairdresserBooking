import { useState, useEffect} from "react";
import axios from "axios";
import { useAuthContext } from "../App";
import { UserHistoryInterface, UserInfo } from "../../types/consts";
import { Button } from "@mui/material";
import dayjs from "dayjs";


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
            <Button onClick={()=>getUserHistory()}>Show my history</Button>
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
            <h3>Users:</h3>
            {users.map((user:UserInfo)=>{
                return <div key={user.id}>{user.id} {user.name} {user.email}</div>
            })}
        </>
    )
}

export default Home