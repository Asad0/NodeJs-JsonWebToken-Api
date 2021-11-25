const express=require("express");
const route=express.Router();
const mongo=require("mongoose");
const userModel=require("./users_Model");
const bodyparse=require("body-parser");
const jsonurl=bodyparse.json();
const crypto=require("crypto");
const jwt=require("jsonwebtoken");
require('dotenv').config()
var sessionstorage = require('sessionstorage');
route.post("/signup",jsonurl,async(req,res)=>{
    await userModel.findOne({username:req.body.username}).then(result=>{
        if(result){
            res.status(400).send("username "+req.body.username+" is already Taken");
        }
        else if(req.body.password===req.body.confirmPassword){
            const cipher=crypto.createCipher(process.env.ALGO,process.env.CRYPTO_Key);
    const encrypted=cipher.update(req.body.password,'utf8','hex')
                    +cipher.final('hex');
                    var users=new userModel({
                        _id:new mongo.Types.ObjectId,
                        Firstname:req.body.Firstname,
                        Lastname:req.body.Lastname,
                        username:req.body.username.toLowerCase(),
                        password:encrypted,
                        confirmPassword:encrypted
                    });
                    users.save().then((resul)=>{
                        jwt.sign({result},process.env.JWT_KEY,{expiresIn:'1d'},(err,token)=>{
                            res.status(201).send("Account Create Successfully")
                            console.log(token);
                        })
                    })
        }
        else{
            res.status(400).send("Password Not Match");
        }
    });
});
route.post("/login",jsonurl,(req,res)=>{
    userModel.findOne({username:req.body.username}).then((result)=>{
        if(result){
            const dicipher=crypto.createDecipher(process.env.ALGO,process.env.CRYPTO_Key);
        const decrypted=dicipher.update(result.password,'hex','utf8')
                    +dicipher.final('utf8');
                    if(decrypted===req.body.password){
                        jwt.sign({result},process.env.JWT_KEY,{expiresIn:'500s'},(err,token)=>{
                            res.status(200).send("Welcome "+result.Firstname);
                            sessionstorage.setItem("token",token);
                            console.log(sessionstorage.getItem("token"));

                        })
                    }
                    else{
                        res.status(502).send("password Is Not Correct")
                    }
        }
        else {
            res.status(502).send("UserName is Not Correct")
        }                    
    })
});
route.get("/users",AuthenticateToken,(req,res)=>{
    userModel.find().then((result)=>{
        res.status(200).send(result);
    })
});
route.get("/logout",(req,res)=>{
    
    if(sessionstorage.getItem("token")){
    sessionstorage.clear();
    }
    else{
        res.status(200).send("Account Successfully Logout")        
    }
res.status(200).send("Account Successfully Logout")
});
function AuthenticateToken(req,res,next){
    const beareHeader=req.headers['authorization'];
    if(typeof beareHeader!=='undefined'){
        const bearer=beareHeader.split(' ');
        // console.log(bearer[1]);
        req.token=bearer[1];
        if(req.token===sessionstorage.getItem("token")){
        jwt.verify(req.token,process.env.JWT_KEY,(err,auth)=>{
            if(err){
                res.status(502).send({result:err});
            }
            else{
                next();
            }
        })
        }
        else{
            res.status(502).send("Please Again Login")
        }

        }
        else{
            res.status(400).send("token is Expired")
        }
    }
module.exports=route;