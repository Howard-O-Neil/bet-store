import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js";
import Category from "./models/categoryModel.js";
import connectDB from "./config/db.js";
import products from "./data/product.js";
import categories from "./data/cat.js";

dotenv.config();

connectDB();

const importData = async () => {
  console.log("Data imported!");
  try {
    await Product.deleteMany();
    await Category.insertMany();
    await Product.insertMany(products);
    await Category.insertMany(categories);
    console.log("Data imported!");
    process.exit(1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
