//après l'installation de bcrypt dans la terminal avec la commande npm install --save bcrypt, on importe bcrypt ici
const bcrypt = require('bcrypt');

//Après l'installation du parkage dans le terminal avec la commande npm install --save jsonwebtoken, on importe jsonwebtoken ici.
const jwt = require('jsonwebtoken');

//Donc on aura besoin de notre modèle user car on  va enregistrer et lire dans ce middleware
const User = require("../models/User");

//Au niveau de nos middlewaes d'authentification, on va commencer par la méthode signup pour la création de nos user dans la base de données à partir de la connexion de l'inscription dpuis l'application frontend. 
//Dans le signup, la première chose à faire est de hasher le mot de pass. Et avec le mot de passe créé par bcrypt, on va enregistrer le user dans la base de donnée 
//Là, on a notre fonction signup qui va crypter le mdp qui va prendre ce mdp crypté, qui va créé un nouveau user avec ce mdp crypté et l'adresse mail passé dans le corps de la requête et va enregistrer cet utilisateur dans la base de donnée.
exports.signup = (req, res, next) => {

     //On commence par appeler bcrypt.hash(), c'est la fonction pour crypter, pour hasher le mdp, on  va lui passer le mdp du corps de la requête qui sera passé par le frontend, 10 c'est le solde combien de fois, on exécute l
     //On commence par appeler bcrypt.hash, c'est la fonction pour hasher, pour crypter un mot de passe, on va lui passer le mdp du corps de la requête qui sera passer par le frontend,le solde c'est combion de fois on exécute l'algorithme de  hashage, là on va faire 10 tours, ça suffit pour faire un mdp sécurisé.Comme c'est de la méthode asynchrone, donc on aura un bloc then et un bloc catch 
     bcrypt.hash(req.body.password, 10)
      //Ici on va récupérer le hash du mdp qu'on va ensutte enregistrer dans un nouveau user qu'on va enregistrer dans la base de donnée.
      .then(hash => {
        //on va créer ce nouveau utilisateur avec notre modèle mongoose 
        const user = new User({
          //Comme l'adresse email, on va fournir l'adresse qui est founie dans le corps de la requpete 
          email: req.body.email,
          //Et comme le mdp, on va lui passer le mdp crypté afin de ne pas stocker de mdp en blanc.
          password: hash
        });
        //Et maintenant comme le thine, on va enregistrer avec la méthode save() de notre user pour l'enregistrer dans la base de donnée
        user.save()
          //Dans le then, on va simplement renvoyer un 201 pour une cr&ation de ressource et on va renvoyer le message utilisateur créé.
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      //Dans le bloc catch, on va capter l'erreur, là on va dire que c'est une erreur 500, une erreur serveur et on va envoyer comme d'habitude l'erreur dans un objet.
      .catch(error => res.status(500).json({ error }));
};

//Il nous faudra la fonction login pour connecter les utilisateurs existants
//Maintenant que nous pouvons créer des utilisateurs dans la base de données, il nous faut une méthode permettant de vérifier si un utilisateur qui tente de se connecter dispose d'identifiants valides. Implémentons donc notre fonction login
//Nous allons maintenant implémenter une fonction login qui va nous permettre de vérifier si un utilisateur exite dans notre base de donnée et si le mdp transmis par le client correspond à cet utilisateur.Pour ce faire, c'est très simple,  
exports.login = (req, res, next) => {
  //Nous allons utiliser la méthode findOne() de notre classe user et nous lui passons un objet qui va lui servir de filtre càd de sélecteur avec un champs email et la valeur qui nous a été transmise par le client.Il nous faut gérer 2 cas puisqu'il s'agit d'une promesse qui est retourné par findOne, il y a le cas then quand la méthode est réussie et le cas avec catch lorsqu'il y a une erreur.
  User.findOne({ email: req.body.email })
      //Nous récupérons donc la valeur qui a été trouvée par notre requête.
      .then(user => {
          //Nous allons vérfiier si elle est nulle, si elle est nulle, l'utilisateur n'existe pas dans la base de donnée
          if (!user) {
            //Et nous retournons une erreur 401 avec un message Paire login/mot de passe incorrecte
              return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
          }
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                  }
                  return res.status(200).json({
                      userId: user._id,
                      //Ici au lieu d'envoyer une chaine de caractère, on va appeler une fonction de jsonwebtoken, la fonction sign.Cette fonction sign va prendre quelques arguments.Le premier arguement, c'est les données qu'on veut encoder si on en veut encoder,ce qu'on appelle le payload, les données qu'on veut encoder à l'intérieur de ce token.
                      token: jwt.sign(
                        //La on va créer un userId qui sera l'identifiant utilisateur du user comme ça on est sûr que cette requête correspond bien à cet userId
                        { userId: user._id },
                        //Le deuxième argument, c'est la clé secrète pour l'encodage 
                        process.env.JWT_SECRET,
                        //Et le troisième argument, c'est un argument de configuration où on va simplement appliqué une expiration pour notre token de 24H.Si il a plus de 24H, le token ne sera plus considéré comme valable.
                        { expiresIn: '24h' }
                    )
                  });
              })
              .catch(error => res.status(500).json({ error }));
      })
      //Il est important de préciser que c'est une erreur d'exécution de requête dans la base de donnée, il ne s'agit pas d'une erreur lorsqu'il n'y a pas de champs trouvé dans la base de donnée, lorsque l'utilisateur n'existe pas.
      .catch(error => res.status(500).json({ error }));
};
