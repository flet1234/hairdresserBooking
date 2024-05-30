import { useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {Box ,TextField, Button} from '@mui/material'
import { useAuthContext } from '../App'
import { LoginRegisterProps } from "../../types/consts";

const LoginRegister = ({page}:LoginRegisterProps) => {

    const [email,setEmail] = useState<string>()
    const [name, setName] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [message, setMessage] = useState<string>()

    const {setToken} = useAuthContext()

    const navigate = useNavigate()
    const loginRegister = async() => {
        // 'http://localhost:3001/api/users/login'
        if(page === 'login'){
            try {
                const responce = await axios.post('https://hairdresserbooking.onrender.com/api/users/login', {email,password}, {withCredentials:true})
                console.log(responce);
                
                if(responce.status === 200){
                    setMessage('')
                    setToken(responce.data)
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
            // 'http://localhost:3001/api/users/register'
            try {
                const response = await axios.post('https://hairdresserbooking.onrender.com/api/users/register', {email, password , name}, {withCredentials:true})

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
            <h2>{page}</h2>
            <Box component={'form'} sx={{m:1}} noValidate autoComplete='off'>
                <TextField sx={{m:1}} id='email' type="email" label='Enter your email' variant="outlined" onChange={(e)=>setEmail(e.target.value)} />
                <TextField sx={{m:1}} id='password' type="password" label='Enter your password' variant="outlined" onChange={(e)=>setPassword(e.target.value)} />
                {page === 'login' ? <></> : <TextField sx={{m:1}} id='name' type="name" label='Enter your name' variant="outlined" onChange={(e)=>setName(e.target.value)} />}
            </Box>   
            <Button variant="contained" onClick={loginRegister}>{page}</Button>
            <div>{message}</div>
        </>
    )
}

export default LoginRegister