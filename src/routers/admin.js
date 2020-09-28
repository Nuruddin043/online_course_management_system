const express=require('express')
const router=new express.Router()
const Leaders=require('../models/leaders')

router.post('/add/leader',async(req,res,next)=>{
    try{
        const name_of_pack=req.body.program.program_code+' '+req.body.program.year+'-'+req.body.program.section
        const leader=new Leaders({...req.body,name_of_pack})
        await leader.save()
        res.status(200).send(leader)
    }catch(e){
        next(e)
    }

})

module.exports=router