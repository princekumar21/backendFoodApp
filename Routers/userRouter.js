const express = require("express");
const userRouter = express.Router();
const userModel = require("../model/userModel");
const protectRoute = require('./authHelper')

let user = [];

userRouter
  .route("/")
  .get(protectRoute, getUsers)
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser);

async function getUsers(req, res) {
  try {
    let users = await userModel.find();
    if (users) {
      res.json(users);
    } else {
      res.json({
        message: "user not found",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
  
}



// app.post("/user", createUser);

function createUser(req, res) {
  user = req.body;
 
  res.send("data has been uploaded succesfullly");
}

// app.patch("/user", updateUser);

function updateUser(req, res) {
  let obj = req.body;
  for (let key in obj) {
    user[key] = obj[key];
  }
  res.json(user);
}

// app.delete("/user", deleteUser);

function deleteUser(req, res) {
  user = {};
  res.send(user);
}

userRouter.route("/:id").get(getUserById);

// app.get("/user/:id", getUserById);

function getUserById(req, res) {
 
  // res.send(req.params)
  res.send(req.params.id);
}

module.exports = userRouter;
