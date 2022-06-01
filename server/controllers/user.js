const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs')
const User = require("../models/user");

exports.createUser = (req, res, next) => {
  console.log("hi there");
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Invalid authentication credentials!",
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        console.log("1");
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      fetchedUser = user;
      console.log("req.body.password", req.body.password);
      console.log("user.password", user.password);
      console.log("bcrypt.compare(req.body.password, user.password)",bcrypt.compare(req.body.password, user.password));
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      console.log("2",result);
      if (!result) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      
      var private_key = fs.readFileSync("./jwt_key/jwt_key.pem");
      console.log("private_key",private_key)
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        private_key,
        
        { algorithm: "ES256" },
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      console.log("errr", err)
      return res.status(401).json({
        message: "Invalid authentication credentials!",
      });
    });
};
