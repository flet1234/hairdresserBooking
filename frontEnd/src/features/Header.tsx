import { Link, useNavigate } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/store";
import { toggleAdmin } from "./adminSlice";
import axios from "axios";
import { useAuthContext } from "../App";


const Header = () => {
    const isAdmin = useAppSelector((state)=>state.adminReducer.isAdmin)
    const dispatch = useAppDispatch()
    const {setToken} = useAuthContext()
    const email = localStorage.getItem('email')
    

    const check = () => {
        if(isAdmin){
            return <Button><Link to='/admindashboard'>AdminDash</Link></Button>
        } else {
            return <Button><Link to='/dashboard'>Dashboard</Link></Button>
        }
    }
    
    const navigate = useNavigate()


    const deleteCookie = (name:string) => {
        document.cookie = `${name}=; Max-Age=0; path=/;`;
      };

    const logout = async() => {
        localStorage.removeItem('email')
        localStorage.removeItem('refreshToken')

        deleteCookie('token');
        deleteCookie('refreshToken');

        const res = await axios.get(import.meta.env.VITE_API_URL+'/api/users/logout',{withCredentials:true})
        setToken(null)
        console.log(res.data);

        
        dispatch(toggleAdmin(false))
        navigate('/login')
    }

    const dashboard = check()
    return (
        <Stack spacing={2} direction={'row'}>
            <Button><Link to='/'>Home</Link></Button>
            {email ? <Button onClick={()=>logout()}>Log out</Button> : <><Button><Link to='/login'>Login</Link> </Button><Button><Link to='/register'>Register</Link></Button></>}
            {dashboard}
        </Stack>
    )
}

export default Header