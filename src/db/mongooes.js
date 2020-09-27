const mongoose=require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('database connected');
}).catch((e)=>{
    console.log('faild to connect to the database');
})