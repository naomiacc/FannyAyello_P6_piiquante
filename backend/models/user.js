const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userModels = mongoose.Schema({
  email: { type: "string", require: "true", unique: true }, // unique true : il est impossible de s'inscrire plusieurs fois avec la même adresse mail
  password: { type: "string", require: "true" }, // mot de passe de l'utilisateur haché
});

userModels.plugin(uniqueValidator);

module.exports = mongoose.model("User", userModels);
