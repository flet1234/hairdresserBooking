import express from "express";
import { _register,_all,_login } from "../controllers/users.c";
import { verifyToken} from "../middlewares/verifyToken";
import { verifyRights } from "../middlewares/verifyRigths";

const router = express.Router()

router.post('/register', _register)
router.post('/login', _login)
router.get('/', verifyToken, _all)

router.get('/verify', verifyToken , (req, res) =>{
    res.sendStatus(200)
})
router.post('/verify/admin', verifyRights , (req, res) =>{
    res.sendStatus(200)
})
router.get('/logout', (req,res)=>{

    res.cookie('token', '2', {
        expires:new Date(1),
        maxAge:1,
        httpOnly:true
    })

    res.cookie('refreshToken', '1', {
        expires:new Date(1),
        maxAge:1,
        httpOnly:true
    })
    res.status(200).json({msg:'Logged out'})
})
export default router