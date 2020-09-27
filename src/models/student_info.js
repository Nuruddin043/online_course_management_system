const mongooes=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const string_required={
        type:String,
        required:true,
        trim:true
}
const studentInfoSchema=new mongooes.Schema({
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
            if(value.includes('password')){
                throw new Error("invaild password")
            }
            if(value.length<6){
                throw new Error("password length is short")
            }
        }
    },
    name_of_pack:{
        ...string_required
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

studentInfoSchema.methods.toJSON = function(){
    const student=this
    const studentObject= student.toObject()
    delete studentObject.password
    delete studentObject.tokens
    return studentObject
}

studentInfoSchema.methods.generateAuthToken=async function(){
    const student=this
    const token=jwt.sign({_id:student._id.toString()},process.env.JWT_SECRET)
    student.tokens= student.tokens.concat({token})
    await student.save()
    return token
}

studentInfoSchema.statics.findByCredentials= async(email,password)=>{
    const student=await StudentInfo.findOne({email})
    if(!student){
        throw new Error('unable to login')
    }

    const isMatch=await bcrypt.compare(password,student.password)
    if(!isMatch){
        throw new Error('unable to login')
    }
    return student
}

studentInfoSchema.pre('save',async function(next){
    const student=this
    if(student.isModified('password')){
        student.password=await bcrypt.hash(student.password,8)
    }

    next()
})



const StudentInfo=mongooes.model('StudentInfo',studentInfoSchema)


module.exports=StudentInfo