const mongoose = require("mongoose");
const { stringify } = require("uuid");

const notificationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      required: true,
    },
  },
  { collection: "notifications-admin" }
);

module.exports = mongoose.model("Notification", notificationSchema);
