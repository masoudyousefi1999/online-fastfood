import mongoose from "mongoose";
import Uttils from "../Uttils/Uttils";

const schema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true , index : true},
    password: { type: String, required: true },
    location: [{ type: String, reuired: false }],
    role: { type: String, required: true, default: "USER" },
    token : {type : String, required : true},
    authenticated : {type : Boolean , required : true},
    code : {type : Number , required : false}
  },
  { timestamps: true }
);

schema.pre("save", async function (next){
  this.password = await Uttils.hashPassword(this.password);
  next()
})

const usersModel = mongoose.model("User", schema);

export default usersModel;