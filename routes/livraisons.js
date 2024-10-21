const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Livraison = require("../models/livraisons.model");

module.exports = function (app) {
  app.get("/livraisons", async (req, res) => {
    let livraisons = await Livraison.find({});

    res.json(livraisons);
  });

  app.post("/livraisons", async (req, res) => {
    console.log(req.body);
    // let livraison = new Livraison({
    //   id: uuidv4(),
    //   product: req.body.product,
    //   whoAsked: req.body.whoAsked,
    //   dateOfAsking: new Date(),
    //   status: "En attente",
    //   whoDelivering: req.body.whoDelivering,
    //   dateOfDelivery: req.body.dateOfDelivery,
    // });

    // await livraison.save();

    // res.json(livraison);
  });

  app.patch("/livraisons/:id", async (req, res) => {
    let id = req.params.id;

    const updatedProduct = {
      id: req.params.id,
      status: req.body.status,
      whoDelivering: req.body.whoDelivering,
      dateOfDelivery:
        new Date().toLocaleDateString("fr-FR") +
        " " +
        new Date().toLocaleTimeString("fr-FR"),
    };

    Livraison.findOneAndUpdate({ id: id }, updatedProduct, { new: true })
      .then((product) => {
        console.log(product);
        console.log("updated");
        res.json(product);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
      });
  });
};
