const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/tasks', auth, async (req, res) => {
    console.log(req.body);
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        "owner":req.user._id
    })
    try {
        await task.save()
        res.send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
    // task.save().then((response) => {
    //     res.send(response)
    //     console.log("task", task)
    // })
    //     .catch((err) => {
    //         res.status(400).send(err)
    //     })
})

router.get('/tasks', auth, async (req, res) => {
    try {
        const match = {}
        const sort = {}
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            console.log("partassss",parts)
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        // const tasks = await Task.find({owner: req.user._id})
        console.log("sort",sort)
        await req.user.populate({
            path:'myTasks',
            match:match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.myTasks)
    }
    catch (e) {
        console.log("eeeeeee",e)
        res.status(400).send(e)
    }
    // Task.find({}).then((response) => {
    //     res.send(response)
    //     console.log("response", response)
    // })
    //     .catch((err) => {
    //         res.status(400).send(err)
    //     })
})

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id:_id, owner:req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (e) {
        console.log("errorrrr",e)
        res.status(500).send(e)
    }
    // Task.findById(_id).then((response) => {
    //     if (!response) {
    //         return res.status(404).send()
    //     }
    //     res.send(response)
    //     console.log("response", response)
    // })
    //     .catch((err) => {
    //         res.status(500).send(err)
    //     })
})

router.patch('/task/:id', auth, async (req, res) => {
    try{
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        const task = await Task.findOne({_id: req.params.id, owner:req.user._id})
        console.log("task111111",task)
        if(!task){
           return res.status(404).send()
        }
        await task.save()
        res.send(task)
    }
    catch(e){
        console.log("error111",e)

        res.send(e)
    }
})

router.delete('/task/delete/:id', auth, async(req, res) =>{
    try{
        const task = await Task.deleteOne({_id: req.params.id, owner: req.user._id})
        console.log("taskkk",task)
        if(!task || task.deletedCount === 0){
            return res.status(404).send()
        }
        res.status(200).send(task)
    }
    catch(e){
        res.status(500).send()
    }
})
module.exports = router