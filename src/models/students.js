const mongooes=require('mongoose')
const validator=require('validator')
const string_required={
        type:String,
        required:true,
        trim:true
}
const string_not_required={
    type:String,
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
    program:{
        program_code:{
            ...string_not_required
        },
        year:{
            ...string_not_required
        },
        section:{
            ...string_not_required
        }
    },
    name_of_pack:{
        ...string_not_required
    }
},{
    timestamps:true
})


const Students=mongooes.model('Students',studentsSchema)


module.exports=Students