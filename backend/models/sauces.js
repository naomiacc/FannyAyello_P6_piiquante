const mongoose = require("mongoose");

const saucesModels = mongoose.Schema({
  userId: { type: "string", require: true },
  name: { type: "string", require: true },
  manufacturer: { type: "string", require: true },
  description: { type: "string", require: true },
  mainPepper: { type: "string", require: true },
  imageUrl: { type: "string", require: true },
  heat: { type: "number", require: true },
  likes: { type: "number", default: 0 },
  dislikes: { type: "number", default: 0 },
  usersLiked: { type: "array", default: ["string"] },
  usersDisliked: { type: "array", default: ["string"] },
});

module.exports = mongoose.model("Sauces", saucesModels);
