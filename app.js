require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.igos1.mongodb.net/attedance?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

const port = process.env.PORT || 4000;

const { authentication } = require("./middleware");

const User = require("./user.model");
const Attendance = require("./attendance.model");

const app = express();
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Success connect to database!");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/register", function (req, res) {
  User.create(req.body)
    .then((data) => {
      res.json({ data });
    })
    .catch((error) => {
      res.json({ error });
    });
});

app.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const hashed = bcrypt.compareSync(password, user.password);

      if (hashed) {
        const payload = { id: user._id, email: user.email };

        const token = jwt.sign(payload, process.env.SECRET_KEY);

        res.json({
          data: {
            token,
            user: payload,
          },
        });
      } else {
        res.json({
          message: "Email or password wrong",
        });
      }
    } else {
      res.json({
        message: "Email or password wrong",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      error: "Oops! Something went wrong",
    });
  }
});

app.get("/", authentication, function (req, res) {
  Attendance.find({})
    .then((data) => {
      res.json({
        data,
      });
    })
    .catch((error) => {
      res.json({
        error: error.message,
      });
    });
});

app.post("/create", authentication, function (req, res) {
  const person = req.body;

  Attendance.create({
    name: person.name,
    address: person.address,
    email: person.email,
    phone: person.phone,
  })
    .then((data) => {
      res.json({
        data,
      });
    })
    .catch((error) => {
      res.json({
        error: error.message,
      });
    });
});

app.patch("/update/:id", authentication, function (req, res) {
  const person = req.body;
  const { id } = req.params;

  Attendance.findOneAndUpdate({ _id: id }, person)
    .then((data) => {
      res.json({
        data,
      });
    })
    .catch((error) => {
      res.json({
        error: error.message,
      });
    });
});

app.delete("/delete/:id", authentication, function (req, res) {
  const { id } = req.params;

  Attendance.findOneAndRemove({ _id: id })
    .then((data) => {
      res.json({
        data,
      });
    })
    .catch((error) => {
      res.json({
        error: error.message,
      });
    });
});

app.listen(port, function () {
  console.log(`Server Ready on http://localhost:${port}`);
});
