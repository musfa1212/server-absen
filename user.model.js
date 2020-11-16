const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(this.password, salt);

  this.password = hash;
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
