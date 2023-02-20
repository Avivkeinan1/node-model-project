const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  // validate user input
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details);
    return;
  }

  // validate user input
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("Invalid Email");
    return;
  }
  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  console.log(user.password);
  if (!isValidPassword) {
    res.status(400).send("Invalid Password");
    return;
  }
  //process
  const token = user.generateAuthToken();
  //response

  res.send({ token });
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(8).max(255).email().required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(user);
}

module.exports = router;
