const express = require("express");
const app = express();

const PORT = 5000;
app.get("/dev",(req,res)=>{
    res.send("Hello From the Developer");
})

app.listen(PORT,()=>{
    console.log(`App Started on http://localhost:${PORT}`);
});