const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/formRegistration",{
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    // useCReateIndex:true
}).then(()=>{
    console.log("connection success")
}).catch((e)=>{
    console.log("Connection fail")
})

