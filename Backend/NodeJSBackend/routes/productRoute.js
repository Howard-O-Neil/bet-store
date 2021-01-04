import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getRamdomProduct,
} from "../controller/productController.js";
import authenticate from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(getProducts).post(createProduct);

router.route("/random").get(getRamdomProduct);

router
  .route("/:id")
  .get(getProductById)
  .delete(authenticate, deleteProduct)
  .put(authenticate, updateProduct);

export default router;
