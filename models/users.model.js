const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;

const userSchema = new mongooseSchema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { collection: "users" }
);

module.exports = mongoose.model("Users", userSchema);
