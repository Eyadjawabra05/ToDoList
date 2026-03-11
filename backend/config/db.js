const mongoose = require("mongoose");
const dotenv = require('dotenv');

const ConnectDB = async()=>{

     try{
        await mongoose.connect(process.env.URI);
        console.log("Database connected");
        


     }catch(error){
        console.error(`Error connecting to database`,error);
        process.exit(1);
     }
     
};


module.exports = ConnectDB;