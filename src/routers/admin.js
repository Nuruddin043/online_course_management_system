const express=require('express')
const router=new express.Router()
const Leaders=require('../models/leaders')

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

module.exports=router