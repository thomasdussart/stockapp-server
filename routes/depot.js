const express = require("express");
const app = express();
// const dbDepot = require("../db/products-depot.json");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const nodemailer = require("nodemailer");
// const dbDepotAdmin = require("../db/products-depot-admin.json");
const Depot = require("../models/depot.model");
const Notification = require("../models/notification.model");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASSWORD,
  },
});

module.exports = function (app) {
  // get all products
  app.get("/products-depot", async (req, res) => {
    let products = await Depot.find({});

    res.json(products);
  });

  // add product
  app.post("/products-depot", (req, res) => {
    const newProduct = {};

    newProduct.id = uuidv4();
    newProduct.name = req.body.name;
    newProduct.count = req.body.count;
    newProduct.user = req.body.user.username;
    lastChanged =
      new Date().toISOString() + " new Item created by " + newProduct.user;
    newProduct.history = [
      {
        date: lastChanged,
        count: newProduct.count,
      },
    ];
    Depot.create(newProduct);
    res.json(newProduct);
  });

  // update product
  app.patch("/products-depot/:id", async (req, res) => {
    const id = req.params.id;

    const updatedProduct = {
      id: req.params.id,
      name: req.body.name,
      count: req.body.newCount,
      history: [
        ...req.body.history,
        {
          date:
            new Date().toLocaleDateString("fr-FR") +
            " " +
            new Date().toLocaleTimeString("fr-FR") +
            " updated by " +
            req.body.username,
          count:
            req.body.newCount - req.body.previousCount < 0
              ? `-${req.body.previousCount - req.body.newCount}`
              : `+${req.body.newCount - req.body.previousCount}`,
        },
      ],
    };

    Depot.findOneAndUpdate({ id: id }, updatedProduct, { new: true })
      .then((product) => {
        res.json(product);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
      });
  });

  // order products
  app.post("/commandes-depot", async (req, res) => {
    const commandes = req.body;

    transporter.verify(function (error, success) {
      if (error) {
        console.error("Erreur lors de la configuration SMTP:", error);
      } else {
        console.log("Serveur SMTP prêt pour l'envoi d'emails");
      }
    });

    try {
      for (let commande of commandes) {
        const { id, commandCount, user, role, name } = commande;
        console.log("commande", commandCount);
        console.log(commande.count);
        let count = commande.count;

        // Trouver le produit dans la base de données
        DepotAdmin.find({ id: id }).then((produit) => {
          if (!produit) {
            return res.status(404).send(`Produit avec l'ID ${id} non trouvé`);
          }

          let message;

          if (produit.count >= commandCount) {
            // Si le montant demandé est disponible
            message = `Le montant de ${commandCount} a été soustrait par ${user}. Il reste ${count} en stock pour l'item ${name}.`;
          } else {
            // Si le montant demandé est supérieur au montant disponible
            message = `Le montant de ${commandCount} a été soustrait par ${user}. Il reste 0 en stock pour l'item ${name}. Veuillez commander ${Math.abs(
              commandCount - count
            )} de plus.`;
            count = 0;
          }
          console.log(message);
          // Écrire les modifications dans la base de données
          notfication = new Notification({
            id: uuidv4(),
            text: message,
            isRead: false,
          });
          notfication
            .save()
            .then(() => {
              console.log("Notification enregistrée avec succès");
            })
            .catch((error) => {
              console.error(
                "Erreur lors de l'enregistrement de la notification:",
                error
              );
            });

          // Envoyer un e-mail
          const mailOptions = {
            from: "votre-email@gmail.com",
            to: "thomas.dussart@gmail.com",
            subject: `Mise à jour du stock pour le produit ${commande.name} - ${role}`,
            text: message,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Erreur lors de l'envoi de l'email:", error);
            } else {
              console.log("Email envoyé: " + info.response);
            }
          });
        });
      }

      res.status(200).send("Commandes traitées avec succès");
    } catch (error) {
      console.error("Erreur lors du traitement des commandes:", error);
      res.status(500).send("Erreur lors du traitement des commandes");
    }
  });
};
