const express = require("express");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const Saline = require("../models/saline.model");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASSWORD,
  },
});

module.exports = function (app) {
  // get all products
  app.get("/products-saline", async (req, res) => {
    let products = await Saline.find({});

    res.json(products);
  });

  // create a new product
  app.post("/products-saline", async (req, res) => {
    const { name, price, description } = req.body;
    const id = uuidv4();
    const newProduct = { id, name, price, description };

    const productCreate = new saline({
      id: id,
      name: name,
      price: price,
      description: description,
    });

    productCreate
      .save()
      .then((product) => {
        res.json(newProduct);
      })
      .catch((err) => {
        res.status(400).json({ message: "Error" });
      });
  });

  // edit a product

  app.patch("/products-saline/:id", async (req, res) => {
    const id = req.params.id;

    console.log(req.body);

    const updatedProduct = {
      id: req.params.id,
      name: req.body.name,
      count: req.body.count,
      history: [
        ...req.body.history,
        {
          date:
            new Date().toLocaleDateString("fr-FR") +
            " " +
            new Date().toLocaleTimeString("fr-FR") +
            " par " +
            req.body.username,
          count:
            req.body.count - req.body.previousCount < 0
              ? `-${Math.abs(req.body.previousCount - req.body.count)}`
              : `+${Math.abs(req.body.count - req.body.previousCount)}`,
        },
      ],
    };

    Saline.findOneAndUpdate({ id: id }, updatedProduct, { new: true })
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

  app.get("/products-saline/:id", async (req, res) => {
    const id = req.params.id;
    let product = await Saline.find({ id: id });

    res.json(product);
  });

  // delete a product
  app.delete("/products-saline/:id", async (req, res) => {
    const id = req.params.id;
    Saline.findOneAndDelete({ id: id }).then((product) => {
      res.json(product);
    });
  });
};
