const { response } = require("express");
const express = require("express");
const app = express();

//if we want to access cookies through request then we have to use cookie-parser 
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());



app.listen("5000", () => {
  console.log("listening to 5000");
});

//middleware
app.use((req, res, next) => {
  // console.log("I am a middleware");
  next();
});

app.use(express.static("public"));

const authRouter = require("./Routers/authRouter");
const userRouter = require("./Routers/userRouter");
const otpRouter = require("./OTP/verifyOtp");

app.use((req, res, next) => {
  // console.log("I am a 2nd middleware");
  next();
});

//mounting in express
app.use("/user", userRouter);

app.use("/auth", authRouter);

app.use("/auth", otpRouter);

app.get("/", (req, res) => {
  res.send("Home Page");
});

//redirect
app.get("/user-all", (req, res) => {
  res.redirect("/user");
});

// 404 page
app.use((req, res) => {
  res.sendFile("public/404.html", { root: __dirname });
});
