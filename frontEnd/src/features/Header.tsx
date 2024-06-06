import { Link } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import { useAuthContext } from "../App";


const Header = () => {
    const {admin} = useAuthContext()
    console.log(admin);
    

    return (
        <Stack spacing={2} direction={'row'}>
            <Button><Link to='/'>Home</Link></Button>
            <Button><Link to='/login'>Login</Link></Button>
            <Button><Link to='/register'>Register</Link></Button>
            {admin ? <Button><Link to='/admindashboard'>AdminDash</Link></Button> : <Button><Link to='/dashboard'>Dashboard</Link></Button>}
        </Stack>
    )
}

export default Header