const mongoose = require('mongoose');
const dotenv = require('dotenv') ;
dotenv.config();

//access dotenv url value
const Url = process.env.URL;

//connect to mongodb using mongoose
module.exports.connectUsingMongoose = async ()=>{
    try{
        await  mongoose.connect(Url)
     console.log("connected using mongoose")
 }catch(err){
        console.log(err)
        console.log("failed to connect using mongoose")
      
 }
 }
