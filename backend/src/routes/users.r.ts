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

export default router