const express = require('express');
const UserRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../Model/user.model');
const BlacklistModel = require('../Model/blacklist.model');

UserRouter.get('/', async (req, res) => {
    res.status(200).send("UserRouter is on");
})

UserRouter.post('/register', async (req, res) => {
    const { name, email, gender, password } = req.body;
    try {
        const exist = await UserModel.findOne({ email });
        if (exist) res.status(400).send("User already registered");
        bcrypt.hash(password, 8, async (err, hash) => {
            const user = new UserModel({
                name, email, gender, password:hash
            });
            user.save();
            res.status(200).json({"Message":"User registered","User":user});
        })
    } catch (err) {
        res.status(400).send(err.message);
    }
});

UserRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await UserModel.findOne({email});
        if(!user){
            res.status(400).send("User not registered");
        }
        bcrypt.compare(password, user.password, async(err,decoded)=>{
            if(!decoded){
                res.status(400).send("Wrong credentials"); 
            }
            //console.log(user._id);
        const token = jwt.sign({"UserID":user._id},"secret");
        res.status(200).json({"Message":"User Logged In","Token":token});
        })
    }
    catch(err){
        res.status(400).send(err.message)
    }
})

UserRouter.post('/logout',async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    await BlacklistModel.updateMany({$push:{token:[token]}});
    res.status(200).send("Logged out");
})

module.exports = UserRouter