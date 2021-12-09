const express = require("express");
const otpRouter = express.Router();
const otp = require("../nodemailer");
const userModel = require("../model/userModel");

otpRouter.route("/signup/verifyotp").post(verifyOtps);

async function verifyOtps(req, res) {
  try {
    if (req.cookies) {
      let { email } = req.cookies;
      console.log(email);
      email = JSON.parse(Buffer.from(email.split(".")[1], "base64").toString());
      let emails = email["email"];
      let data = await userModel.findOne({ email: emails });

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
      } else {
        res.status(401).json({ msg: "otp is incorrect" });
      }
    } else {
      res.status(401).send("Otp timeout");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

module.exports = otpRouter;
