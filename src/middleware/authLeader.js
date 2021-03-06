const jwt=require('jsonwebtoken')
const LeaderInfo=require('../models/leader_info')

const authLeader= async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const leader= await LeaderInfo.findOne({_id:decoded._id,'tokens.token':token})
        if(!leader){
            throw new Error()
        }

        req.leader=leader
        req.token=token
        next()
        
    }catch(e){
        res.status(401).send({error:'please authenticate'})
    }
}


module.exports=authLeader