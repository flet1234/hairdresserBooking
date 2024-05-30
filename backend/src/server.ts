import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import path from 'path'
import usersrouter from './routes/users.r'

const app = express()

app.use(cors({
    origin: 'https://hairdresserbooking.onrender.com',
    credentials: true,}
))

// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true,}
// ))

app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.listen(process.env.Port || 3001, () => {
    console.log(`Running on ${process.env.Port || 3001}`);   
})

app.use('/api/users', usersrouter)

app.use(express.static(path.resolve(__dirname,'../../../frontEnd/dist')))
app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname, "../../../frontEnd/dist",'index.html'))
})