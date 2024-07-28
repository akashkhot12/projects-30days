const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config()


app.get('/',(req,res)=>{
    res.json({msg:"hello world"})
})

app.listen(PORT,()=>{
    console.log("server is running....");
})


// connected mongo db 

const URI = process.env.MONGODB_URL;

mongoose.connect(URI,{
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});