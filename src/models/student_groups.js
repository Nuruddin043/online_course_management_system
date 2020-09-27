const mongooes=require('mongoose')
const validator=require('validator')
const string_required={
        type:String,
        required:true,
        trim:true
}
const studentGroupsSchema=new mongooes.Schema({
    leaders:[{
        leader_email:{
            ...string_required,
            unique:true,
            lowercase:true,
        }
    }],
    program:{
        program_code:{
            ...string_required
        },
        year:{
            ...string_required
        },
        section:{
            ...string_required
        }
    },
    group_students:[
        {
            student_email:{
                ...string_required,
                unique:true,
                lowercase:true,
            }
        }
    ]
},{
    timestamps:true
})


const Student_groups=mongooes.model('Student_groups',studentGroupsSchema)


module.exports=Student_groups