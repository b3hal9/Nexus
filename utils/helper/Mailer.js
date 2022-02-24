const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'b3hal9@gmail.com',
    pass: 'MYNAM3ISKHAN',
  },
})

module.exports = (email, code) => {
  const options = {
    from: 'b3hal9@gmail.com',
    to: email,
    subject: 'Police Management System',
    text: `Password reset code:${code}. Please verify your account if this wasnot you. `,
  }

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err)
      return
    }
    console.log(info.response)
    return info.response
  })
}
