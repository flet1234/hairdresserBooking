import { useEffect} from "react";
import axios from "axios";
import {useAuthContext} from '../App'
import { toggleAdmin } from "../features/adminSlice";
import {ProviderProps} from "../../types/consts";
import { useAppDispatch, useAppSelector } from "../store/store";

const CheckAdmin = ({children}: ProviderProps) => {
    const {setAdmin} = useAuthContext()
    const email = localStorage.getItem('email')
    const isAdmin = useAppSelector((state)=>state.adminReducer.isAdmin)
    const dispatch = useAppDispatch()
    
    useEffect(() => {
        verify()
    },[])

    const verify = async() => {
        if(email){
            try {
            const response = await axios.post(import.meta.env.VITE_API_URL+'/api/users/verify/admin',{email})
            if(response.status === 200){
                dispatch(toggleAdmin(true))
            } else {
                dispatch(toggleAdmin(false))
            }
        } catch (error) {
            console.log('Not logged in');
        }
    }
        
    }
    return children
}

export default CheckAdmin