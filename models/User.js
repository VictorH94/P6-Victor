//On importe mongoose comme ceci
const mongoose = require('mongoose');

//On rajoute ce validator comme plugin à notre schema qui s'appelle uniqueValidator et on importe mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

//On va créer notre schéma userSchema comme ceci, en utilisant la fonction schema de mongoose et les informations qu'on va stocker email de type string et un champs requis.Et le mot de pass qui sera un hash et le hash sera également de type string, un mdp crypté et sera un champs requis également.
const userSchema = mongoose.Schema({
  //Rem: plusieurs utilisateur peut se connecter avec la même adresse mail, on rajoute unique:true pour que ce soit impossible de s'inscrire avec la même adresse mail.
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//Dans notre schéma, la valeur unique , avec l'élément mongoose-unique-validator passé comme plug-in, s'assurera que deux utilisateurs ne puissent partager la même adresse e-mail.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);