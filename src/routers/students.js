const express=require('express')
const router=new express.Router()
const Leaders=require('../models/leaders')

router.post('/add/leader',async(req,res,next)=>{
    try{
        const email=req.body.email
        const leader=new Leaders({email})
        await leader.save()
        res.status(200).send(leader)
    }catch(e){
        next(e)
    }

})

module.exports=router