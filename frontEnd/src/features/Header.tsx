import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { toggleAdmin } from "./adminSlice";
import axios from "axios";
import { useAuthContext } from "../App";
import './style.css'


const Header = () => {
    const isAdmin = useAppSelector((state)=>state.adminReducer.isAdmin)
    const dispatch = useAppDispatch()
    const {setToken} = useAuthContext()
    const email = localStorage.getItem('email')
    

    const check = () => {
        if(isAdmin){
            return <button><Link to='/admindashboard'>AdminDash</Link></button>
        } else {
            return <button><Link to='/dashboard'>Dashboard</Link></button>
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
        <header>
            <button><Link to='/'>Home</Link></button>
            {email ? <button onClick={()=>logout()}>Log out</button> : <><button><Link to='/login'>Login</Link> </button><button><Link to='/register'>Register</Link></button></>}
            {dashboard}
        </header>
    )
}

export default Header