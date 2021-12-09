const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../secrets");
let { sendMail } = require("../nodemailer");
let { otp } = require("../nodemailer");
const bcrypt = require("bcrypt");
// const otp = require("../nodemailer");
console.log("val" + otp);

//importing userModel from user
const userModel = require("../model/userModel");

//................................................Routing......................................................

authRouter.route("/signup").post(setCreatedAt, getUserData);

authRouter
  .route("/forgetPassword")
  .get(getForgetPass)
  .post(postForgetPass, validateEmail);

authRouter.route("/login").post(loginUser);

//...............................................functions......................................................

//this is a middleware
function setCreatedAt(req, res, next) {
  let obj = req.body;

  // jo bhi data post se ayegi usme
  //keys ki array ban jayegi or usme uski value ki length store ho jayegi
  //object ki keys ki lenght check kr rah hai
  let length = Object.keys(obj).length;
  if (length === 0) {
    res.status(400).json({
      message: "cannot create user if req.body is empty",
    });
  }
  req.body.createdAt = new Date().toISOString();
  next();
}

async function getUserData(req, res) {
  try {
    let userObj = { ...req.body };

    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, function (saltError, salt) {
      if (saltError) {
        throw saltError;
      } else {
        bcrypt.hashSync(userObj.password, salt, function (hashError, hash) {
          if (hashError) {
            throw hashError;
          } else {
            // console.log("1" + hash);
            userObj.password = hash;
            console.log("1 " + userObj.password);
          }
        });
      }
    });

    //put all data in mongoDB

    const user = await userModel.create(userObj);
    console.log("USer created successfull");

    console.log(user);
    console.log("3");
    let payload = user["email"];

    let token = jwt.sign({ email: payload }, JWT_KEY, { expiresIn: "30s" });

    res.cookie("email", token, { MaxAge: "30000", httpOnly: true });

    let filter = { otp_Verify: "5245" };
    let update = { otp_Verify: otp };
    let dats = await userModel.findOneAndUpdate(filter, update);
    console.log("signup 61");

    sendMail(userObj);
    res.json({
      message: "user signed up succesfullly",
      user: userObj,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
    });
  }
}

function getForgetPass(req, res) {
  res.sendFile("/public/forgetPassword.html", { root: __dirname });
}

function postForgetPass(req, res, next) {
  let data = req.body;

  next();
}
function validateEmail(req, res) {
  console.log("validating email");
}

async function loginUser(req, res) {
  try {
    if (req.body.email) {
      let user = await userModel.findOne({
        email: req.body.email,
        isVerified: "true",
      });
      console.log(user);
      if (user) {
        bcrypt.compare(
          req.body.password,
          user.password,
          function (error, isMatch) {
            if (error) {
              throw error;
            } else if (!isMatch) {
              return res.json({
                message: "email or password is incorrect",
              });
            } else {
              let payload = user["_id"];

              let token = jwt.sign({ id: payload }, JWT_KEY);

              res.cookie("login", token, { httpOnly: true });
              return res.json({
                message: "user loggedIn",
              });
            }
          }
        );
      } else {
        return res.json({
          message: "Please signup first then try to login",
        });
      }
    } else {
      return res.json({
        message: "Please enter a valid email",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = authRouter;
