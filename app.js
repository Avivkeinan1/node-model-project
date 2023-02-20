const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const PORT = 3003;
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const cardRouter = require("./routes/card");
const cors = require("cors");

mongoose.set("strictQuery", false);
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/node_js_final_project")
  .then(() => console.log("you are connected"))
  .catch((err) => console.log("can't connect", err));

app.use(morgan("dev"));
app.use(cors());
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/cards", cardRouter);

// app.get("/test", (req, res) => {
//   const practiceUser = new User({
//     name: "aviv",
//     age: 23,
//     email: "avivkenan043@gmail.com",
//     biz: "true",
//     password: "dasdadsa",
//   });
//   practiceUser.save();

//   res.send(practiceUser);
// });

app.listen(PORT, () => console.log(`listening on port${PORT}`));
