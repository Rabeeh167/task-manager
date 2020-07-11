const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({'_id': decodedToken._id, 'tokens.token': token})
        if(!user){
           return res.status(404).send()
        }
        req.token = token;
        req.user = user;
        next()             

    }
    catch(e){
        res.status(500).send(e);
    }
}

module.exports = auth