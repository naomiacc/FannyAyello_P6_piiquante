// Une application Express est fondamentalement une série de fonctions appelées middleware.
// Chaque élément de middleware reçoit les objets request et response , peut les lire, les analyser et les manipuler, le cas échéant.
// Le middleware Express reçoit également la méthode next , qui permet à chaque middleware de passer l'exécution au middleware suivant.

const express = require("express");
const app = express();
const mongoose = require("mongoose");

// importation des routeurs
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

const path = require("path");

mongoose
  .connect(
    "mongodb+srv://Fanny:mongodb2104@cluster0.qqcuqqk.mongodb.net/?retryWrites=true&w=majority",
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

//enregistrement des routes
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
