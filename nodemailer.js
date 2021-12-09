const nodemailer = require("nodemailer");

//OTP generator

let otp = Math.random();
otp = otp * 100000;
otp = parseInt(otp);


async function sendMail(userObj) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "pk41330@gmail.com", // generated ethereal user
      pass: "qsydvctjacklrubc", // generated ethereal password
    },
  });

 
  

  var Usersubject, Userhtml, Usertext;

  Usersubject = `Otp for registration is:`;
  Userhtml = `<h3>OTP for account verification is</h3> 
  <h1 style='font-weight:bold' >${otp}</h1>
  `;
  Usertext = `Hope you have good time ahead !
            Here are your Details
            Name : ${userObj.name}
            Email : ${userObj.email}`;

  let info = await transporter.sendMail({
    from: '"Food App 🍗" <pk41330@gmail.com>', // sender address
    to: `<${userObj.email}>`, // list of receivers
    subject: Usersubject, // Subject line
    text: Usertext, // plain text body
    html: Userhtml, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

exports.otp = otp;
exports.sendMail = sendMail;
