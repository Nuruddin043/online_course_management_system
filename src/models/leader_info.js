const mongooes=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const string_required={
        type:String,
        required:true,
        trim:true
}
const leaderInfoSchema=new mongooes.Schema({
    firstname:{
        ...string_required
    },
    lastname:{
        ...string_required
    },
    email:{
        ...string_required,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid email')
            }
        }
    },
    password:{
        type:String,
        trim:true,
        validate(value){
            if(value.length<6){
                throw new Error("password length is short")
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
    
},{
    timestamps:true
})

leaderInfoSchema.methods.toJSON = function(){
    const leader=this
    const leaderObject= leader.toObject()
    delete leaderObject.password
    delete leaderObject.tokens
    return leaderObject
}

leaderInfoSchema.methods.generateAuthToken=async function(){
    const leader=this
    const token=jwt.sign({_id:leader._id.toString()},process.env.JWT_SECRET)
    leader.tokens= leader.tokens.concat({token})
    await leader.save()
    return token
}

leaderInfoSchema.statics.findByCredentials= async(email,password)=>{
    const leader=await LeaderInfo.findOne({email})
    if(!leader){
        throw new Error('unable to login')
    }

    const isMatch=await bcrypt.compare(password,leader.password)
    if(!isMatch){
        throw new Error('unable to login')
    }
    return leader
}

leaderInfoSchema.pre('save',async function(next){
    const leader=this
    if(leader.isModified('password')){
        leader.password=await bcrypt.hash(leader.password,8)
    }

    next()
})



const LeaderInfo=mongooes.model('LeaderInfo',leaderInfoSchema)


module.exports=LeaderInfo