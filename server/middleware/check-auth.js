const jwt = require("jsonwebtoken");
const fs = require('fs')
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("process.env.JWT_KEY",process.env.JWT_KEY)
    console.log("token",token)
    var private_key = fs.readFileSync("./jwt_key/jwt_key.pem");
    const decodedToken = jwt.verify(token, private_key,{ algorithms: ['ES256'] });
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    console.log("req.userData",req.userData)
    next();
  } catch (error) {
    console.log("errorWWW",error)
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
