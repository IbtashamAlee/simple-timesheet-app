let express = require('express');
let router = express.Router();
let User = require('../models/UserSchema')
const jsonwt = require("jsonwebtoken");
var bcrypt = require('bcrypt')

router.post("/signup", async (req, res) => {
  var newUser = new User({
    email: req.body.email,
    password: req.body.password
  });

  await User.findOne({ email: newUser.email })
      .then(async profile => {
        if (!profile) {
          bcrypt.hash(newUser.password, Math.random(), async (err, hash) => {
            if (err) {
              console.log("Error is", err.message);
            } else {
              newUser.password = hash;
              await newUser
                  .save()
                  .then(() => {
                    res.sendStatus(200);
                  })
                  .catch(err => {
                    console.log("Error is ", err.message);
                  });
            }
          });
        } else {
          res.status(409).send("User already exists...");
        }
      })
      .catch(err => {
        console.log("Error is", err.message);
      });
});

router.post("/signin", async (req, res) => {
  var newUser = {};
  newUser.email = req.body.email;
  newUser.password = req.body.password;

  await User.findOne({ email: newUser.email })
      .then(profile => {
        if (!profile) {
          res.status(404).send("User not exist");
        } else {
          bcrypt.compare(
              newUser.password,
              profile.password,
              async (err, result) => {
                if (err) {
                  console.log("Error is", err.message);
                } else if (result === true) {
                  const payload = {
                      id: profile.id,
                      email: profile.email
                  };
                  jsonwt.sign(
                      payload,
                      process.env.MY_SECRET_KEY || 'thisismymostsecrectkey',
                      { expiresIn: 36000 },
                      (err, token) => {
                        if (err) {
                          console.log("Error is ", err.message);
                        }
                        res.json({
                          success: true,
                          access_token: token
                        });
                      }
                  );
                } else {
                  res.send("User Unauthorized Access");
                }
              }
          );
        }
      })
      .catch(err => {
        console.log("Error is ", err.message);
      });
});

module.exports = router;
