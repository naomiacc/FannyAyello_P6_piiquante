const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

/* Fonction de multer pour enregistrer sur le disk. Nous créons une constante storage , 
à passer à multer comme configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants. */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // null = il n'y a pas eu d'erreur. La fonction destination indique à multer d'enregistrer les fichiers dans le dossier images ;
  },

  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
