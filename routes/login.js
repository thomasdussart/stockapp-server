const express = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/users.model");
const jwt = require("jsonwebtoken");

module.exports = function (app) {
  app.post("/login", (req, res) => {
    const { username, password } = req.body;

    User.find({ username }).then((user) => {
      if (user.length === 0) {
        return res.status(401).json({ message: "Invalid login" });
      }
      const role = user[0].role;
      const hash = user[0].password;
      const match = bcrypt.compareSync(password, hash);
      if (!match) {
        return res.status(401).json({ message: "Invalid login" });
      }
      const token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      User.updateOne(
        { username: username },
        { token: token },
        { role: role }
      ).then(() => {
        res.json({ message: "Logged in", token, user });
      });
    });
  });
};
