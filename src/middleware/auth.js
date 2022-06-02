const async = require("hbs/lib/async");
const { verify } = require("jsonwebtoken");
const jwt = require("jsonwebtoken")
const Register = require("../modules/main")

const auth = async (req, res, next)=>{
    try{
        const token = req.cookies.jwt;
        const varifyUser = jwt.verify(token, process.env.SECREAT_KEY);
        console.log(varifyUser)

        const user = await Register.findOne({_id:varifyUser._id})
        console.log(user.Firstname)
        next()

        // we need to get 

        req.token = token;
        req.user = user;


    }
    catch(error){
        res.status(401).send(error)
    }
}
module.exports= auth;