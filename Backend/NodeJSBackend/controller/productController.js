import mongoose from "mongoose";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

const createProduct = asyncHandler(async (req, res) => {
  try {
    const newProduct = new Product({
      _id: mongoose.Types.ObjectId(),
      ...req.body,
    });
    await Product.insertMany(newProduct);

    console.log("Added new product");
    res.status(201).json({
      message: "product created successfully!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const newInfo = new Product({
      _id: req.params.id,
      ...req.body,
    });
    const product = await Product.findById(req.params.id);
    console.log(product);
    if (product) {
      product.overwrite(newInfo);
      await product.save();
      res.status(200).json({ message: "Product updated" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const category = req.query.category
    ? {
        category: {
          $regex: req.query.category,
          $options: "i",
        },
      }
    : {};
  const user = req.query.user
    ? {
        user: req.query.user,
      }
    : {};

  const products = await Product.find({ ...keyword, ...category, ...user });

  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const getRamdomProduct = asyncHandler(async (req, res) => {
  const number = req.query.num || 20;
  const category = req.query.category || undefined;
  let product;
  if (category) {
    product = await Product.aggregate([
      { $sample: { size: parseInt(number) } },
      { $match: { category: category } },
    ]);
  } else {
    product = await Product.aggregate([
      { $sample: { size: parseInt(number) } },
    ]);
  }

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("There are no product");
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getRamdomProduct,
};
