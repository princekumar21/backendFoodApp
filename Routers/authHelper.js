const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../secrets");

// let flag = false;
function protectRoute(req, res, next) {
  try {
    if (req.cookies.login) {
      let isVerified = jwt.verify(req.cookies.login, JWT_KEY);
      if (isVerified) {
        next();
      } else {
        return res.json({
          message: "Not authorized",
        });
      }
    } else {
      return res.json({
        message: "opeation not allowed",
      });
    }
  } catch (error) {
    rs.json({
      message: error.message,
    });
  }
}

module.exports = protectRoute;
