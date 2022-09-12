const User = require("../models/user");
const bcrypt = require("bcrypt"); // hash
const jwt = require("jsonwebtoken");

const passwordValidator = require("password-validator");

// Schéma de validation du mot de passe
const schema = new passwordValidator();
schema
  .is()
  .min(8) // minimum 8 caractères
  .is()
  .max(64) // maximum 64 caractères
  .has()
  .uppercase() // Doit contenir des lettres majuscules
  .has()
  .lowercase() // Doit contenir des lettres minuscules
  .has()
  .digits(1) // Doit contenir au moins 1 chiffre
  .has()
  .not()
  .spaces(); // Ne doit pas avoir d'espace

exports.signup = (req, res, next) => {
  const emailCryptoJs = cryptojs
    .HmacSHA256(req.body.email, process.env.MAIL_CRYPTO_KEY)
    .toString();

  //Vérification de l'intégrité des données
  if (!req.body.password || !req.body.email) {
    return res.status(400).json({ message: "Bad request !" });
  }

  if (!schema.validate(req.body.password)) {
    //Renvoie une erreur si le schema de mot de passe n'est pas respecté
    return res.status(400).json({
      message:
        "Le mot de passe doit contenir au moins 8 caractères, un chiffre, une majuscule, une minuscule et ne pas contenir d'espace !",
    });
  }

  // appel de la fonction bcrypt et demandons de saler 10 fois le mot de passe (fonction asycrone qui renvois une promise dans laquelle ont recoit le hash généré)
  bcrypt
    .hash(req.body.password, 10)
    //dans le .then, création de l'utilisateur et on l'enregistre dans la base de données en renvoyant une reponse de succes
    .then((hash) => {
      const user = new User({
        email: emailCryptoJs,
        emailraw: req.body.email,
        password: hash,
      });

      console.log(user);
      user
        .save()
        .then(() =>
          res
            .status(201)
            .json({ message: "Création de l'utilisateur réussie !" })
        )
        .catch((error) => res.status(400).json(error));
    })
    // reponse .catch, retour d'une erreur si problème
    .catch((error) => res.status(500).json({ error }));
};

/*
 on recupere l'utilisateur de la base qui correspond a l'adresse email entrée
 si l'email n'est pas bon, pas de user recu = erreur
 si ok, on compare le mp entrer au mp associer au user (hash)
 si la comparaison n'est pas bonne = erreur
 si ok, les identifiants sont bons donc on lui renvois son userId et un token */
exports.login = (req, res, next) => {
  // Vérification de l'intégrité des données
  if (!req.body.password || !req.body.email) {
    return res.status(400).json({ message: "Bad request !" });
  }

  const emailCryptoJs = cryptojs
    .HmacSHA256(req.body.email, process.env.MAIL_CRYPTO_KEY)
    .toString();

  User.findOne({ email: emailCryptoJs })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non inscrit !" });
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }

          const userId = user._id.toString();

          res.status(200).json({
            userId: User._id,
            /* Données que l'on veut encoder -> payload. Le UserId est encodé car on ne veut pas qu'un user soit en capacité de modifier 
            les informations d'un autres UserId.*/
            token: jwt.sign({ userId: User._id }, process.env.SECRET_TOKEN, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};
