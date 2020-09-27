const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//////////////////////////////////////////////
const adminRouter=require('./routers/admin')
const leadersRouter=require('./routers/leaders')
const studentsRouter=require('./routers/students')

const Router= new express.Router()

const app = express();

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
app.use(adminRouter)
app.use(leadersRouter)
app.use(studentsRouter)




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