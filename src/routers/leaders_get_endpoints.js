const express=require('express')
const router=new express.Router()
const Leaders=require('../models/leaders')
const LeaderInfo=require('../models/leader_info')
const authLeader=require('../middleware/authLeader')
const { json } = require('body-parser')

router.get('/leader/dashboard',authLeader,async(req,res)=>{
    try{
        const co_leader=await LeaderInfo.find({name_of_pack:req.leader.name_of_pack,email:{$ne:req.leader.email}})
        let co_leaderObj=[]
        if(co_leader){
          co_leader.forEach((obj)=>{
            co_leaderObj.push({
              firstname:obj.firstname,
              lastname:obj.lastname,
              email:obj.email,
            })

          })
      
        }
        const rturnObj={
          leader:{
            firstname:req.leader.firstname,
            lastname:req.leader.lastname,
            email:req.leader.email,
          },
          program:{
            ...req.leader.program.toObject()
          },
          coleader:co_leaderObj,
          schedules:{
            count:5

          },
          students:{
            count:5
          }
          
        }
  

        res.status(200).send(rturnObj)
      }catch(e){
        res.status(500).send(e)
      }
})



module.exports=router