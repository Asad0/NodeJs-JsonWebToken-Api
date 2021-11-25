const mongo=require("mongoose");
var users=mongo.Schema({
    _id:mongo.Types.ObjectId,
    Firstname:{
        type:String,
        require:true
    },
    Lastname:{
        type:String,
        require:true
    },
    username:{
        type:String,
        unique: true,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    confirmPassword:{
    type:String,
    require:true
    }

})
module.exports=mongo.model("user_Db",users)