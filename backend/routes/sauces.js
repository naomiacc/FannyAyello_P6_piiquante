const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const saucesCtrl = require("../controllers/sauces");

router.get("/", auth, saucesCtrl.getAllSauces); // renvoie un tableau de toutes les sauces de la base de données
router.get("/:id", auth, saucesCtrl.getOneSauce); // renvoie la sauce avec l'_id fourni
router.post("/", auth, multer, saucesCtrl.createSauce); // enregistre la sauce dans la base de données (en chaine de caractères) avec son imageUrl
router.put("/:id", auth, multer, saucesCtrl.modifySauce); // met à jour la sauce avec l'_id fourni
router.delete("/:id", auth, saucesCtrl.deleteSauce); // supprime la sauce avec l'_id fourni
router.post("/:id/like", auth, saucesCtrl.likeSauce); // définit le statut like pour l'userId fourni

module.exports = router;
