const express=require('express')
const router=new express.Router()
const Students=require('../models/students')
const StudentInfo=require('../models/student_info')
const Program=require('../models/programs')
const Leaders=require('../models/leaders')
const authStudent=require('../middleware/authStudent')
const authLeader=require('../middleware/authLeader')

router.post('/schedule',authLeader,async(req,res,next)=>{
    try{
        const program= await Program.findOne({name_of_pack:req.leader.name_of_pack})
        if(program){
            program.schedules= program.schedules.concat({schedule:req.body.due_date})
            await program.save()
        }
        res.status(200).send()
    }catch{
        res.status(400)
        res.send(e)
    }

})

router.patch('/schedule/:id',authLeader,async(req,res,next)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['due_date']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
      
        Program.findOne({ name_of_pack: req.leader.name_of_pack}).then(doc => {
            schedules = doc.schedules.id(req.params.id);
            schedules["schedule"] =req.body.due_date;
            doc.save();
            res.status(200).send(schedules)
    
          }).catch(err => {
            throw new Error(err)
          });
        
    } catch (e) {
        res.status(400).send(e)
     
    }

})

router.delete('/schedule/:id',authLeader,async(req,res,next)=>{
    try{
        Program.findOne({ name_of_pack: req.leader.name_of_pack}).then(doc => {
            doc.schedules = doc.schedules.filter(schedule => {
                return schedule._id != req.params.id;
            });
            doc.save();
      
            res.status(200).send()
    
          }).catch(err => {
            throw new Error(err)
          });
    }catch(e){
        res.status(400).send(e)
    }

})


module.exports=router