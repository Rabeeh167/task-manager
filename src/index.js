const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('../src/routers/user-router')
const taskRouter = require('../src/routers/task-router')

const port = process.env.PORT || 3000;

const app = express()
// app.use((req,res,next) =>{
//     res.send("Site Under maintenance!")
// })

app.use(express.json());
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`server started to listen on port ${port}`)
})