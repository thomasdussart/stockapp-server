const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/users.model");

module.exports = function (app) {
  app.get("/users", (req, res) => {
    User.find({}).then((users) => {
      res.json(users);
    });
  });

  app.post("/users", (req, res) => {
    const { username, role } = req.body;
    console.log(req.body);
    const id = uuidv4();
    const clearPassword = (Math.random() + 1).toString(36).substring(2);

    const password = bcrypt.hashSync(clearPassword, saltRounds);

    const newUser = { id, username, clearPassword, role };

    lowerRole = role.toLowerCase();
    const userCreate = new User({
      id: id,
      username: username,
      password: password,
      role: lowerRole,
    });
    userCreate
      .save()
      .then((user) => {
        res.json(newUser);
      })
      .catch((err) => {
        console.log("creation failed", err);
        res.status(400).json({ message: "Error" });
      });
  });

  // app.post("/users-create", (req, res) => {
  //   const { username, password, role } = req.body;
  //   console.log(req.body);
  //   const id = uuidv4();

  //   const newUser = new User({
  //     id: id,
  //     username: username,
  //     password: password,
  //     role: role,
  //   });

  //   newUser
  //     .save()
  //     .then((user) => {
  //       res.json(user);
  //     })
  //     .catch((err) => {
  //       console.log("creation failed", err);
  //       res.status(400).json({ message: "Error" });
  //     });
  // });

  app.patch("/users-edit/:id", (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    let updatedUser = {};

    User.find({ id: id }).then((user) => {
      username = user.username;
    });

    if (req.body.username === username) {
      updatedUser = {
        role: req.body.role,
        id: id,
      };
    } else {
      updatedUser = {
        username: req.body.username,
        role: req.body.role,
        id: id,
      };
    }
    console.log(updatedUser);
    User.findOneAndUpdate({ id: id }, updatedUser, { new: true })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(404).json({ message: "Not found" });
      });
  });

  app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    User.findOneAndDelete({ id: id }).then((user) => {
      res.json(user);
    });
  });

  app.patch("/users-reset-password/:id", (req, res) => {
    const id = req.params.id;
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    const updatedUser = {
      password: hashedPassword,
      id: id,
    };
    console.log(updatedUser);
    User.findOneAndUpdate({ id: id }, updatedUser, { new: true })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(404).json({ message: "Not found" });
      });
  });

  //change password
  app.patch("/users-change-password/:id", (req, res) => {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;
    console.log(req.body);
    User.find({ id: id }).then((user) => {
      const match = bcrypt.compareSync(oldPassword, user[0].password);
      if (!match) {
        return res.status(401).json({ message: "Invalid password" });
      }
      const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
      const updatedUser = {
        password: hashedPassword,
        id: id,
      };
      User.findOneAndUpdate({ id: id }, updatedUser, { new: true })
        .then((user) => {
          res.json(user);
        })
        .catch((err) => {
          res.status(404).json({ message: "Not found" });
        });
    });
  });
};
