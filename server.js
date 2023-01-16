//On écrit un programme, les code Javascript côté serveur qui va attendre, qui va écouter les requêtes HTTP et qui va répondre. Donc pour ça, la première chose à faire est d'importer le parkage HTTP de Node. Require, la commande pour importer le parkage http. Maintenant, on a accès à cet objet http qui nous permet de créer un serveur.
//La première chose que l'on fait pour créer un serveur node.js, c'est de faire appel à un parquet npm, un parkage HTTP qui permet de lancer un serveur tout simplement, après on écoute sur ce serveur un ceratin port, par défaut c'est le port 3000
const http = require('http');

//On importe et on configure le dotenv, cela permet d'utiliser les variables d'environnment qui sont dans .env
require('dotenv').config();

//on importe le app.js qui est dans le même dossier. On fait appel à un script interne qui s'appelle app qui est en fait notre module express.Donc on le fait charger dans le serveur node.js
const app = require('./app');

//Il y a une certaine partie du code qui permet de faire charger soit les variables d'environnement pour donner une valeur par défaut au serveur ou de normaliser
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//ou rendre la valeur d'entrée correspondant à ce qui est attendu par le serveur qui écoute 
const port = normalizePort(process.env.PORT || '3000');
//On doit dire à l'application express, sur quel port, elle va tourner donc pour ça, on utilise la méthode app.set
app.set('port', port);

//Il y a une petite fonction en cas d'erreur sur les coups du serveur.Donc à l'erreur, il exécute cette fonction 
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// On crée une constante server et on va appeller la méthode createServer() du parkage http, et cette méthode prend comme argument, la fonction app qui sera appelés à chauqe requête recçue par le serveur. Donc à chaque fois, on va envoyer une requête à ce serveur, cette fonction là sera appelée.
//On va demander à notre serveur, on va lui passer cette application
const server = http.createServer(app);

//A l'erreur, il exécute cette fonction et quand il écoute, il exécute cette fonction
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// ce serveur doit attendre et écouter les requêtes envoyées, on met le N° du port qu'on veut écouter ex: server.listen(3000). Par défaut en développement, on va utiliser le port 3000, mais il y a des cas où le port 3000 n'est pas disponible et dans ce cas là, il faut utiliser une variable environnement qui est process.env.PORT
server.listen(port);