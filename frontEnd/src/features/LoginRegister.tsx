import { useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {TextField} from '@mui/material'
import { useAuthContext } from '../App'
import { LoginRegisterProps } from "../../types/consts";
import './style.css'


const LoginRegister = ({page}:LoginRegisterProps) => {

    const [email,setEmail] = useState<string>()
    const [name, setName] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [message, setMessage] = useState<string>()

    const {setToken} = useAuthContext()

    const navigate = useNavigate()
    const loginRegister = async() => {
        if(page === 'login'){
            try {
                const responce = await axios.post(import.meta.env.VITE_API_URL+'/api/users/login', {email,password}, {withCredentials:true})
                
                if(responce.status === 200){
                    setMessage('')
                    setToken(responce.data)
                    localStorage.setItem('refreshToken', responce.data.refreshToken)
                    localStorage.setItem('email', responce.data.email)
                    localStorage.setItem('name', responce.data.name)
                    navigate('/')
                }
            } catch (error) {
                console.log(error);
                setToken(null)
                if(axios.isAxiosError(error)){
                    setMessage(error.response?.data.msg);
                }
                
            }
        }
        else{
            try {
                const response = await axios.post(import.meta.env.VITE_API_URL+'/api/users/register', {email, password , name}, {withCredentials:true})

                if(response.status === 200){
                    setMessage('')
                    console.log(response.data);
                    navigate('/login')  
                }
            } catch (error) {
                console.log(error);
                if(axios.isAxiosError(error)){
                    setMessage(error.response?.data.msg);
                }
                
            }
        }
    }

    return (
        <>
            <h2>{page === 'login' ? 'Login' : 'Register'}</h2>
            <form>
                <TextField sx={{m:1}} id='email' type="email" label='Enter your email' variant="outlined" onChange={(e)=>setEmail(e.target.value)} />
                <TextField sx={{m:1}} id='password' type="password" label='Enter your password' variant="outlined" onChange={(e)=>setPassword(e.target.value)} />
                {page === 'login' ? <></> : <TextField sx={{m:1}} id='name' type="name" label='Enter your name' variant="outlined" onChange={(e)=>setName(e.target.value)} />}
              <h5>Demo admin account: email admin@mail.com password 1234</h5>      
              <h5>Demo user account: email user@mail.com password 1234</h5>      
            </form>   
            <button onClick={loginRegister}>{page}</button>
            <div className="message">{message}</div>
           
        </>
    )
}

export default LoginRegister