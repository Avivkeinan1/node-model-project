const mongoose = require("mongoose");
const Joi = require("joi");
const JWT = require("jsonwebtoken");
const { JWTSecretToken } = require("../configs/config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 255,
    required: true,
  },

  email: {
    type: String,
    minLength: 8,
    maxLength: 255,
    required: true,
  },
  password: {
    type: String,
    minLength: 6,
    maxLength: 255,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  biz: {
    type: Boolean,
    required: true,
  },
});
userSchema.methods.generateAuthToken = () => {
  return JWT.sign({ _id: this._id, biz: this.biz }, JWTSecretToken);
};

const User = mongoose.model("User", userSchema, "users");

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(8).max(255).email().required(),
    password: Joi.string().min(3).max(255).required(),
    biz: Joi.boolean(),
  });
  return schema.validate(user);
};

module.exports = {
  User,
  validateUser,
};
