const express = require('express');
const router = express.Router();

//Pour configurer le controller ici,il nous faut le userCtrl pour associer les fonctions des différentes routes, c'est dans  /controllers/user
const userCtrl = require('../controllers/user');

//Et on va créer 2 routes, les 2 routes sont les routes post, le 1er sera le /signup, la méthode signup 
router.post('/signup', userCtrl.signup);
//Et le la 2ième sera /login  et on va utilser la fonction login
router.post('/login', userCtrl.login);

//On exporte ce router
module.exports = router;


