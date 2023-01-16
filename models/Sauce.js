// On va utilser mongoose pour créer ce schemas et donc on besoin de l'importer ici.On utillie la syntaxe require pour importer mongoose.
const mongoose = require('mongoose');

//On créé un schéma de données qui contient les champs souhaités pour chaque Sauce, indique leur type ainsi que leur caractère (obligatoire ou non). Pour cela, on utilise la méthode Schema mise à disposition par Mongoose. Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose. 
const sauceSchema = mongoose.Schema({
  userId: {type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0, required: true },
  dislikes: { type: Number, default: 0, required: true },
  usersLiked: { type: Array, default: [], required: true },
  usersDisliked: { type: Array, default: [], required: true}
});

//On exporte ce schéma en tant que modèle Mongoose appelé « Sauce », le rendant par là même disponible pour notre application Express.
module.exports = mongoose.model('Sauce', sauceSchema);