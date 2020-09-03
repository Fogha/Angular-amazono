const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../Models/userSchema");
const config = require("../config");

router.post("/signup", (req, res, next) => {
  let user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.picture = user.gravatar();
  user.isSeller = req.body.isSeller;

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (existingUser) {
      res.json({
        success: false,
        message: "Account with that email already exists",
      });
    } else {
      user.save();
      let token = jwt.sign(
        {
          user,
        },
        config.secret,
        {
          expiresIn: "3d",
        }
      );
      res.json({
        success: true,
        message: "User signed in successfully",
        token,
      });
    }
  });
});

router.post("/login", (req, res, next) => {
  User.findOne(
    {
      email: req.body.email,
    },
    (err, user) => {
      if (err) throw err;
      if (!user) {
        res.json({
          success: false,
          message: "Authentication failed, user not found",
        });
      } else if (user) {
        let validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: "Authentication failed, invalid credentials",
          });
        } else {
          let token = jwt.sign(
            {
              user,
            },
            config.secret,
            {
              expiresIn: "3d",
            }
          );
          res.json({
            success: true,
            message: "Login successful",
            token,
          });
        }
      }
    }
  );
});

module.exports = router;
