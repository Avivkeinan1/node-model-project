const express = require("express");
const router = express.Router();
const authMW = require("../middleware/auth");
const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/me", authMW, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).select("password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(404).send(error.details[0].message);
    return;
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("User Already Register");
    return;
  }
  user = await new User({
    ...req.body,
    password: await bcrypt.hash(req.body.password, 15),
  }).save();

  res.send(user);
});

module.exports = router;
