const express = require("express");
const otpRouter = express.Router();
const otp = require("../nodemailer");
const userModel = require("../model/userModel");

otpRouter.route("/signup/verifyotp").post(verifyOtps);

// http:localhost:3000/auth/signup/verifyOtp?email=${email}
// decode cookie token

async function verifyOtps(req, res) {
  try {
    if (req.cookies) {
      let { email } = req.cookies;
      console.log(email);
      email = JSON.parse(Buffer.from(email.split(".")[1], "base64").toString());
      let emails = email["email"];
      let data = await userModel.findOne({ email: emails });
      console.log("verify otp 19");
      if (req.body.otp == data.otp_Verify) {
        res
          .status(200)
          .json({ message: "You have been successfully SignedUp" });
        await userModel.updateOne(
          { email: emails },
          { $set: { isVerified: true } }
        );
        await userModel.updateOne(
          { email: emails },

          { $unset: { otp_Verify: "" } }
        );
        console.log("otp 22");

        console.log("otp 24");
      } else {
        console.log("else 26");
        res.status(401).json({ msg: "otp is incorrect" });
        console.log("else 28");
      }
    } else {
      console.log("otp else 31");
      res.status(401).send("Otp timeout");
    }
  } catch (error) {
    console.log("otp 32");
    res.status(401).json({ message: error.message });
  }
}
// res.clearCookies("email");
module.exports = otpRouter;
