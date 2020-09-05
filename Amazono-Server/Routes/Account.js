const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../Models/userSchema");
const config = require("../config");
const checkJwt = require("../Middleware/checkJWT");

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

router
  .route("/profile")
  .get(checkJwt, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      res.json({
        success: true,
        user,
        message: "successful",
      });
    });
  })
  .post(checkJwt, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      if (err) return next(err);

      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;
      if (req.body.isSeller) user.isSeller = req.body.isSeller;

      user.save();
      res.json({
        success: true,
        user,
        message: "Information update successful",
      });
    });
  });

router
  .route("/address")
  .get(checkJwt, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      if (err) return next(err);

      res.json({
        success: true,
        user,
        //address: user.address,
        message: "successful",
      });
    });
  })
  .post(checkJwt, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      if (err) return next(err);

      if (req.body.addr1) user.address.addr1 = req.body.addr1;
      if (req.body.addr2) user.address.addr2 = req.body.addr2;
      if (req.body.city) user.address.city = req.body.city;
      if (req.body.country) user.address.country = req.body.country;
      if (req.body.postalcode) user.address.postalcode = req.body.postalcode;

      user.save();
      res.json({
        success: true,
        address: user.address,
        message: "Address update successful",
      });
    });
  });

module.exports = router;
