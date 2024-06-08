import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import path from 'path'
import usersrouter from './routes/users.r'
import servicerouter from './routes/service.r'

const {FRONTENDURL} = process.env
const app = express()

app.use(cors({
    origin: FRONTENDURL,
    credentials: true,}
))

app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.listen(process.env.PORT || 3001, () => {
    console.log(`Running on ${process.env.PORT || 3001}`);   
})

app.use('/api/users', usersrouter)
app.use('/api/service', servicerouter)

app.use(express.static(path.resolve(__dirname,'../../../frontEnd/dist')))
app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname, "../../../frontEnd/dist",'index.html'))
})