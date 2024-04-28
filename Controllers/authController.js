import { comparePassword, hashPassword } from "../Helpers/authHelpers.js";
import userModel from "../Models/userModel.js";
import orderModel from "../Models/orderModel.js";
import JWT from 'jsonwebtoken'



export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, addresh ,answer} = req.body;
    if (!name) {
      return res.send({ message: "name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({message: "password is required" });
    }
    if (!phone) {
      return res.send({ message: "phone is required" });
    }
    if (!addresh) {
      return res.send({ message: "addresh is required" });
    }
    if (!answer) {
      return res.send({ message: "answer is required" });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "Email already exists",
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      phone,
      addresh,
      password: hashedPassword,
      answer
    }).save();
    res.status(201).send({
      success: true,
      message: "User created succesfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in registration",
      error,
    });
  }
};

export const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'invalid email or password'
            })
        }
const user=await userModel.findOne({email})
if(!user){
    return res.status(404).send({
        success:false,
        message:"email is not register"
    });
}
        const match= await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:"inavlid password"
            });
        }
        const token = await  JWT.sign({_id:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        });
        res.status(200).send({
            success:true,
            message:"login succesfully ",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                addresh:user.addresh,
                role:user.role,
            },
            token,

        })
     
    }catch(error){
        console.log("Error In Login Controller");
        return res.status(500).send({
            success:false,
            message:" Error in login",
            error

        })

    }
}


export const testController=async (req ,res)=>{
    res.send('test');
}

 export const forgetPasswordController=async(req,res)=>{
try{
const {email,answer,newpassword}=req.body;
console.log({email,answer,newpassword});
if(!email){
  res.status(400).send({message:"Email is required"})
}
if(!answer){
  res.status(400).send({message:"Answer is required"})
}
if(!newpassword){
  res.status(400).send({message:"newpassword is required"})
}
const user = await userModel.findOne({email,answer});
if (!user) {
  return res.status(404).send({
    success:false,
    message:"wrong email or answer"
  })


}
const hashed =await hashPassword(newpassword);
await  userModel.findByIdAndUpdate(user._id,{password: hashed})
res.status(200).send({
  success:true,
  message:"pasword reset successsfully"
})
}catch(error){
  console.log(error)
  res.status(500).send({
    success : false ,
    message : 'something went error',
    error
  })
}
 }

 //upadte profile

 export const updateProfileController=async(req,res)=>{
  try{
    const{name,phone,addresh,password,email}= req.body;
    const user=await userModel.findById(req.user._id)
    if(password && password.length < 6){
      return res.json({error:"password is requires and 6 cahrcter"})
    }
    const hashedPassword=password ? await hashPassword(password):undefined
    const updateUser=await userModel.findByIdAndUpdate(req.user._id,{
      name:name || user.name,
      password:hashedPassword || user.password,
      phone:phone|| user.phone,
      address:addresh|| user.addresh
    },{new:true})
res.status(201).send({
  success: true, 
  message:"profile update successfully",
  updateUser

})
  }
  catch(error){
    console.log(error)
    res.status(500).send({
      success : false ,
      message:"error in update profile",
      error
    })
  }
 }
 export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};