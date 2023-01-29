//On aura besoin de express dans notre app.js donc on va l'importer ici.
const express = require('express');
const app = express();

//Importation de body-parser
const bodyParser = require('body-parser');

//Importation de helmet. Helmet nous aide à sécuriser notre application Express en définissant divers en-têtes HTTP
const helmet = require('helmet');

//helmet fonction de niveau supérieur est un wrapper autour de 15 middlewares plus petits.
app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());    
app.use(helmet.crossOriginOpenerPolicy());
// app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

//Après avoir installé mongoose avec la commande npm install mongoose dpuis le terminal, on crée une constante mongoose et on importe mongoose ici
const mongoose = require('mongoose');

//On va importer le router 
const sauceRoutes = require('./routes/sauce');

//On importe ce router
const userRoutes = require('./routes/user');

const path = require('path');

//Connexion à la base de donnée MongoDB
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.jmndp2e.mongodb.net/P6?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//On créé une constante app qui sera notre application, qui ne contient rien pour le moment. On fait appelle à la méthode express, ce qui permet de créer une application express


//LES MIDDLEWARES:
// On a tout ce qui est CORS. On rajoute le 1er middleware qui sera exécuté par le server, il s'agit d'un middlewre générale, on ne va pas mettre une route spécifique, ce middleware sera appliqué à toutes les routes, à toutes les requêtes envoyées à notre serveur.
//ça c'est concernant les interconnections, les différentes connexions entre les différents serveurs, parce que les HTTP font en sorte que les connexions du serveur soient sécurisés.ça c'est pour permettre qu'ils ne soient pas sécurisés.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Parse le body des requetes en json
app.use(bodyParser.json());

//Ce que ce middleware fait, c'est qu'il intercepte toutes les requêtes qui ont un content type json, qui contient du json et nous met à disposition ce contenu, ce corps de la requête sur l'objet de requête dans req.body. Pour avoir accès au corps de la requête
app.use(express.json());
//Ici avant, on avait le app.get, app.use. Là, on va simplment dire app.use, le début de la route /api/stuff et on va dire pour cette route là, on utilse le routeur qui est exposé par stuff route. Tout la logique qui était là avant qui polluait notre app.js est maintenant importé et ompliqué à la même route. Et ce qui est importé, c'est le routeur qui est exporté par le stuff.js dans route.
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
//On rajoute ici une route qui va servir des fichiers statiques, nous rajoutons une route pour l'image et nous allons utiliser le middleware statique qui est fourni par express, il nous faut récupérer le repertoire dans lequel s'exécute notre serveur et y concaténer le reepertoire image pour obtenir le chemin complete sur le disque.
app.use('/images', express.static(path.join(__dirname, 'images')));

//On exporte cette application, cette constante app pour que l'on puisse y accéder depuis les autres fichiers, de notre projet, notamment notre serveur node.
module.exports = app;