const express = require("express");
const router = express.Router();
const authMW = require("../middleware/auth");
const {
  Card,
  generateBusinessNumber,
  validateCard,
} = require("../models/card");

router.post("/", authMW, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(404).send(error.details[0].message);
    return;
  }
  const card = await new Card({
    ...req.body,
    bizImage:
      req.body.image ||
      "https://cdn.pixabay.com/photo/2015/11/06/13/25/blind-1027860_960_720.jpg",
    bizNumber: await generateBusinessNumber(),
    user_id: req.user_id,
  }).save();
  res.send(card);
});

router.get("/:id", authMW, async (req, res) => {
  const card = await Card.findOne({ _id: req.params.id, user_id: req.user_id });
  if (!card) {
    res.status(404).send("The Card With The specific Id Cannot Be Found");
    return;
  }
  res.send(card);
});

router.put("/:id", authMW, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(404).send(error.details[0].message);
    return;
  }

  const card = await Card.findOneAndUpdate(
    {
      _id: req.params.id,
      user_id: req.user._id,
    },
    req.body,
    { new: true }
  );

  if (!card) {
    res.status(404).send("The Card With The specific Id Cannot Be Found");
    return;
  }
  res.send(card);
});

router.delete("/:id", authMW, async (req, res) => {
  const card = await Card.findOneAndRemove({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card) {
    res.status(404).send("The Card With The specific Id Cannot Be Found");
  }
  res.send(card);
});

router.get("/", authMW, async (req, res) => {
  const card = await Card.find({ user_id: req.user_id });
  if (!card) {
    res.status(404).send("The Card With The specific Id Cannot Be Found");
    return;
  }
  res.send(card);
});

module.exports = router;
