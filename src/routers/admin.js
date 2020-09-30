const express=require('express')
const router=new express.Router()
const Leaders=require('../models/leaders')

router.post('/add/leader',async(req,res,next)=>{
    try{
        const leader=new Leaders({...req.body})
        await leader.save()
        res.status(200).send()
    }catch(e){
        next(e)
    }

})

module.exports=router