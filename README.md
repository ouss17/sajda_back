# Sajda backend

API de l'application web **sajda** contenant les informations de base de données.

API mise en place avec *nodejs*, une base de données SQL gérée avec le SGBD *mariadb* et une base de données NoSQL avec *MongoDb*.

---

## Installations
 
Pour installer le back-end en local, il y a plusieurs étapes à suivre :

- ### Clone github

Clonez le projet avec le [lien github](https://github.com/ouss17/sajda_back) grâce à la commande :
```shell
git clone https://github.com/ouss17/sajda_back
```

puis installez les dépendances du projet avec la commande :

``` shell
npm i
```

- ### Mise en place d'un serveur MySQL/MariaDB

La base de données SQL servira à enregistrer le plus gros des données relatives à l'application : ***mosquées***, ***utilisateurs***, ***configurations***, ***posts***, ***feedbacks***, etc...
Le choix de ce type de base de données est pour profiter des nombreuses liaisons entre différentes tables et pour avoir des résultats de requête rapides.
Mettez en place un serveur MariaDB, manuellement ou via *XAMP*, *WAMP*, ou *MAMP*, créez une base de données au nom de `sajda`

Dans le fichier .env, remplissez les données relatives à votre base de données afin d'assurer la bonne connexion à celle-ci :

```env
MYSQL_HOST=<your_host>

MYSQL_USER=<user>

MYSQL_PASSWORD=<your_password>
```

La connexion à la base de données SQL devrait fonctionner.

- ### Mise en place d'un serveur MongoDB

La base de données NoSQL servira à enregistrer les messages de différentes notifications envoyées. Ce choix a été fait pour profiter de la flexibilité de la base noSql, pour pouvoir à tout moment rajouter des notifications spécifiques.
Mettez en place un serveur MariaDB, manuellement ou via *MongoDB Atlas*, créez une base de données au nom de `sajda`

Dans le fichier .env, remplissez les données relatives à votre base de données afin d'assurer la bonne connexion à celle-ci :

```env
CONNECTION_STRING_MONGO=mongodb+srv://<user>:<password>@cluster0.a3nle.mongodb.net/sajda
```
La connexion à la base de données NoSQL devrait fonctionner.

- ### Lancement du serveur node

Une fois tous vos serveurs et base de données lancés, il ne reste plus qu'à lancer le serveur node en vous plaçant dans le dossier de travail et en lançant la commande :
```shell
nodemon
```
