const Sauce = require("../models/sauces");
const fs = require("fs");

// Récupration de toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
// Recuperation d'une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json(console.log(error)));
};

// Creation d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  console.log(sauceObject);
  console.log(req.file.filename);

  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  console.log(sauce);

  sauce
    .save()
    .then(() => res.status(201).json({ message: "La sauces à été crée" }))
    .catch((err) => res.status(400).json(err));
};

//modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  console.log("sauce", sauceObject);
  console.log("paramID", req.params.id);

  Sauce.findOne({ _id: req.params.id }) // l'id de la sauce est l'id inscrit dans l'url
    // si la sauce existe
    .then((sauce) => {
      // l'id du créateur de la sauce doit etre le meme que celui identifié par le token
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        // modifie une sauce dans la base de donnée, 1er argument = l'objet modifié avec id correspondant à l'id de la requete
        // 2ème argument = nouvel objet qui contient la sauce du corp de la requete et que _id correspond à celui des paramètres
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // on cherche la sauce de la base de données
    .then((sauce) => {
      // l'id du créateur de la sauce doit etre le meme que celui identifié par le token
      if (sauce.userId !== req.auth.userId) {
        res.status(400).json({ message: "Not authorized" });
      } else {
        // on créer un tableau via l'url en séparant la partie '/images' et on récupère l'indice 1 du tableau qui est le nom
        const filename = sauce.imageUrl.split("/images/")[1];
        // unlink supprime l'image de la sauce
        fs.unlink(`images/${filename}`, () => {
          // supprime une sauce dans la base de donnée, argument = l'objet modifié avec id correspondant à l'id de la requete
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({
                message: "Deleted!",
              });
            })
            .catch((error) => {
              res.status(400).json({
                error: error,
              });
            });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (req.body.like == 1) {
        sauce.usersLiked.push(req.body.userId);
        sauce.likes += req.body.like;
      } else if (req.body.like == -1) {
        sauce.usersDisliked.push(req.body.userId);
        sauce.dislikes -= req.body.like;
      }
      if (
        sauce.usersLiked.indexOf(req.body.userId) != -1 &&
        req.body.like == 0
      ) {
        const likesIndex = sauce.usersLiked.findIndex(
          (user) => user === req.body.userId
        );
        sauce.usersLiked.splice(likesIndex, 1);
        sauce.likes -= 1;
      }
      if (
        sauce.usersDisliked.indexOf(req.body.userId) != -1 &&
        req.body.like == 0
      ) {
        const likesIndex = sauce.usersDisliked.findIndex(
          (user) => user === req.body.userId
        );
        sauce.usersDisliked.splice(likesIndex, 1);
        sauce.dislikes -= 1;
      }
      sauce.save();
      res.status(201).json({ message: "Avis modifié !" });
    })
    .catch((error) => res.status(500).json({ error }));
};
