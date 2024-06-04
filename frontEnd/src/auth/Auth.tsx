import { useEffect, useState } from "react";
import axios from "axios";
import {useAuthContext} from '../App'
import LoginRegister from "../features/LoginRegister";
import {ProviderProps} from "../../types/consts";



const Auth = ({children}: ProviderProps) => {

    const {token} = useAuthContext()
    const [redirect, setRedirect] = useState(false)
    const refreshToken = localStorage.getItem('refreshToken')

    useEffect(() => {
        verify()
    },[])

    const verify = async() => {
        // https://hairdresserbooking.onrender.com/api/users/verify
        try {
            const response = await axios.get('http://localhost:3001/api/users/verify', {headers: {
                'x-access-token': token?.token,
                'x-refresh-token': refreshToken
            }, withCredentials:true})
            if(response.status === 200) setRedirect(true)
            
        } catch (error) {
            console.log('Not logged in');
            setRedirect(false)
        }
    }

    return redirect ? children : <LoginRegister page={'login'}/>
}

export default Auth