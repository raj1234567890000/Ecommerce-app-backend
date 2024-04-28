import JWT from 'jsonwebtoken'
import userModel from '../Models/userModel.js';


export const requireSingIn= async(req, res, next) => {
 try{
    const decode =JWT.verify(
        req.headers.authorization, process.env.JWT_SECRET
    ); 
     //驗證Token是否正確  
     req.user=decode;
    next();
 }  
    catch(error){
console.log(error)
    }
}

export const isAdmin=async (req,res,next,_id)=>{
try{
const user= await userModel.findById(req.user._id)
if(user.role !==1){
    return res.status(401).send({
        success:false,
        message:"unauthorized acesss"
    });

}else{
    next()
}
}catch(error){
    console.log(error)
    res.status(401).send({
        success:false,
        error,
        message:"error in admin middleware"
    })
}
}