const mongooes=require('mongoose')
const validator=require('validator')
const string_required={
        type:String,
        required:true,
        trim:true
}
const leadersSchema=new mongooes.Schema({
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
    }
},{
    timestamps:true
})


const Leaders=mongooes.model('Leaders',leadersSchema)


module.exports=Leaders