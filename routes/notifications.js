const express = require("express");
const Notifications = require("../models/notification.model");
const nodemailer = require("nodemailer");

module.exports = function (app) {
  // get all notifications
  app.get("/notifications", (req, res) => {
    Notifications.find({}, null, { sort: { date: -1 } })
      .then((notifications) => {
        res.json(notifications);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // get 1 notification by id
  app.get("/notifications/:id", (req, res) => {
    const id = req.params.id;
    Notifications.findOne({ id: id })
      .then((notification) => {
        res.json(notification);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // mark notification as read
  app.patch("/notifications/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    Notifications.findOneAndUpdate({ id: id }, { isRead: true })
      .then((notification) => {
        console.log(notification);
        res.json(notification);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  //mark all notifications as read
  app.patch("/notifications", (req, res) => {
    Notifications.updateMany({ isRead: false }, { isRead: true })
      .then((notifications) => {
        res.json(notifications);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
