const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require('../middleware/auth');

router.post('/tasks', auth, async (req, res)=>{
    try {
        const task = new Task({
            ...req.body,
            TaskOwner: req.user._id
        });
        await task.save();
        res.status(201).send({task});
    } catch (error) {
        res.status(400).send(error);
    }
})
//GET /task?TaskActive=true
//GET /task?limit=10&skip=10
//GET /task?SortBy=createdAt:desc
router.get('/tasks', auth, async (req, res)=>{
    const match = {};
    const sort = {};
    if (req.query.TaskActive){
        match.TaskActive = req.query.TaskActive === 'true';
    }
    if (req.query.sortBy){
        const part = req.query.sortBy.split(":");
        sort[part[0]] = (part[1] === 'desc' ? -1 : 1)
    }
    try {
        await req.user.populate({
            path: 'LstTask',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.LstTask);
    } catch (e) {
        res.status(500).send(e);
    }
})
router.get('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id;
    try {
        const task = await Task.findById({_id, TaskOwner: req.user._id})
        if (!task){
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
})
router.patch('/tasks/:id', auth, async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['TaskDescription', 'TaskActive'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        res.status(400).send("Invalid Updates");
    }
    try {
        const task = await Task.findById({_id, TaskOwner: req.user._id})
        if (!task){
            return res.status('404').send();
        }else{
            updates.forEach((update)=> task[update] = req.body[update]);
            await task.save();
            res.send(task);
        }
    } catch (error) {
        res.status(400).send(error);
    }
})
router.delete('/tasks/:id', auth, async (req, res)=>{
    try {
        const task = await Task.findOneAndDelete({_id, TaskOwner: req.user._id})
        if (!task){
            return res.status('404').send();
        }else{
            res.send(req.task);
        }
    } catch (error) {
        res.status(500).send();
    }
})

// const main = ()=>{
//     const task = await Task.findById('snkjfdjdsfsdf');
//     await task.populate('TaskOwner').execPopulate();

module.exports = router;