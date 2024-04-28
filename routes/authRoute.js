import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgetPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../Controllers/authController.js";
import { isAdmin, requireSingIn } from "../Middlewares/authMiddleware.js";

const router = express.Router();

//authroutes
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/test", requireSingIn, isAdmin, testController);
router.post("/forgetpassword", forgetPasswordController);
router.get("/user-auth", requireSingIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/admin-auth", requireSingIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile controoller

router.put("/profile", requireSingIn, updateProfileController);

//orders
router.get("/orders", requireSingIn, getOrdersController);

//all orders
router.get("/all-orders", requireSingIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSingIn,
  isAdmin,
  orderStatusController
);

export default router;
