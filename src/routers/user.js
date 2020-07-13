const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require('../middleware/auth');
const multer =require("multer");
const sharp = require('sharp');
const {SendWelcomeEmail, SendCancelationEmail} = require('../emails/account')

router.post('/users', async (req, res)=>{
    const user = new User(req.body);
    try {
        await user.save();
        SendWelcomeEmail(user.UserEmail, user.UserName)
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/users/login', async (req, res)=>{
    try {
        const params = Object.keys(req.body);
        const allowedUpdates = ['UserEmail', 'UserPassword'];
        const isValidOperation = params.every((param) => allowedUpdates.includes(param));
        if(!isValidOperation){
            res.status(400).send("You must indicate de email and password.");
        }else{
            const user = await User.findByCredentials(req.body.UserEmail, req.body.UserPassword);
            const token = await user.generateAuthToken();
            res.status(201).send({user, token});
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/users/me', auth, async (req, res)=>{
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).send();
        
    }
})

router.post('/users/logout', auth, async (req, res)=>{
    try {
        req.user.UserTokens = req.user.UserTokens.filter((token)=>{
            token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

router.post('/users/logoutall', auth, async (req, res)=>{
    try {
        req.user.UserTokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

router.get('/users/:id',  async (req, res)=>{
    const _id = req.params.id;
    try {
        const user = await User.findById(_id)
        if (!user){
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
})

router.patch('/users/:id', auth, async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['UserName', 'UserEmail', 'UserPassword', 'UserAge'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        res.status(400).send("Invalid Updates");
    }
    // const _id = req.params.id;
    try {
        // const user = await User.findById(_id);
        // updates.forEach((update)=>user[update] = req.body[update]);
        // const user = await User.findByIdAndUpdate(_id, req.body, {new:true, runValidators:true})
        // if (!user){
        //     return res.status(404).send();
        // }
        updates.forEach((update)=>req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/users/me', auth, async (req, res)=>{
    // const _id = req.user._id;
    try {
        // const user = await User.findByIdAndDelete(_id)
        // if (!user){
        //     return res.status(404).send();
        // }
        req.user.remove();
        console.log(req.user);
        SendCancelationEmail(req.user.UserEmail, req.user.UserName);
        res.send(req.user);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
})

const upload = multer({
    // dest:'avatars',
    limits:{
        fileSize: 1000000 //bytes
    },
    fileFilter(req,file,cb){
        // if(!file.originalname.endsWith('.pdf')){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must be a image'));
        }else{
            cb(undefined,true);
        }
        // cb(new Error('File must be a PDF'));
        // cb(undefined,true);
        // cb(undefined,false);
    }
})

router.post('/users/me/avatar',  auth, upload.single('avatar'), async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer();
    req.user.UserAvatar = req.file.buffer;
    req.user.UserAvatar = buffer;
    await req.user.save();
    res.send();
},(error, req, res, next) =>{
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar',  auth, async (req,res)=>{
    req.user.UserAvatar = undefined;
    await req.user.save();
    res.send();
},(error, req, res, next) =>{
    res.status(400).send({ error: error.message })
})

router.get('/users/:id/avatar',  async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.UserAvatar){
            throw new Error ("Avatar not found");
        }else{
            res.set('Content-Type', 'image/jpg');
            res.send(user.UserAvatar);
        }
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
},(error, req, res, next) =>{
    res.status(400).send({ error: error.message })
})

module.exports = router;