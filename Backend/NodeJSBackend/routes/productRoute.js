import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} from "../controller/productController.js";
import authenticate from "../middleware/authMiddleware.js";
const router = express.Router();

// @desc Fetch all products
// @route GET /api/products
// @access Public
router.route("/").get(getProducts).post(createProduct);

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
router
  .route("/:id")
  .get(getProductById)
  .delete(authenticate, deleteProduct)
  .put(authenticate, updateProduct);

// @desc Create single product
// @route POST /api/products/
// @access User only

export default router;
