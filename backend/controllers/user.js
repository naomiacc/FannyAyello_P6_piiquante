const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  // appel de la fonction bcrypt et demandons de saler 10 fois le mot de passe (fonction asycrone qui renvois une promise dans laquelle ont recoit le hash généré)
  bcrypt
    .hash(req.body.password, 10)
    //dans le .then, création de l'utilisateur et on l'enregistre dans la base de données en renvoyant une reponse de succes
    .then((hash) => {
      const user = new User({
        email: req.body.email,
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
  User.findOne({ email: req.body.email })
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
            userId: userId,
            token: jwt.sign({ userId: userId }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};
