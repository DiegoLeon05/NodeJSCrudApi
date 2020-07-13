const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const SendWelcomeEmail = (email,name) =>{
    const message = {
        to: email,
        from: 'dleon87@hotmail.com',
        subject: 'DLeon',
        text: `Welcome to the app. ${name}. Let me know how you get along with the app`,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(message);
}

const SendCancelationEmail = (email,name) =>{
    const message = {
        to: email,
        from: 'dleon87@hotmail.com',
        subject: 'DLeon Sorry to see you go',
        text: `Good bye ${name}. I hope to see you back cometime soon`,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(message);
}

module.exports = {
    SendWelcomeEmail,
    SendCancelationEmail
};