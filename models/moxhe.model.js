const mongoose = require("mongoose");

const moxheSchema = new mongoose.Schema(
  {
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
  },
  { collection: "produits-entretien-moxhe" }
);

module.exports = mongoose.model("Moxhe", moxheSchema);
