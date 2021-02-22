const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: 'mastahwasta@gmail.com',
    pass: 'Ble40%ble',
  },
  secure: true,
});


exports.emailTransporter = function(mailData) {
  return transporter.sendMail(mailData, function (err, info) {
    if(err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });
}