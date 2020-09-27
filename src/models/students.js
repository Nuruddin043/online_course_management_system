const mongooes=require('mongoose')
const validator=require('validator')
const string_required={
        type:String,
        required:true,
        trim:true
}
const studentsSchema=new mongooes.Schema({
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
    isRegistered:{
        type:Boolean,
        default:false
    },
    leader_id:{
        ...string_required,
    }
},{
    timestamps:true
})


const Students=mongooes.model('Students',studentsSchema)


module.exports=Students