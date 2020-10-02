const express=require('express')
const router=new express.Router()
const Leaders=require('../models/leaders')
const Studetns=require('../models/students')
const Program=require('../models/programs')
const authLeader=require('../middleware/authLeader')

router.post('/add/leader',async(req,res,next)=>{
    try{
        if(req.body.program){
            const name_of_pack=req.body.program.program_code+' '+req.body.program.year+'-'+req.body.program.section
            const leader=new Leaders({...req.body,name_of_pack})
            await leader.save()
            return res.status(200).send()
        }else{
            const leader=new Leaders({...req.body})
            await leader.save()
            res.status(200).send()
        }
       
    }catch(e){
        next(e)
    }

})

router.post('/invite/student',authLeader,async(req,res,next)=>{
    try{
        const studetns=new Studetns({
            email:req.body.email,
            program:req.leader.program.toObject(),
            name_of_pack:req.leader.name_of_pack
        })
        await studetns.save()
        const program= await Program.findOne({name_of_pack:req.leader.name_of_pack})
        if(program){
            program.students= program.students.concat({student_email:req.body.email})
            await program.save()
        }
        res.status(200).send()
       
    }catch(e){
        res.status(206).send()
    }

})

module.exports=router