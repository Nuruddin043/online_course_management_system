
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.ENV.SEND_GRID_API)
const msg = {
  to: 'mdnuruddin043@gmail.com', // Change to your recipient
  from: 'mdnuruddin04051996@gmail.com', // Change to your verified sender
  subject: 'Confirmation Email',
  html: `<h4>Confirm your email</h4>
        <strong>Here is your registration link:</strong>
        <a href="https://test043.herokuapp.com/leader/register">https://test043.herokuapp.com/leader/register</a>`,
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error.response.body.errors)
  })
