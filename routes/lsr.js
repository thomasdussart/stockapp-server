const express = require("express");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const LSR = require("../models/lsr.model");
const LSRAdmin = require("../models/stock-admin.model");
const Livraison = require("../models/livraisons.model");
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
  app.get("/products-lsr", async (req, res) => {
    let products = await LSR.find({});

    res.json(products);
  });

  // create a new product
  app.post("/products-lsr", async (req, res) => {
    const { name, price, description } = req.body;
    const id = uuidv4();
    const newProduct = { id, name, price, description };

    const productCreate = new LSR({
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

  app.patch("/products-lsr/:id", async (req, res) => {
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

    LSR.findOneAndUpdate({ id: id }, updatedProduct, { new: true })
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

  app.get("/products-lsr/:id", async (req, res) => {
    const id = req.params.id;
    let product = await LSR.find({ id: id });

    res.json(product);
  });

  // delete a product
  app.delete("/products-lsr/:id", async (req, res) => {
    const id = req.params.id;
    LSR.findOneAndDelete({ id: id }).then((product) => {
      res.json(product);
    });
  });

  // Commandes
  // app.post("/commandes-lsr", async (req, res) => {
  //   const commandes = req.body;
  //   console.log("Commandes reçues:", commandes);

  //   transporter.verify(function (error, success) {
  //     if (error) {
  //       console.error("Erreur lors de la configuration SMTP:", error);
  //     } else {
  //       console.log("Serveur SMTP prêt pour l'envoi d'emails");
  //     }
  //   });

  //   try {
  //     for (let commande of commandes) {
  //       const {
  //         id,
  //         commandCount,
  //         user,
  //         role,
  //         name,
  //         type,
  //         conditionnemnt,
  //         reference,
  //       } = commande;

  //       // Trouver le produit dans la base de données
  //       LSRAdmin.findOne({ id: id }).then((produit) => {
  //         let isReference = reference ? `avec la référence ${reference}` : "";
  //         let isConditionnemnt = conditionnemnt ? `- ${conditionnemnt}` : "";
  //         let isType = type ? `${type}` : "";
  //         let isName = name ? `- ${name}` : "";

  //         let message = `L'utilisateur ${user} a commandé ${commandCount} unités du produit ${isType} ${isName} ${isConditionnemnt} ${isReference}.\n\n`;

  //         // Ajouter une livraison
  //         const livraison = new Livraison({
  //           id: uuidv4(),
  //           product: name,
  //           whoAsked: user,
  //           dateOfAsking: new Date().toLocaleString("fr-FR"),
  //           status: "En attente",
  //           location: role,
  //           whoDelivering: "",
  //           dateOfDelivery: "",
  //         });
  //         console.log(livraison);
  //         livraison
  //           .save()
  //           .then(() => {
  //             console.log("Livraison enregistrée avec succès");
  //           })
  //           .catch((error) => {
  //             console.error(
  //               "Erreur lors de l'enregistrement de la livraison:",
  //               error
  //             );
  //           });

  //         // Écrire les modifications dans la base de données
  //         notfication = new Notification({
  //           id: uuidv4(),
  //           date: new Date().toLocaleString("fr-FR"),
  //           text: message,
  //           isRead: false,
  //         });
  //         notfication
  //           .save()
  //           .then(() => {
  //             console.log("Notification enregistrée avec succès");
  //           })
  //           .catch((error) => {
  //             console.error(
  //               "Erreur lors de l'enregistrement de la notification:",
  //               error
  //             );
  //           });

  //         // Envoyer un e-mail
  //         const mailOptions = {
  //           from: "votre-email@gmail.com",
  //           to: "thomas.dussart@hannut.be",
  //           subject: `Mise à jour du stock pour le produit ${commande.name} - ${role}`,
  //           text: message,
  //         };

  //         transporter.sendMail(mailOptions, (error, info) => {
  //           if (error) {
  //             console.error("Erreur lors de l'envoi de l'email:", error);
  //           } else {
  //             console.log("Email envoyé: " + info.response);
  //           }
  //         });
  //       });
  //     }

  //     res.status(200).send("Commandes traitées avec succès");
  //   } catch (error) {
  //     console.error("Erreur lors du traitement des commandes:", error);
  //     res.status(500).send("Erreur lors du traitement des commandes");
  //   }
  // });

  // app.post("/commandes-avernas", async (req, res) => {
  //   const commandes = req.body;
  //   console.log("Commandes reçues:", commandes);

  //   transporter.verify(function (error, success) {
  //     if (error) {
  //       console.error("Erreur lors de la configuration SMTP:", error);
  //     } else {
  //       console.log("Serveur SMTP prêt pour l'envoi d'emails");
  //     }
  //   });

  //   try {
  //     for (let commande of commandes) {
  //       const {
  //         id,
  //         commandCount,
  //         user,
  //         role,
  //         name,
  //         type,
  //         conditionnemnt,
  //         reference,
  //       } = commande;

  //       // Trouver le produit dans la base de données
  //       LSRAdmin.findOne({ id: id }).then((produit) => {
  //         let isReference = reference ? `avec la référence ${reference}` : "";
  //         let isConditionnemnt = conditionnemnt ? `- ${conditionnemnt}` : "";
  //         let isType = type ? `${type}` : "";
  //         let isName = name ? `- ${name}` : "";

  //         let message = `L'utilisateur ${user} a commandé ${commandCount} unités du produit ${isType} ${isName} ${isConditionnemnt} ${isReference}.\n\n`;

  //         // Ajouter une livraison
  //         const livraison = new Livraison({
  //           id: uuidv4(),
  //           product: name,
  //           whoAsked: user,
  //           dateOfAsking: new Date().toLocaleString("fr-FR"),
  //           status: "En attente",
  //           location: role,
  //           whoDelivering: "",
  //           dateOfDelivery: "",
  //         });
  //         console.log(livraison);
  //         livraison
  //           .save()
  //           .then(() => {
  //             console.log("Livraison enregistrée avec succès");
  //           })
  //           .catch((error) => {
  //             console.error(
  //               "Erreur lors de l'enregistrement de la livraison:",
  //               error
  //             );
  //           });

  //         // Écrire les modifications dans la base de données
  //         notfication = new Notification({
  //           id: uuidv4(),
  //           date: new Date().toLocaleString("fr-FR"),
  //           text: message,
  //           isRead: false,
  //         });
  //         notfication
  //           .save()
  //           .then(() => {
  //             console.log("Notification enregistrée avec succès");
  //           })
  //           .catch((error) => {
  //             console.error(
  //               "Erreur lors de l'enregistrement de la notification:",
  //               error
  //             );
  //           });

  //         // Envoyer un e-mail
  //         const mailOptions = {
  //           from: "votre-email@gmail.com",
  //           to: "thomas.dussart@hannut.be",
  //           subject: `Mise à jour du stock pour le produit ${commande.name} - ${role}`,
  //           text: message,
  //         };

  //         transporter.sendMail(mailOptions, (error, info) => {
  //           if (error) {
  //             console.error("Erreur lors de l'envoi de l'email:", error);
  //           } else {
  //             console.log("Email envoyé: " + info.response);
  //           }
  //         });
  //       });
  //     }

  //     res.status(200).send("Commandes traitées avec succès");
  //   } catch (error) {
  //     console.error("Erreur lors du traitement des commandes:", error);
  //     res.status(500).send("Erreur lors du traitement des commandes");
  //   }
  // });
};
