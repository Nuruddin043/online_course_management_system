const express=require('express')
const router=new express.Router()
const Program=require('../models/programs')
const authStudent=require('../middleware/authStudent')
router.get('/student/dashboard',authStudent,async(req,res,next)=>{
    try{
        const program= await Program.findOne({name_of_pack:req.student.name_of_pack})
        const rturnObj={
          student:{
            firstname:req.student.firstname,
            lastname:req.student.lastname,
            email:req.student.email,
          },
          program:{
            ...req.student.program.toObject()
          },
          schedule_list:{
            count:program.schedules.length,
            due_dates:program.schedules

          }
          
        }
  
        res.status(200).send(rturnObj)
      }catch(e){
        next(e)
      }
})





module.exports=router