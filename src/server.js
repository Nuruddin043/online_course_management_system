const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//////////////////////////////////////////////
const add_leader_studentRouter=require('./routers/add_leader_student')
const leadersRouter=require('./routers/leaders')
const studentsRouter=require('./routers/students')
const leadersGetRouter=require('./routers/leaders_get_endpoints')
const schedulesRouter=require('./routers/schedules')
const studentsGetRouter=require('./routers/students_get_endpoints')

var cors = require('cors')
const Router= new express.Router()

const app = express();
app.use(cors())
//integration of env file.
require('dotenv').config()
require('./db/mongooes')


const PORT = process.env.PORT || 5000;

// use body parser middleware for incoming post request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

///all routers file
app.use(add_leader_studentRouter)
app.use(leadersRouter)
app.use(leadersGetRouter)
app.use(studentsRouter)
app.use(schedulesRouter)
app.use(studentsGetRouter)



app.get('/',(req,res,next)=>{
    try{
        res.send('hello')
    }catch{
        next(e)
    }
})


/////error handling route
app.use((req,res,next)=>{
    const error=new Error(`Not found -${req.originalUrl}`)
    res.status(404)
    next(error)
})
app.use((error,req,res,next)=>{
    res.send({
        error:error.message
    })
})


app.listen(PORT, () => console.log('Server Listening on port ' + PORT));