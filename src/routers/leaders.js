const express=require('express')
const router=new express.Router()
const Leaders=require('../models/leaders')
const LeaderInfo=require('../models/leader_info')

router.post('/leader/login',async(req,res,next)=>{
    try{
        const email=req.body.email
        const leader= await Leaders.findOne({email})
        if(leader){
            if(leader.isRegistered){
                res.status(202).send(leader)
            }else{
                res.status(203).send({msg:"not registered"})
            }
            
        }else{
            res.status(404).send({msg:'email not found'})
        }
        
    }catch(e){
        next(e)
    }

})
router.post('/leader/register',async(req,res,next)=>{
    try{
        const email=req.body.email
        const leader= await Leaders.findOne({email})
        if(leader){
            if(!leader.isRegistered){
                const newLeader= new LeaderInfo(req.body)
                await newLeader.save()
                const token=await newLeader.generateAuthToken()
                leader.isRegistered=true;
                await leader.save();
                res.status(201).send({newLeader,token})
            }else{
                res.status(208).send({msg:"already registered"})
            }
            
        }else{
            res.status(403).send({msg:"Email not found on leaders"})
        }
        
        
    } catch(e){
        res.status(400).send(e)
    }

})
router.post('/leader/auth',async(req,res,next)=>{
    try{
        const leader=await LeaderInfo.findByCredentials(req.body.email,req.body.password)
        const token=await leader.generateAuthToken()
        res.status(200).send({leader,token})
    }catch(e){
        res.status(400).send({msg:"wrong password"})
    }

})


module.exports=router