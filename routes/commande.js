const Notification = require("../models/notification.model");
const Livraison = require("../models/livraisons.model");
const AC = require("../models/ac.model");
const Academie = require("../models/academie.model");
const AHDV = require("../models/ahdv.model");
const Bibliotheque = require("../models/bibli.model");
const Depot = require("../models/depot.model");
const Economat = require("../models/economat.model");
const Emploi = require("../models/emploi.model");
const GH = require("../models/gh.model");
const LSR = require("../models/lsr.model");
const MDS = require("../models/mds.model");
const Merdorp = require("../models/merdorp.model");
const Moxhe = require("../models/moxhe.model");
const Saline = require("../models/saline.model");
const Stock = require("../models/stock-admin.model");
const Thisnes = require("../models/thisnes.model");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASSWORD,
  },
});

module.exports = function (app) {
  app.post("/commandes", async (req, res) => {
    const commandes = req.body;
    console.log("Commandes reçues:", commandes);

    transporter.verify(function (error, success) {
      if (error) {
        console.error("Erreur lors de la configuration SMTP:", error);
      } else {
        console.log("Serveur SMTP prêt pour l'envoi d'emails");
      }
    });

    try {
      for (let commande of commandes) {
        const {
          id,
          commandCount,
          user,
          role,
          name,
          type,
          conditionnemnt,
          reference,
        } = commande;

        // Trouver le produit dans la base de données
        Stock.findOne({ id: id }).then((produit) => {
          let isReference = reference ? `avec la référence ${reference}` : "";
          let isConditionnemnt = conditionnemnt ? `- ${conditionnemnt}` : "";
          let isType = type ? `${type}` : "";
          let isName = name ? `- ${name}` : "";

          let message = `L'utilisateur ${user} a commandé ${commandCount} unités du produit ${isType} ${isName} ${isConditionnemnt} ${isReference}.\n\n`;

          // Ajouter une livraison
          const livraison = new Livraison({
            id: uuidv4(),
            product: `${name} - ${type}`,
            count: commandCount,
            whoAsked: user,
            dateOfAsking: new Date().toLocaleString("fr-FR"),
            status: "En attente",
            location: role,
            whoDelivering: "",
            dateOfDelivery: "",
          });
          console.log(livraison);
          livraison
            .save()
            .then(() => {
              console.log("Livraison enregistrée avec succès");
            })
            .catch((error) => {
              console.error(
                "Erreur lors de l'enregistrement de la livraison:",
                error
              );
            });

          // Écrire les modifications dans la base de données
          notfication = new Notification({
            id: uuidv4(),
            date: new Date().toLocaleString("fr-FR"),
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
            to: "thomas.dussart@hannut.be",
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
