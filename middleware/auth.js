//Nous allons importer jsonwebtoken
const jwt = require("jsonwebtoken");

//Nous allons exporter une fonction qui sera notre middleware comme tous nos autres middlewares
module.exports = (req, res, next) => {
  //Et nous pouvons commencer à coder sa logique.Alors il nous faut d'abord récupérer le token. Le token comme nous l'avons vu est composé de 2 parties quand il est envoyé par le client, le mot clé bearer puis le token
  try {
    //Maintenant récupérons notre token, pour ce faire, nous allons récupérer le header et le splitter càd dire diviser la chaine de caractère en un tableau autour de notre espace autour de notre mot clé bearer et le token. Et c'est bien le token qui est en deuxième que nous voulons récupérer 
    const token = req.headers.authorization.split(" ")[1];
    //Maintenant que nous avons le token, il faut le décoder, pour cela nous allons faire appel à la méthode verify de jsonwebtoken.Nous lui passons le token que nous avons récupéré ainsi que la clé secrète
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    //En cas d'erreur, pour décoder le token, nous allons donc nous retrouver dans le catch, nous renverrons donc une erreur qui dira au client que son token est invalide
    //Maintenant récupérons le userId, nous allons dans notre token décoder, récupérer sa propriété userId 
    const userId = decodedToken.userId;
    //Et nous allons récupérer cette valeur à l'objet request qui lui est transmis aux routes qui vont être rappelées par la suite  
    req.auth = {
      //Avec un champs userId  
      userId: userId,
    };
    next();
    //Nous allons récupérer l'erreur ici, et en cas de Pb nous enverrons une erreur 401 et nous pasons comme valeur notre erreur, comme ça nous pouvons savoir quelques informations pour savoir d'où vient le Pb.
  } catch (error) {
    res.status(401).json({ error });
  }
};
