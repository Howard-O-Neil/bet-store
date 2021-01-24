import mongoose from "mongoose";
import Category from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";
export const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = new Category({
      _id: mongoose.Types.ObjectId(),
      ...req.body,
    });
    await Category.insertMany(newCategory);

    console.log("Added new category");
    res.status(201).json({
      message: "Category created successfully!",
    });
  } catch (error) {
    res.status(500);

    throw new Error(error);
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  try {
    const newInfo = new Category({
      _id: req.params.id,
      ...req.body,
    });
    const category = await Category.findById(req.params.id);

    if (category) {
      category.overwrite(newInfo);
      await category.save();
      res.status(200).json({ message: "Product updated" });
    } else {
      res.status(404);
      throw new Error("Category not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});
