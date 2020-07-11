const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const multer = require('multer')
const router = express.Router()

const {sendWelcomeMail, sendGoodbyeMail} = require('../emails/account')

// express provides us with this post method to post data 
router.post('/users', (req, res) => {
    console.log(req.body);
    const user = new User(req.body)
    user.save().then((response) => {
        sendWelcomeMail(user.email, user.name)
        user.generateAuthToken()
            .then(token => {
                res.send({ response, token })
                console.log("user", user)
            })
    })
        .catch((err) => {
            res.status(400).send(err)
        })
})

router.get('/users/me', auth, (req, res) => {
    return res.send(req.user)
})

router.get('/user/:id', (req, res) => {
    console.log(req.body);
    const _id = req.params.id;
    const user = new User(req.body)
    User.findById(_id).then((response) => {
        if (!response) {
            return res.status(404).send()
        }
        res.send(response)
        console.log("response", response)
    })
        .catch((err) => {
            res.status(500).send(err)
        })
})

router.patch('/users/me', auth, async (req, res) => {

    try {
        // const user = await User.findById(req.params.id)
        const user = req.user

        const updates = Object.keys(req.body);
        updates.forEach(update => {
            user[update] = req.body[update]
        });
        await user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // if (!user) {
        //     return res.status(404).status.send()
        // }

        res.send(user);
    }
    catch (e) {
        console.log("error", e)
        res.status(500).send(e)
    }

})

router.delete('/delete/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id)
        // if(!user){
        //     return res.status(404).send()
        // }
        const user = await req.user.remove()
        //no need to wait though the process is asynchronous
        sendGoodbyeMail(user.email, user.name)
        res.send(req.user)
    }
    catch (e) {
        res.send(e)
    }
})

router.post('/user/login', async (req, res) => {
    try {
        console.log("111111111111", req.body.password)
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        console.log("userrr", user)
        console.log("token111111", token)
        res.send({ user, token })

    }
    catch (e) {
        res.status(400).send(e)
    }

})

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send()
    }
})
router.post('/user/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send()
    }
})


const upload = multer({
    // dest:'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        console.log("file.originalname", file.originalname)
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image of type jpg, jpeg or png only'))
        }
        cb(undefined, true)
    }
})
// <img src="data:image/jpg;base64,binarydata">
router.post('/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.send({ error: error.message })
})

router.delete('/user/me/avatar/delete', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/user/:id/avatar', async (req, res) => {

    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch (e) {
        res.status(404).send()
    }
})

module.exports = router