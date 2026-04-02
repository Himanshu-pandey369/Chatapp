const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true
  },
  name: {
    type:String,
    required:true,
  },
  email: {
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
  },
  gender:{
    type:String,
    required:true,
    enum:["male","female"]
  },
  profilepic:{
    type:String,
    default:""
  },
},{timestamps:true});

module.exports = mongoose.model("User", UserSchema);
