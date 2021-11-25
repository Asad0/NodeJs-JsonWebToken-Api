const express=require("express");
const app=express();
const db=require("./db");
const userCtrl=require("./User_controllers");
require('dotenv').config()
app.listen(process.env.PORT,()=>{console.log("Server Run at 8080")});
app.use("/",userCtrl);