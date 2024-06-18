import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true},
    slug : { type: String, required: true},
    count: { type: Number, required: true},
    description: { type: String, required: true },
    preparationTime: { type: String, reuired: true },
    image: { type: String, required: true},
    price : {type : Number, required : true},
    category : {type : mongoose.Schema.ObjectId , required : true, ref : "Category"},
  },
  { timestamps: true }
);

const productsModel = mongoose.model("Product", schema);

export default productsModel;