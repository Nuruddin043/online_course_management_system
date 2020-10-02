const express=require('express')
const router=new express.Router()
const Students=require('../models/students')
const StudentInfo=require('../models/student_info')
const Student_groups=require('../models/student_groups')
const authStudent=require('../middleware/authStudent')
const { json } = require('body-parser')

router.post('/student/login',async(req,res,next)=>{
    try{
        const email=req.body.email
        const student= await Students.findOne({email})
        let name_of_pack;
        if(student){          
            if(student.isRegistered){
                    const obj={
                        isRegistered:student.isRegistered,
                    }
                    res.status(202).send(JSON.stringify(obj))
                
            }else{
                const obj2={
                    isRegistered:student.isRegistered,
                    program:student.program}
                    res.status(203).send(JSON.stringify(obj2))
                    
            }
            
        }else{
            res.status(404).send(JSON.stringify({msg:'email not found'}))
        }
        
    }catch(e){
        next(e)
    }

})
router.post('/student/register',async(req,res,next)=>{
    try{
        const email=req.body.email
        const student= await Students.findOne({email})
        if(student){
            if(!student.isRegistered){
                const name_of_pack=req.body.program.program_code+' '+req.body.program.year+'-'+req.body.program.section
                const newStudent= new StudentInfo({...req.body,name_of_pack})
                const token=await newStudent.generateAuthToken()
                await newStudent.save()
                student.isRegistered=true;
    
                await student.save();
     
                res.status(201).send(JSON.stringify({token:token}))
                    
                
                
            }else{
                res.status(208).send(JSON.stringify({msg:"already registered"}))
            }
            
        }else{
            res.status(403).send(JSON.stringify({msg:"Email not found on leaders"}))
        }
        
        
    } catch(e){
        next(e)
    }

})
router.post('/student/auth',async(req,res,next)=>{
    try{
        const student=await StudentInfo.findByCredentials(req.body.email,req.body.password)
        const token=await student.generateAuthToken()
        res.status(200).send(JSON.stringify({token}))
    }catch(e){
        res.status(400).send({msg:"wrong password"})
    }

})
router.post('/student/logout',authStudent,async(req,res)=>{
    try{
        req.student.tokens=[]
        await req.student.save()
        res.status(200).send()
      }catch(e){
        res.status(500).send(e)
      }
})



module.exports=router