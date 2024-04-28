import slugify from "slugify";
import productModel from "../Models/productModel.js";
import CatageoryModel from "../Models/CatageoryModel.js";
import orderModel from "../Models/orderModel.js";
import fs, { rmSync } from "fs"
import braintree from  'braintree';
import dotenv from 'dotenv'

dotenv.config();

export const createProductController=async(req,res)=>{

    //create  products start here
    try{
        const  { name,description,price,category,quantity}=req.fields
        const {photo}=req.files

        switch(true){
            case ! name:
                return res.status(500).send({error:"name is required"})
                case ! description:
                    return res.status(500).send({error:"description is required"})
                    case ! price:
                        return res.status(500).send({error:"price is required"})
                        case ! category:
                            return res.status(500).send({error:"category is required"})
                            case ! quantity:
                                return res.status(500).send({error:"quantityis required"})
                                case photo && photo.size>1000000:
                                return res.status(500).send(
                                    {
                                        error:"photo is required and should be less then 1mb"
                                    }
                                )
        }

        const products= new productModel({...req.fields,slug:slugify(name)})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType=photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"product created successfully",
            products
        })
    } catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in creating product",
            error
        })

    }
    
}

//All products start here

export const getProductController=async(req,res)=>{
    try{
        const products=await productModel.find({}).populate("category").select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success: true,
            Total_products:products.length,
            message:"all products here",
            products,
            total:products.lenght
            
        })

    }catch(error){
console.log(error);
res.status(500).send({
    success: false,
    message:"error in get products",
    error
})
    }
}

//single products start here

export const singleProductController=async(req,res)=>{
    try{
const product=await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category")
res.status(200).send({
    success:true,
    message:"single product list",
    product
})
    }catch(error){
console.log(error)
res.status(500).send({
    success:false,
    message:"error in single products",
    error
})
    }
}

//photo contorleer

export const getPhotoController=async(req,res)=>{
    try{
        const product= await productModel.findById(req.params.pid) .select("photo")
        if(product.photo.data){
            res.set('Content-Type',product.photo.contentType)
            return  res.status(200).send(product.photo.data)
        }

    }catch(error){
console.log(error)
res.status(500).send({
    success:false,
    message:"error in photo",
    error
})
    }
}

//delete product here

export const deleteProductController=async(req,res)=>{
    try{
   await productModel.findByIdAndDelete(req.params.pid).select("-photo")
   res.status(200).send({
    success:true,
    message:"product delete successfully"
   })

    }catch(error){
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "error in delte product",
            error
            })

    }
}

//update products

export const updateProductsController=async(req,res)=>{
    try{
        const  { name,description,price,category,quantity}=req.fields
        const {photo}=req.files

        switch(true){
            case ! name:
                return res.status(500).send({error:"name is required"})
                case ! description:
                    return res.status(500).send({error:"description is required"})
                    case ! price:
                        return res.status(500).send({error:"price is required"})
                        case ! category:
                            return res.status(500).send({error:"category is required"})
                            case ! quantity:
                                return res.status(500).send({error:"quantityis required"})
                                case photo && photo.size>1000000:
                                return res.status(500).send(
                                    {
                                        error:"photo is required and should be less then 1mb"
                                    }
                                )
        }

        const products= await productModel.findByIdAndUpdate(req.params.pid,
            {
                ...req.fields,slug:slugify(name)},{new:true}
            )
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType=photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"product update  successfully",
            products
        })
    } catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in update product",
            error
        })

    }
    
 
}

//filter controller
 export const ProductFilterController=async(req,res)=>{
    try{
const {checked,radio}=req.body
let args={}
if(checked.length>0)args.category=checked
if(radio.length)args.price={$gte:radio[0],$lte:radio[1]}
const products=await productModel.find(args);
res.status(200).send({
    success:true,
    products
})
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in filter product",
            error
        })

    }
 }
 //product count controller
 export const ProductCountController = async (req, res) => {
    try{
const totals=await  productModel.find({}).estimatedDocumentCount()
res.status(200).send({
    success:true,
    totals
})
    }catch(error){
console.log(error)
res.status(500).send({
    success:false
    ,message:'Error In Counting'
    ,error:error
})
    }
 }

 //product list controller

 export const productListController=async(req,res)=>{
    try{
        const perPage=6
        const page=req.params.page ? req.params.apge :1;
        const products=await productModel.find({}).select("-photo").skip(perPage*(page-1)).limit(perPage).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            products
        })

    }catch(error){
    
        console.log(error)
        res.status(500).send({
            success:false
            ,message:'Error In prodcut list'
            ,error:error
        })
    }
 }
//search products
 export const searchProductController=async(req,res)=>{
    try{
        const {keyword}=req.params;
        const results=await productModel.find({
            $or:[
                {name:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}}
            ]

        }).select("-photo")
        res.json(results);

    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"eroor in search api",
            error
        })

    }
 }

 //similar product
  export const realtedProductController=async(req,res)=>{
    try{
const{pid,cid}=req.params
const products=await productModel.find({
    category:cid,
    _id:{$ne:pid}
}).select("-photo").limit(3).populate("category")
res.status(200).send({
    success:true,
    products
})
    }catch(error){
        console.log(error)
        res.status(400).send({
            success:false,
            message:"error in fetching related product",
            error
        })
    }
  }

  //category wise

  export const prodcutCategoryController=async(req,res)=>{
    try{
const category= await CatageoryModel.findOne({slug:req.params.slug})
const products= await productModel.find({category}).populate('category')
res.status(200).send({
    success:true,
    category,
    products
})
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error getting products",
            error
        })
    }
  }

  //payment gateway

  var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "hx6ckrv8txrpjfyr",
    publicKey: "nfn5z639nkwxkqhp",
   privateKey: "d1d1942403310f2fc6252b4a724f08df",
  });

  //payment gateway api
  //token
  export const braintreeTokenController=async(req,res)=>{
    try{
gateway.clientToken.generate({},function(err,response){
    if(err){
        res.status(500).send(err)
    }else{
        res.send(response)
    }
})
    }catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message:"error in payment token gateway api",
            error
        })

    }
  }

  //payments

  export const paymentController=async(req,res)=>{
    try{
const{cart,nonce}=req.body
let total=0
cart.map((i)=>{
    total += i.price
})
let newTransaction=gateway.transaction.sale({
    amount:total,
    paymentMethodNonce: nonce,
    options:{
        submitForSettlement: true
    }
    
},
function(err,result){
    if(result){
     const order= new orderModel({
        products:cart,
        payment:result,
        buyer:req.user._id
     }).save()
     res.json({ok:true}) 
    }else{
        res.status(500).send({
            success:false,
            message:"error in payment gateway api",
            error:err
        })
    }
}
)
    }catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message:"error in payment method",
            error
        })

    }
  }