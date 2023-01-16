//Voilà, nous avons un middleware qui va authentifier nos requête et transmettre les informations aux middlewares suivants et c'est à dire à nos gestionnaires de routes.

//Pour créer un routeur express, on aura besoin d'express, donc on importe express ici
const express = require('express');

//On crée un routeur avec la méthode routeur d"express
const router = express.Router();

//Nous importans notre middleware d'auth, nouvellement créé
const auth = require('../middleware/auth');

//Nous importons notre middleware multer
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

//On a coupé toutes nos routes de logique qui étaient dans app.js et on les a collés ici. On remplace app.get ou app.post par router.post et routeur.get
//Là, on a les mêmes routes, les mêms logiques que toute à l'heure sauf on a déporté sur un routeur séparé.
//Du coup dans notre fichier de routing, c'est beaucoup plus clair, on voit quelles sont les routes disponibles dans notre application.On voit par le nom des fonctions ce que font ces routes là.
//Et nous mettons les middlewares auth avant les gestionnaires de routes. C'est important de les mettre avant les gestionnaires de routes puisque sinon les gestionnaires de route seont appelés le premier et ne pourra pas effectué le travail effectué par auth. Rajoutant auth sur toutes nos routes car elles ont besoin d'être authentifiées.
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, multer, sauceCtrl.likeSauce);

//On réexporte le routeur de ce fichier là.
module.exports = router;

