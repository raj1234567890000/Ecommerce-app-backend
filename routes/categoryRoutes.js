import  express from "express";
import {  createCategoryController, deleteCategoryController, getAllCategoriesController, singleCategoryController, updateCategoryController } from "../Controllers/categoryController.js";
import { isAdmin, requireSingIn } from "../Middlewares/authMiddleware.js";

const router=express.Router( );

router.post("/create-category",requireSingIn,isAdmin,createCategoryController);
router.put("/update-category/:id",requireSingIn,isAdmin,updateCategoryController)
router.get("/get-category",getAllCategoriesController);
router.get("/single-category/:slug",singleCategoryController)
router.delete("/delete-category/:id",requireSingIn,isAdmin,deleteCategoryController)

export default router;