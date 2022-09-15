const mongoose = require("mongoose");

const saucesModels = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: { type: [String], default: [] },
  usersDisliked: { type: [String], default: [] },
});

module.exports = mongoose.model("Sauces", saucesModels);
