// Une application Express est fondamentalement une série de fonctions appelées middleware.
// Chaque élément de middleware reçoit les objets request et response , peut les lire, les analyser et les manipuler, le cas échéant.
// Le middleware Express reçoit également la méthode next , qui permet à chaque middleware de passer l'exécution au middleware suivant.

const express = require("express");
const mongoose = require("mongoose");

// sécurisation des entêtes HTTP
const helmet = require("helmet");
// prévient les attaques par injection de sélecteur de requête MongoDB
const mongoSanitize = require("express-mongo-sanitize");

// sécurisation des cléfs
const dotenv = require("dotenv").config();
console.log(dotenv);

const app = express();

// importation des routeurs
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

const path = require("path");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.n2sa7kc.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// middleware permettant de gérer la requête POST venant de l'application front-end, on a besoin d'en extraire le corps JSON
// Express prend toutes les requêtes qui ont comme Content-Type application/json
app.use(express.json());

// ajout d'un middleware avant la route d'api
// La méthode app.use() permet d'attribuer un middleware à une route spécifique de notre application.
app.use((req, res, next) => {
  // Ces headers permettent d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
  res.setHeader("Access-Control-Allow-Origin", "*");

  // d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );

  // d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Autoriser l'origine croisée pour les images
/* L' en-tête Cross-Origin-Resource-Policy ( CORP ) vous permet de contrôler l'ensemble des origines autorisées à inclure une ressource. 
C'est une défense robuste contre les attaques comme Spectre , car il permet aux navigateurs de bloquer une réponse donnée avant 
qu'elle n'entre dans le processus d'un attaquant. */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(mongoSanitize());

//enregistrement des routes
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
