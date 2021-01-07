import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    image: {
      link: { type: String /*required: true*/ },
      alt: { type: String /* required: true*/ },
    },
    properties: [
      {
        
        name: { type: String /*required: true*/ },
        image: {
          link: { type: String /*required: true*/ },
          alt: { type: String /* required: true*/ },
        },
      },
    ],
    parent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
