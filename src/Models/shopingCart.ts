import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user : {type : mongoose.Schema.ObjectId , required : true ,ref : "User"},
    items: [
      {
        product: { type: mongoose.Schema.ObjectId, required: true , ref : "Product"},
        count: { type: Number, required: true, default: 1 },
        price : {type : Number , required : true}
      },
    ],
    description: String ,
    totalPrice: { type: Number, required: true },
    paymentMethod : String ,
    paid : {type : Boolean , required : true , default : false}
  },
  { timestamps: true }
);

const shopingCartsModel = mongoose.model("ShopingCart", schema);

export default shopingCartsModel;
