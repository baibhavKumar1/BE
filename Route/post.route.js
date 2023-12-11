const express= require('express');
const PostRouter = express.Router();
const jwt= require('jsonwebtoken');
const UserModel = require('../Model/user.model');
const PostModel = require('../Model/post.model');
const auth = require('../Middleware/auth.middleware');

PostRouter.use(auth);

PostRouter.get('/',async(req,res)=>{
    const {device,device2}= req.query;
    const user = req.body.UserID;
    try{
        const data= [];
        if(device && device2){
            const post = await PostModel.find({user,device});
            const post2 = await PostModel.find({user,device2});
            data.push(post);
            data.push(post2);
        }
        else if(device){
            const post = await PostModel.find({user,device});
            data.push(post);
        }
        else {
            const post = await PostModel.find({user});
            data.push(post);
        }
        res.status(200).send(data)
    }
    catch(err){
        res.status(400).send(err.message)
    }
})

PostRouter.post('/add',async(req,res)=>{
    const {title,body,device} = req.body;
    try{
        const post = await PostModel.findOne({title});
        if(post) res.status(400).send("Post already available");
        const newPost = new PostModel({
            title,body,device,UserID:req.body.UserID
        });
        newPost.save()
        res.status(200).json({"message":"Posted",newPost})
    }catch(err){

    }
})

PostRouter.patch('/update/:id',async(req,res)=>{
    const {id} = req.params;
    try{
        const post = await PostModel.findById(id);
        const user = req.body.UserID;
        if(post.UserID == user){
            await PostModel.findByIdAndUpdate(id,{...req.body});
            res.status(200).send("Post updated")
        }else{
            res.status(400).send("Not authorized");
        }
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

PostRouter.delete('/delete/:id',async(req,res)=>{
    const {id} = req.params;
    try{
        const post = await PostModel.findById(id);
        const user = req.body.UserID;
        if(post.UserID == user){
            await PostModel.findByIdAndDelete(id);
            res.status(200).send("Post deleted")
        }else{
            res.status(400).send("Not authorized");
        }
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

module.exports = PostRouter;