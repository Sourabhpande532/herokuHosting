const async = require("hbs/lib/async");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const MongooseSchema = new mongoose.Schema({
   Firstname:{
       type:String,
       required:true
   } ,
   Lastname:{
    type:String,
    required:true
},
 Email:{
    type:String,
    required:true
  ,unique:true  
},

gender:{
    type:String,
    required:true
},

Phone:{
    type:Number,
    required:true,
    unique:true
},
Age:{
    type:Number,
    required:true
},
Password:{
    type:String,
    required:true
},
Confirmpassword:{
    type:String,
    required:true
},
tokens:[{
    token:{
        type:String,
        required:true
    }
}]
})

MongooseSchema.methods.genrateTokenInMiddle = async function(){
try{
        console.log(this._id)
        const token =await jwt.sign({_id:this._id.toString()},process.env.SECREAT_KEY)
        this.tokens = this.tokens.concat({token:token})
        // console.log(token)
        await this.save();
        return token;

    }catch(error){
      res.send( "The error part"+error)
      console.log( "The error part"+error)


}}
 



MongooseSchema.pre("save",async function(next){
    if(this.isModified("Password")){
        // console.log(`The current password is ${this.Password}`)
        this.Password = await bcrypt.hash(this.Password, 10) 

        // this.Confirmpassword = undefined;
          this.Confirmpassword = await bcrypt.hash(this.Confirmpassword,10)
    }
    
    next();
})




// we need create table 

const Register = new mongoose.model("Register", MongooseSchema)

module.exports = Register;







// const jwt = require("jsonwebtoken");

// const createtoken=async()=>{
// const token =await jwt.sign({_id:"628343cfdb5ee6e67d45ee83"}, "secretkeypasskrayachiaheatleastthirtycharcaterdfdfdfdf",{expiresIn : "5 sec"})
// //we have to pass pass object with uniquness  and string in the form of secrete key
// console.log(token)

// const uservar = await jwt.verify(token, "secretkeypasskrayachiaheatleastthirtycharcaterdfdfdfdf")
// console.log(uservar)
// }

// createtoken();

// security 
// prerequi we have to instll npm install bycript


// const userPassword=async(getpassword)=>{
//     const WhatUserExtactlyType = await bcrypt.hash(getpassword,10);
//     console.log(WhatUserExtactlyType);

//     const comparewithDatabasepassword = await bcrypt.compare("pass@123", WhatUserExtactlyType)
//     console.log(comparewithDatabasepassword)
// }
// userPassword("pass@123")


