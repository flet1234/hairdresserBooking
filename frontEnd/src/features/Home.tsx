import { useState, useEffect} from "react";
import axios from "axios";
import { useAuthContext } from "../App";
import { UserInfo } from "../../types/consts";


const Home = () => {
    const [users,setUsers] = useState([])

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

    return (
        <>
            <h2>Home</h2>
            {users.map((user:UserInfo)=>{
                return <div key={user.id}>{user.id} {user.name} {user.email}</div>
            })}
        </>
    )
}

export default Home