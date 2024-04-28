import slugify from "slugify";
import CatageoryModel from "../Models/CatageoryModel.js";

export const createCategoryController=async(req,res)=>{
try{
    const {name}=req.body;
    if(!name){
        return res.status(401).send({message:"Category name is required"});
    }
    const existingCategory=await CatageoryModel.findOne({name})
    if(existingCategory){
        return res.status(200).send({
            success:true,
            message: 'Category already exists'
        })
    }
    const category=await new  CatageoryModel({name,slug:slugify(name)}).save();
    res.status(201).send({
        success:true,
        message: 'Category created',
        category
    })

}catch(error){
    console.log("Error in getting categories", error);
    res.status(500).send({
        success:false,
        error,
        message:"Error in category"
    })

}
}

export const updateCategoryController=async(req,res)=>{
    try{
        const{name}=req.body;
        const {id}= req.params;
        const category=await CatageoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:"category update successfully",
            category
        })

    }catch(error){
console.log(error)
res.status(500).send({
    success:false,
    message:"error in updatinf category",
    error
})
    }

}
// get all the data from the database and send it to the client side
export const getAllCategoriesController = async (req, res) => {
    try{
const category =await CatageoryModel.find({});
res.status(200).send({
    success:true,
    message:"all catageories list",
    category
})
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in getting category",
            error
        })

    }

}
export const singleCategoryController=async(req,res)=>{
    try{
      
        const category=await CatageoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:"true",
            message:"get single categoty",
            category
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in single category",
            error
        })

    }
}

export const  deleteCategoryController=async(req,res)=>{
    try{
        const{id}=req.params;
        await CatageoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"category delete succssefully"
        })

    }catch(error){
console.log(error)
res.status(500).send({
    success:false,
    message:"errro in deleting category",
    error
})
    }
}