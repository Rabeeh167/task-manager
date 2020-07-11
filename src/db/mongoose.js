const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify:false
})



// const me = new User({
//     name:'rabeeeh',
//     email:'mike@abc.com',
//     age: 26,
//     password:'Testpass'
// })

// me.save()
// .then()
// .catch()



// task.save()