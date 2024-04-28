import express from "express";
import { isAdmin, requireSingIn } from "../Middlewares/authMiddleware.js";
import {
  ProductCountController,
  ProductFilterController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getPhotoController,
  getProductController,
  paymentController,
  prodcutCategoryController,
  productListController,
  realtedProductController,
  searchProductController,
  singleProductController,
  updateProductsController,
} from "../Controllers/productController.js";
import formidable from "express-formidable";


const router = express.Router();
//create-products
router.post(
  "/create-product",
  requireSingIn,
  isAdmin,
  formidable(),
  createProductController
);

//get-all products
router.get("/get-product", getProductController);

//single products

router.get("/get-product/:slug", singleProductController);

//get photo

router.get("/product-photo/:pid", getPhotoController);

//delete product
router.delete("/delete-product/:pid", deleteProductController);

//update-products
router.put(
  "/update-product/:pid",
  requireSingIn,
  isAdmin,
  formidable(),
  updateProductsController
);

//filter product

router.post("/product-filter", ProductFilterController);

//product count

router.get("/product-count", ProductCountController);

//product perpage
router.get("/product-list/:page", productListController);

//search products

router.get("/search/:keyword", searchProductController);

//simliar product

router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product

router.get('/product-category/:slug',prodcutCategoryController)

//payments route

router.get('/braintree/token',braintreeTokenController)

//payments

router.post('braintree/payment',requireSingIn,paymentController)

export default router;
