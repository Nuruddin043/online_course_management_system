const express=require('express')
const router=new express.Router()
const Leaders=require('../models/leaders')
const LeaderInfo=require('../models/leader_info')
const authLeader=require('../middleware/authLeader')
const { json } = require('body-parser')

router.post('/leader/login',async(req,res,next)=>{
    try{
        const email=req.body.email
        const leader= await Leaders.findOne({email})
        let name_of_pack;
        if(leader){          
            if(leader.isRegistered){
                    const obj={
                        isRegistered:leader.isRegistered,
                    }
                    res.status(202).send(JSON.stringify(obj))
                
            }else{
                if(leader.program){
                    name_of_pack=leader.program.program_code+' '+leader.program.year+'-'+leader.program.section
                    const co_leader=await Leaders.findOne({name_of_pack:name_of_pack,email:{$ne:leader.email}})
                    if(co_leader){
                        const obj1={
                            isRegistered:leader.isRegistered,
                            email:leader.email,
                            has_coleader:true,
                            coleader_email:co_leader.email,
                            program:leader.program}
                        return res.status(203).send(JSON.stringify(obj1))
                    }
                }
                const obj2={
                    isRegistered:leader.isRegistered,
                    email:leader.email,
                    has_coleader:false,
                    coleader_email:null,
                    program:leader.program}
                res.status(203).send(JSON.stringify(obj2))
                    
            }
            
        }else{
            res.status(404).send(JSON.stringify({msg:'email not found'}))
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
                const name_of_pack=req.body.program.program_code+' '+req.body.program.year+'-'+req.body.program.section
                if(req.body.has_coleader){
                    const find_coleader= await Leaders.findOne({email:req.body.coleader_email})
                    if(!find_coleader){
                
                        const coleader=new Leaders({
                            email:req.body.coleader_email,
                            program:{
                                program_code:req.body.program.program_code,
                                year:req.body.program.year,
                                section:req.body.program.section
                            },
                            name_of_pack
                        })
                        await coleader.save()
                    }
                }
                delete req.body.has_coleader
                delete req.body.coleader_email
     
                const newLeader= new LeaderInfo({...req.body,name_of_pack})
                await newLeader.save()
                const prog={
                        program_code:req.body.program.program_code,
                        year:req.body.program.year,
                        section:req.body.program.section
                    }
                leader.name_of_pack=name_of_pack
                leader.program=prog
                leader.isRegistered=true;
    
                await leader.save();
     
                res.status(201).send(JSON.stringify({email:leader.email}))
                    
                
                
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
router.post('/leader/auth',async(req,res,next)=>{
    try{
        const leader=await LeaderInfo.findByCredentials(req.body.email,req.body.password)
        const token=await leader.generateAuthToken()
        res.status(200).send(JSON.stringify({token}))
    }catch(e){
        res.status(400).send({msg:"wrong password"})
    }

})
router.post('/leader/logout',authLeader,async(req,res)=>{
    try{
        req.leader.tokens=[]
        await req.leader.save()
        res.status(205).send({msg:"log out successfully"})
      }catch(e){
        res.status(500).send(e)
      }
})
router.get('/leader_count',authLeader,async(req,res)=>{
    try{
        req.leader.tokens=[]
        await req.leader.save()
        res.status(205).send({msg:"log out successfully"})
      }catch(e){
        res.status(500).send(e)
      }
})


module.exports=router