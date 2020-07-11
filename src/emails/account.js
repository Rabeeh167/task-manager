const sgMail = require('@sendgrid/mail')

const sendgridApiKey = process.env.SENDGRID_API_KEY
sgMail.setApiKey(sendgridApiKey);

const sendWelcomeMail = (email, name) => {
    const msg = {
        to: email,
        from: 'rabeehibrahim167@gmail.com',
        subject: 'Thanks for joining us!',
        text: `Welcome to the Task Manager ${name}, Happy to have you here.`
    };
    sgMail.send(msg);
}

const sendGoodbyeMail = (email, name) => {
    const msg = {
        to: email,
        from: 'rabeehibrahim167@gmail.com',
        subject: `Goodbye ${name}!`,
        text: `Goodbyes are not forever, are not the end; it simply means We'll miss you until we meet again`
    };
    console.log("msg111111111111111",msg)
    sgMail.send(msg);
}

module.exports = {
    sendWelcomeMail,
    sendGoodbyeMail
}