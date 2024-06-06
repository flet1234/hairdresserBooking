import { useEffect} from "react";
import axios from "axios";
import {useAuthContext} from '../App'

import {ProviderProps} from "../../types/consts";

const CheckAdmin = ({children}: ProviderProps) => {
    const {setAdmin} = useAuthContext()
    const email = localStorage.getItem('email')

    
    useEffect(() => {
        verify()
    },[])

    const verify = async() => {
        try {
            const response = await axios.post(import.meta.env.VITE_API_URL+'/api/users/verify/admin',{email})
            if(response.status === 200){
                setAdmin(true)
            } 
        } catch (error) {
            console.log('Not logged in');
        }
    }
    return children
}

export default CheckAdmin