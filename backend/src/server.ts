import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import path from 'path'
dotenv.config()

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.listen(process.env.Port || 3001, () => {
    console.log(`Running on ${process.env.Port || 3001}`);   
})

app.get('/api/:name', (req,res)=>{
    res.json({msg:`Hello ${req.params.name}, MY_NAME => ${process.env.MY_NAME}`})
})

app.use(express.static(path.resolve(__dirname,'../frontEnd/dist')))
app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname, "../frontEnd/dist",'index.html'))
})