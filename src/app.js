require('dotenv').config();

const express = require("express");
const bcrypt = require("bcrypt")
const app = express();

const port = process.env.PORT || 3000;
const path = require("path")
const hbs = require("hbs");
const cookie_parser = require("cookie-parser");
const auth = require("./middleware/auth")

//before any name type on form must called this 
app.use(express.json());
app.use(cookie_parser());
app.use(express.urlencoded({extended:false}))

//external Imports
require("./db/conn")
const Register = require("./modules/main");
const async = require("hbs/lib/async");
const { config } = require("process");
const { cookie } = require('express/lib/response');
const { notEqual } = require('assert');


// this Defined path always up to hbs request server
const templets_path2 = path.join(__dirname,"../templets/views")
// console.log(templets_path2)

const partial_path = path.join(__dirname,"../templets/partials")
//always look pathe on hover folder

const pathDefinded = path.join(__dirname,"../public")
// console.log(pathDefinded)


//hbs request to server
app.use(express.static(pathDefinded))
app.set("view engine" , "hbs");
app.set("views", templets_path2)
hbs.registerPartials(partial_path)

// console.log(process.env.SECREAT_KEY);
app.get("/", (req,res)=>{
res.render("index")
})
app.get("/succes", (req,res)=>{
    res.render("succes")
})
app.get("/register", (req,res)=>{
    res.render("register")
})
app.get("/login" , (req,res)=>{
    res.render("login")
})

app.get("/Course" , auth, (req,res)=>{
// console.log(`This is cookies ${req.cookies.jwt}`);

res.render("Course")
})





// // logout page
// app.get("/logout" , auth, async(req,res)=>{
//     try{
//  console.log(req.user)
//   req.user.tokens = req.user.tokens.filter((currentElement)=>{
//       return currentElement.token != req.token
//   })


// //   res.clearCookie("jwt");
//   console.log("logout succesfully")
//   await req.user.save();
//   res.render("login")
//     }catch(error){
//      res.status(404).send(error)
//     // res.send(error)
//     }
// })








// we have to perform CURD Operation 
//created



 app.post("/register" , async(req,res)=>{
     try{

    //   console.log(req.body.Firstname)
    //   res.send(req.body.Firstname)
     const password = req.body.Password;
     const cpassword = req.body.Confirmpassword;

     if (password===cpassword){
         const passVariable = new Register({
             Firstname:req.body.Firstname,
             Lastname:req.body.Lastname,
             Email:req.body.Email,
             gender:req.body.gender,
             Phone:req.body.Phone,
             Age: req.body.Age,
             Password:password,
             Confirmpassword:cpassword

         })
          console.log("the succes part " + passVariable)
         const token = await passVariable.genrateTokenInMiddle();
         console.log(token);

      //Middleware section its must for that
     // we have to provide security and it is defined only befoure save methode ...& its written in Modules

       //cookies

       res.cookie("jwt", token,{
           expires: new Date(Date.now() + 3000000),
           httpOnly:true
       });
       console.log(cookie);
    //    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjkwYWExZTE2ZjY3MDZkOTgzYjBjMWQiLCJpYXQiOjE2NTM2NDc5MDJ9.bmMt63HX5zfMEhKHBTuX7BJx78OOFQnQUXmS669TS3g

       

      const registers = await passVariable.save();
      console.log( registers)
         res.status(201).render("succes")

     }else{
         res.send("Password are not match")
     }
     }catch(e){
         res.status(400).send(e)
     }

 })

// login check
app.post("/login" , async(req,res)=>{
    try{
        const ema = req.body.emaill
        const pass = req.body.passwordd
        // console.log(`${ema} and the passwords is ${pass}`)
        
        const usermail = await Register.findOne({Email:ema})
        // res.send(usermail.Password);
        //here we have to mention our firstly Database names Then type login page 'name'
        // console.log(usermail)

        // this one is secure password match methode

        const isMatch = await bcrypt.compare(pass, usermail.Password)
        //first is login page pass and 2nd is database password compare

        //MiddleWare
        const token = await usermail.genrateTokenInMiddle();
        console.log(token);


        //cookies
        res.cookie("jwt", token,{
            expires: new Date(Date.now() + 30000),
            httpOnly:true
            // secure:true
        });



        //MiddleWare

        if(isMatch){
            // res.send(201).render("index")
          res.render("succes");
        }else{
            res.send("invalid Email")
        }

        // if (usermail.Password===pass){
        //     res.status(201).render("succes")
        // }else{
        //     res.send("Invalid Login")
        // }

    }catch(error){
        res.status(400).send("Invalid Login user and password")
    }
})





app.listen(port, ()=>{
    console.log(`The Server is running on ${port}`)
})