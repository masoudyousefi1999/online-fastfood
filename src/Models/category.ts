import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    urlTitle: { type: String, required: true},
    title: { type: String, required: true},
    image : {type: String, required: true}
  },
  { timestamps: true}
);

schema.virtual("products",{
  ref : "Product",
  localField : "_id",
  foreignField : "category"
})

const categoriesModel = mongoose.model("Category", schema);

export default categoriesModel;