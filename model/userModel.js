const mongoose = require("mongoose");
const validator = require("email-validator");
const { db_link } = require("../secrets");
const bcrypt = require("bcrypt");

mongoose
  .connect(db_link)
  .then(function (database) {
    // console.log(database);
    console.log("db connected");
  })
  .catch(function (error) {
    console.log(error);
  });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
  },

  email: {
    type: String,
    require: true,
    unique: true,
    validate: function () {
      return validator.validate(this.email);
    },
  },
  createdAt: {
    type: String,
  },
  password: {
    type: String,
    require: true,
    min: 8,
  },

  confirmPassword: {
    type: String,
    require: true,
    min: 8,
   
  },

  otp_Verify: {
    type: String,
    default: "5245",
  },

  isVerified: {
    type: Boolean,
  },
});

//no need of confirmPasword to save in database.
// so, we are actually making it undefined. so it will not save
//this will make confirmPassword undefined before save and post will run after saving
userSchema.pre("save", async function () {
  this.confirmPassword = undefined;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
// (async function createUser() {
//   let user = {
//     name: "Princet",
//     age: 10,
//     email: "abcy@gmail.com",
//     password: "12345678",
//     confirmPassword: "12345678",
//   };

//   const userObj = await userModel.create(user);
//   console.log(userObj);
// })();
