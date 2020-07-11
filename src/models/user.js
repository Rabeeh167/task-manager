const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Task = require('./task')

// const { } = require('../routers/user-router');


const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    age:{
        type: Number,
        validate(value){
            if(value<0){
                throw new Error('Age must be a postive number');
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("'password' cannot be a part of password.")
            }
        }
    },
    tokens:[{
        token: {
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps: true
})

//to create a relationaship with task model
userSchema.virtual('myTasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

// for methods on the model
userSchema.statics.findByCredentials = async (email, password) =>{
    console.log("22222222222",email)
    const user = await User.findOne({email: email})

    if(!user){
        throw new Error('Cannot find matching Email')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Invalid Password')
    }
    console.log("LOGGED INNN")
    return user
}

//for methods on the instance and individual users
userSchema.methods.generateAuthToken = async function(){
    // const user = this
    const token = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET)
    console.log("1111111 inside model", token)
    this.tokens = this.tokens.concat({token:token})
    await this.save()
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//Hash the plain text password before saving
userSchema.pre('save', async function(next){
    const user = this
    console.log("just before save called")
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Delete user tasks whn user is removed
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User