import mongoose from 'mongoose'



const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:true,
    trim:true
},
email:{
    type:String,
    require:true,
    unique: true 
},
password:{
    type: String,
    required: true,
    minlength: 10
},
phone:{
type:String,
required:true,
unique : true
},
addresh:{
    type:{},
    required:true
},
answer:{
type:String,
required:true,
},

role:{
    type:Number,
    default:0
}
},{timestamps:true})


export default mongoose.model('user', userSchema)