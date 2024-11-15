import mongoose from 'mongoose'

const connectdb= async()=>{
    try{
const  conn = await mongoose.connect(process.env.MONGO_URL)
console.log(`coonect to db  ${conn.connection.host}`)
    }catch(err){
        console.log(err);
    }
}
export default  connectdb;
