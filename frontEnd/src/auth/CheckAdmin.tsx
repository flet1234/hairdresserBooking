import { useEffect, useState } from "react";
import axios from "axios";
import {useAuthContext} from '../App'
import LoginRegister from "../features/LoginRegister";
import {ProviderProps} from "../../types/consts";

const CheckAdmin = ({children}: ProviderProps) => {
    const [redirect,setRedirect]=useState(false)
    const {setAdmin} = useAuthContext()
    const email = localStorage.getItem('email')

    
    useEffect(() => {
        verify()
    },[])

    const verify = async() => {
        try {
            const response = await axios.post(import.meta.env.VITE_API_URL+'/api/users/verify/admin',{email})
            if(response.status === 200){
                setRedirect(true)
                setAdmin(true)
            } 
        } catch (error) {
            console.log('Not logged in');
            setRedirect(false)
        }
    }
    return children
}

export default CheckAdmin