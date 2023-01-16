//Après l'installation d'un parkage dans le terminal avec la commande npm install --save multer, on importe multer
const multer = require('multer');

//On va se préparer un dictionnaire, on va appeler MIME_TYPES qui sera un objet 
const MIME_TYPES = {
  // 'image/jpg' qu'on va tradure en 'jpg'
  'image/jpg': 'jpg',
  // 'image/jpeg' qu'on va tradure en 'jpg'
  'image/jpeg': 'jpg',
  // 'image/png' qu'on va tradure en 'png'
  'image/png': 'png'
};
//On va créer un objet de configuration pour multer qui s'appelle storage, on va utilser une fonction de multer qui s'appelle diskStorage pour dire qu'on va enregistrer sur le disque.
const storage = multer.diskStorage({
  //L'objet de configuration qu'on passe à diskStorage a besoin de 2 éléments, la destination d'abord qui sera une fonction qui va expliquer à multer dans quel dossier enregistrer les fichiers.Donc destination, il s'agit d'une fonction qui prend 3 arguments(reg,file,callack).
  destination: (req, file, callback) => {
    //Dans destination, on va simplement appeler callback en passant le le premier arguement "null" pour dire qu'il n'y a pas d'erreur à ce niveau là et en passant le nom du dossier "images" en 2ième argument, le dossier images qu'on a créé dans le backend.
    callback(null, 'images');
  },
  // En suite il faut un 2ième argument, un 2ième élément à cet obhjet de configuratione qui est "filename" qui va expliquer à multer quel nom de fichier utilisé car on ne peut pas se permettre d'utiliser le nom de fichier d'origine sinon on resquerait d'avoir le Pb lorsque 2 fichiers ont le même nom.
  filename: (req, file, callback) => {
    //Ici on va générer le nouveau nom pour le fichier.Ici on va utilise le nom d'origine du fichier.ça peut poser des Pb côté serveur, on va éléminer ces espaces, on va les remplacer par les underscores en utilisant la méthode split, on va split autour des espaces, ça va créer un tableau avec des différents mots du nom de fichier et en appelant .join et en rejoignant ce tableau avec un seul string avec des underscores à la place des espaces donc ça nous élimine le Pb des espaces. 
    //La première chose est de créer son nom, ici on va utiliser le nom d'origine du fichier, on aura accès avec originalname de file, il est possible sous plusieurs IOS d'avoir des espace dans un nom de fichier mais ça peut pose Pb côté serveur donc on va éliminer ces espaces, on va les remplacer par des underscores en utilisant la méthode split(), on va split autour des espaces,ça va créer un tableau des différents mots du nom de fichier et en appelant .join et en rejoignant ce tableau en un seul string avec des underscores à la place des espaces.Donc ça nous élimine le Pb des espaces.
    const name = file.originalname.split(' ').join('_');
    //et maintenant, il faut que l'on applique une extension, l'élément de notre dictionnaire qui correspond au MIME_TYPE du fichier envoyé par le frontend.
    const extension = MIME_TYPES[file.mimetype];
    //Maintenant, on va simplement appeler le callback, on lui passe une valeur null pour dire qu'il n'y a pas d'erreur.Là, on va créer le filename entier, se sera le name qu'on a créé au dessus auquel on va rajouter un timestamp pour le rendre le plus unique possible en ajoutant Date.now(), on ajoute également un point et l'extension du fichier 
    callback(null, name + Date.now() + '.' + extension);
  }
});
//Maintenant, il ne nous reste plus qu'à exporter notre middleware multer complèmednt configuré. Là on va simplement appeler la méthode multer à laquelle on passe notre objet storage et on va appeler la méthode single pour dire d'un fichier unique et on explique à multer qu'il s'agit d'un fichier image uniquement.Donc voilà, notre middleware configuré.
module.exports = multer({ storage }).single('image');