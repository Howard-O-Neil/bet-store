import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Category from "./models/categoryModel.js";
import connectDB from "./config/db.js";
import products from "./data/product.js";
import categories from "./data/cat.js";
import users from "./data/user.js";

dotenv.config();

connectDB();

const importData = async () => {
  
  try {
    await User.deleteOne({_id: new Object("5fa7fb0a62083e11ace57490")});
    await Product.deleteMany();
    await Category.deleteMany();
    await User.insertMany([users]);
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
