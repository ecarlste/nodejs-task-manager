const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'ecarlste@gmail.com',
    subject: 'Thanks for choosing my task manager app!',
    text: `Welcome to the app, ${name}. Please let me know how you get along with the app.`
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'ecarlste@gmail.com',
    subject: "We're sorry to see you go!",
    text: `Thanks so much for trying out our task management app, ${name}. We're constantly trying to improve and your feedback on how we can do this is invaluable. Please let us know what we could have done to make this app more useful for you!`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
};
