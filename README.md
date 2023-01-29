# Formation OpenClassromms-Developpeur Web:
P6 (6ième projet de la formation DEV Web): Construisez une API sécurisée pour une application d'avis gastronomiques - PIIQUANTE 

## Scénario: 
Développement d'une application Web nommée "PIIQUANTE" dans laquelle les utilisateurs pourront ajouter leurs sauces préférées et liker ou disliker les sauces proposées par les autres utilisateurs.  
Le but est de créer le BACKEND de l'application pour construire une API, le FRONTEND étant déjà codé et fourni.

## Objectifs du projet et compétences évaluées:
Développement Backend en Javascript
- Serveur *Node.js*
- Framework *Express*
- Base de données *MongoDB*
  - Hébergement sur MongoDB Atlas
  - Opérations relatives à la BDD réalisées avec mongoose
- *API REST* et *RGPD*
- Mettre en œuvre des opérations CRUD de manière sécurisée
- Stocker des données de manière sécurisée
- Implémenter un modèle logique de données conformément à la réglementation

## Mesures de sécurité mises en place:
- Hashage du mot de passe utilisateur avec *bcrypt*
- Manupulation sécurisée de la base de donnée avec *mongoose*
- Vérification que l'email utilisateur soit unique dans la base de données avec *mongoose-unique-validator*
- Utilisation de variables d'environnement pour les données sensibles avec *dotenv*
- Authentification de l'utilisateur par token avec *jsonwebtoken*
- Les tokens d'authentification permettent aux utilisateurs de se connecter une seule fois à leur compte. Au moment de se connecter, ils recevront leur 
  token et le renverront automatiquement à chaque requête par la suite. Ceci permettra au back-end de vérifier que la requête est authentifiée.    
- Protection des headers avec *helmet*

## Pour tester l'applicaztion:
1/ Cloner le repository de l'application frontend: https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6
   - Dans un terminal, accéder au dossier du frontend avec la commande: cd frontend
   - Installer les dépendances avec la commande: npm install
   - Lancer: *ng serve* avec la commande:  npm run start    ou   npm run ng serve
2/ Cloner le repository backend: https://github.com/VictorH94/P6-Victor
3/ Ajouter un fichier de configuration nommé *.env* à la racine du backend. A l'intérieur, mettre 3 variables d'environnement "secrètes" suivants:
   MONGODB_USER=Jessica
   MONGODB_PASSWORD=dNEJOYEJhvTJiaBc
   JWT_SECRET=secret-key-to-encrypt-the-token 
4/ Lancer le backend:
   - Dans un autre terminal, accéder au dossier du backend avec la commande: cd backend
   - Installer les dépendances avec la commande: npm install
   - Lancer le serveur avec la commande: node server     ou     nodemon server
5/ Le frontend est accessible à l'adresse http://localhost:4200
6/ Pour des tests spécifiques (avec postman par exemple), le backend répond à l'adresse: http://localhost:3000 (attention: authentification requise pour  
   toutes les routes /api/sauces/)


