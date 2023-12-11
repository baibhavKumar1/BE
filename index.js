const PostRouter = require("./Route/post.route");
const UserRouter = require("./Route/user.route");
const connection = require("./db");
const express = require('express');
const app = express();
const cors= require('cors');
app.use(express.json());
app.use(cors());

app.use("/users",UserRouter);
app.use("/posts",PostRouter);

app.get("/",async(req,res)=>{
    res.status(200).send("Home page")
})

app.listen(8000,async()=>{
  try{
    await connection;
    console.log("db is connected on 8000")
  }catch(err){
    console.log(err) 
  }
})