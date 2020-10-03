const mongooes=require('mongoose')
const string_required={
        type:String,
        required:true,
        trim:true
}
const programSchema=new mongooes.Schema({
    leaders:[{
        leader_email:{
            ...string_required,
            unique:true,
            lowercase:true,
        }
    }],
    name_of_pack:{
        ...string_required
    },
    students:[
        {
            student_email:{
                ...string_required,
                unique:true,
                lowercase:true,
            }

        }
    ],
    schedules:[
        {
            schedule:{
                ...string_required,
                unique:true
            }

        }
    ]
},{
    timestamps:true
})


const Programs=mongooes.model('Programs',programSchema)


module.exports=Programs