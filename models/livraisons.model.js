const mongoose = require("mongoose");

const livraisonSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true,
  },
  product: {
    type: String,
    required: true,
    trim: true,
  },
  whoAsked: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfAsking: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  whoDelivering: {
    type: String,
    trim: true,
  },
  dateOfDelivery: {
    type: String,
  },
});

module.exports = mongoose.model("Livraison", livraisonSchema);
