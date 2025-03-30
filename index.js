const express = require("express");
const path = require("path");
require("dotenv").config();
const { connectToMongoDB } = require("./connection");

// Connection to MongoDB
connectToMongoDB("mongodb://127.0.0.1:27017/BloggingApp")
    .then(() => console.log("Connected To MongoDB Successfully"))
    .catch((err) => {
        console.log("err : ", err);
    });

const app = express();
const PORT = 5000;
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));


const userRoute = require("./routes/user");
const staticRoute = require("./routes/staticRoutes");

app.set("view engine","ejs"); 
app.set("views",path.resolve("./views"))

app.use("/user",userRoute);
app.use("/",staticRoute);

app.get("/dev",(req,res)=>{
    return res.send("Hello From the Developer");
})
app.get("/",(req,res)=>{
    return res.render("home");
})

app.listen(PORT,()=>{
    console.log(`Server Started on http://localhost:${PORT}`);
});