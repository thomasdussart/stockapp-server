const mongoose = require("mongoose");

const economatSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  reference: {
    type: String,
    required: true,
    trim: true,
  },
  conditionnement: {
    type: String,
    required: true,
    trim: true,
  },
  count: {
    type: Number,
    required: true,
  },
  history: {
    type: Array,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Economat", economatSchema);
