const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getRamdomProduct,
} = require("../controller/productController.js");
const authenticate = require("../middleware/authMiddleware.js");
const router = express.Router();

router.route("/").get(getProducts).post(createProduct);

router.route("/random").get(getRamdomProduct);

router
  .route("/:id")
  .get(getProductById)
  .delete(authenticate, deleteProduct)
  .put(/*authenticate,*/ updateProduct);

module.exports = router;
