//La logique pour chaque fonction se trouve ici, ce que l'on appelle le controlleur qui va stocker toute la logique métier.Avec la logique comme ça se sera beaucoup plus facile à lire, à comprendre et à maintenir.

const Sauce = require("../models/sauce");
const fs = require("fs");

//Créer une sauce
exports.createSauce = (req, res, next) => {
  //La première chose à faire, c'est de parser l'objet de requête.En effet l'objet qui nous a été envoyé dans l'objet de requête va être envoyé sous forme json tjrs mais en chaine de caractères.Il nous faut donc commencer par parser cet objet à l'aide de la foncion parse
  // const thingObject = {...req.body};
  const sauceObject = JSON.parse(req.body.sauce);
  //Et nous allons supprimer dans cet objet 2 champs, le champs _id, puisque le champs de l'id va être généré par automatiquement par notre base de donnée.Le champs userId qui correspond à la personne qui a crée l'objet.Tout simplement, il ne faut pas faire confiance au client.
  delete sauceObject._id;
  delete sauceObject._userId;
  //On créé une instance de notre modèle Sauce en lui passant un objet JavaScript contenant toutes les informations requises du corps de requête analysé (en ayant supprimé en amont le faux_id envoyé par le front-end).
  //Nous allons utiliser le userId qui vient du token d'authentification.Nous créons donc notre objet avec ce qui nous a été placé moins les 2 champs supprimés.Le userId, nous l'extrayons de l'objet requête grace à notre middleware et nous allons générer l'url de l'image.Le seul Pb c'est que multer lui, nous passe que le nom de fichier, il faut donc générer l'url par nous même, pour cela c'est assez simple, nous faisons appel à des propriétés de requête donc le protocol en premier lieu, le nom d'hôte /images puisque c'est là que nous stockons l'image et nom de fichier tel qu'il nous a été donné par multer.
  const sauce = new Sauce({
    //On utilie le raccourcis js, l'opérateur spread et on passe sauceOject, ça va copier les champs dans la body de la request, dans le corps de la requête et il va détailler les informations(le titre, la description etc...)
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`
  });

  //Il nous faut maintenant enregistrer cet objet dans la base de donnée à l'aide de la fonction save() qui nous retourne donc une promesse, nous avons 2 choses à gérer .then pour le réussite et catch pour l'échec.
  //La méthode save() renvoie une Promise. Ainsi, dans notre bloc then() , nous renverrons une réponse de réussite avec un code 201 de réussite. Dans notre bloc catch() , nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    })
};

//Modifier une sauce
exports.modifySauce = (req, res, next) => {
  //Nous regardons ici s'il y  un champs file, si c'est le cas, nous allons récupérer notre objet en parsant la chaine de caractère
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        //et en créant l'url de l'image comme nous l'ovons fait prédemment
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`
        //Si ce n'est pas le cas, s'il n'a pas d'objet transmis, nous allons récupérer l'objet simplement dans le corps de la requête.
      }
    : { ...req.body };
  //Nous supprimons à nouveau le userId venant de la requête pour éviter que quelqu'un créé un objet à son nom puis le modifier pour le réasigner à quelqu'un d'autres.Il s'agit là d'une mesure de sécurité.
  delete sauceObject._userId;
  //Enfin, il nous faut chercher cette chose, cet objet dans notre base de donnée pour la récupérer, pourquoi ? parce que nous devons vérifier si c'est bien l'utilisateur à qui appartient cet objet qui cherche à le modifier donc nous commençons à récupérer notre objet en base de donnée.Nous gérons nos 2 cas (then en cas de succcès et catch en cas d'erreur )
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //en cas de succès, nous allons récupérer notre objet et nous allons vérifier qu'il appartient bien à l'utilisateur qui nous envoie la requête de modification, pour cela c'est très simple.Si le champs userId que nous avons récupéré en base est différent de userId qui vient de notre token et bien c'est que quelqu'un essaye de modifier un objet qui ne l'appartient pas et nous allons envoyer une erreur 401 pour un Pb d'authentification.
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
        //Maintenant dans l'autre cas, c'est que c'est le bon utilisateur, il ne nous reste plus qu'à mettre à jours notre enregistrement et donc nous passons notre filtre qui va dire quel est l'enregistrement à mettre à jours et avec quel objet ? donc l'objet en question c'est que nous avons récupéré dans le corps de notre fonction et avec l'id qui vient des paramètres de l'url.
      } else {
        if (req.file) {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            //Et maintenant, nous pouvns supprimer notre enregistrement dans la base de donnée avec cet objet qui nous sert de filtre de sélecteur
            Sauce.updateOne(
              { _id: req.params.id },
              {
                ...sauceObject,
                likes: sauce.likes,
                dislikes: sauce.dislikes,
                usersDisliked: sauce.usersDisliked,
                usersLiked: sauce.usersLiked,
                _id: req.params.id
              }
            )
              //Maintenant il faut gérer cette promesse donc la réussite (then) ou l'erreur(catch).En cas de réussite, nous allons envoyer un message de succès.
              .then(() => res.status(200).json({ message: "Objet modifié!" }))
              //Et en cas d'échec, nous allons renvoyer l'erreur
              .catch((error) => res.status(401).json({ error }))
          });
        } else {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              ...sauceObject,
              likes: sauce.likes,
              dislikes: sauce.dislikes,
              usersDisliked: sauce.usersDisliked,
              usersLiked: sauce.usersLiked,
              _id: req.params.id
            }
          )
            //Maintenant il faut gérer cette promesse donc la réussite (then) ou l'erreur(catch).En cas de réussite, nous allons envoyer un message de succès.
            .then(() => res.status(200).json({ message: "Objet modifié!" }))
            //Et en cas d'échec, nous allons renvoyer l'erreur
            .catch((error) => res.status(401).json({ error }))
        }
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    })
};

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  //Nous allons maintenant modifié notre route delete afin de supprimer l'objet uniquement si c'est le bon utilisateur qui demande la suppression.Il nous faut donc commencer par vérifier les droits.Pour cela nous allons commencer par récupérer l'objet en base, de même manière que nous avons fait pour la route put.
  Sauce.findOne({ _id: req.params.id })
    //Gérer le cas de succès.En cas de succès, nous allons vérifier que c'est bien le propriétaire qui nous demande la suppression.Pour ce faire, on fait comme la modification, on vérifie que le userId enregistré en base de donnée correspond bien à l'id que nous récupéons en token.Si ce n'est pas le cas, nous renvoyons une erreur avec un petit message non autorisé.
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
        //Si c'est le bon utilisateur, il nous faut supprimer l'objet de la base de donnée mais il nous faut aussi supprimer l'image du système de fichier. Pour ce faie c'est assez simple, il suffit de récupérer l'url qui est enregistré et recréer le chemin sur notre système de fichier à partir de celle-ci.
      } else {
        //Récupérons donc le nom du fichier grace à grace à un split autour du repertoire image puisque nous savons que c'est là et que le nom du fichier sera juste après.
        const filename = sauce.imageUrl.split("/images/")[1];
        //Nous allons faire la méthode unlink de fs que nous devons importer auparavant ci-dessus, donc nous appelons unlink avec notre chemin image et le nom de fichier et ensuite nous devons gérer le callback càd créer une méthode une fois que la suppression aura lieu, parce que la suppresion dans le système de fichier est fait de mùanière asynchrone.
        fs.unlink(`images/${filename}`, () => {
          //Et maintenant, nous pouvns supprimer notre enregistrement dans la base de donnée avec cet objet qui nous sert de filtre de sélecteur
          Sauce.deleteOne({ _id: req.params.id })
          //Nous gérons le succès, en envoyant un message  objet supprimé
          .then(() => {
            res.status(200).json({ message: "Objet supprimé !" });
          })
          //En cas d'échec, nous envoyons l'erreur 401
          .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    //Gérer le cas d'erreur.En cas d'erreur, nous renvoyons simplement une erreur 500 via un objet json
    .catch((error) => {
      res.status(500).json({ error });
    })
};

//Afficher une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }))
};

//Afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauces) => res.status(200).json(sauces))
  .catch((error) => res.status(400).json({ error }))
};

//like/dislike sauce.  Il y a 4 cas possibles: quand like = 1, l'utilisateur aime (= like) la sauce/quand like = 0, l'utilisateur annule son like ou son dislike/ et quand like = -1, l'utilisateur n'aime pas (= dislike) la sauce.
//Ce code exporte une fonction "likeSauce" qui gère une requête HTTP pour aimer ou ne pas aimer une sauce. La fonction vérifie si l'ID utilisateur dans le corps de la requête est le même que l'ID de l'utilisateur authentifié, et si ce n'est pas le cas, renvoie un statut 401,code avec un message d'erreur. Ensuite, il trouve une sauce dans la base de données par son identifiant, passé en paramètre dans la requête, et incrémente ou décrémente ses goûts ou ses aversions en fonction de la valeur du champ "like" dans le corps de la requête. Ça aussi ajoute ou supprime l'identifiant de l'utilisateur du tableau aimé ou détesté de la sauce. Enfin, la fonction met à jour la sauce dans la base de données et envoie une réponse de succès ou d'erreur au client.
exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  if (userId != req.auth.userId) {
    return res.status(401).json({ error: "Tentative de piratage de l'id" });
  }
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const like = req.body.like;
      let succesMessage = "";
      //Cas où like = -1, l'utilisateur n'aime pas (= dislike) la sauce.
      if (like == -1) {
        if (sauce.usersDisliked.includes(userId)) {
          return res.status(401).json({
            error: "Vous ne pouvez pas disliker la même sauce plusieurs fois",
          });
        }
        sauce.dislikes++;
        sauce.usersDisliked.push(userId);
        succesMessage = "Sauce dislikée";
        //cas où like = 1, l'utilisateur aime (= like) la sauce
      } else if (like == 1) {
        if (sauce.usersLiked.includes(userId)) {
          return res
            .status(401)
            .json({
              error: "Vous ne pouvez pas liker la même sauce plusieurs fois"
            });
        }
        sauce.likes++;
        sauce.usersLiked.push(userId);
        succesMessage = "Sauce likée";
        //cas où like = 0, l'utilisateur annule son like ou son dislike
      } else {
        const likeIndex = sauce.usersLiked.findIndex((id) => id == userId);
        const disLikeIndex = sauce.usersDisliked.findIndex(
          (id) => id == userId
        );
        if (disLikeIndex > -1) {
          sauce.dislikes--;
          sauce.usersDisliked.splice(disLikeIndex, 1);
          succesMessage = "Sauce dislike annulé";
        } else if (likeIndex > -1) {
          sauce.likes--;
          sauce.usersLiked.splice(likeIndex, 1);
          succesMessage = "Sauce like annulé";
        } else {
          return res
            .status(501)
            .json({ error: "Aucun like ou dislike à supprimer" });
        }
      }
      //Mise à jours de la sauce dans la base de donnée
      Sauce.updateOne({ _id: req.params.id }, sauce)
      .then(() => res.status(200).json({ message: succesMessage }))
      .catch(
        (error) => res.status(401).json({ error })
      );
    })
    .catch((error) => {
      return res.status(400).json({ error });
    })
};
