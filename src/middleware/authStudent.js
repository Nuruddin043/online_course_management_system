const jwt=require('jsonwebtoken')
const StudentInfo=require('../models/student_info')

const authStudent= async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const student= await StudentInfo.findOne({_id:decoded._id,'tokens.token':token})
        if(!student){
            throw new Error()
        }

        req.student=student
        req.token=token
        next()
        
    }catch(e){
        res.status(401).send({error:'please authenticate'})
    }
}


module.exports=authStudent