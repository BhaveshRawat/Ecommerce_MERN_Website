import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,    //when we create a category an id is generated we put it here 
      ref: "Category",    //linking to categorymodel
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: Buffer,    //for taking photo we install express -formidable
      contentType: String,
    },
    shipping: {
      type: Boolean,     //to show the order status
    },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
