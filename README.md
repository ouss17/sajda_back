# Sajda backend

API de l'application web **sajda** contenant les informations de base de données.

API mise en place avec _nodejs_, une base de données SQL gérée avec le sgbd _mariadb_ et une base de données NoSQL avec _Redis_.

---

## Installations

Pour installer le back-end en local, il y a plusieurs étapes à suivre :

- ### Clone github

Clonez le projet avec le [lien github](https://github.com/ouss17/sajda_back) grâce à la commande :

```shell
git clone https://github.com/ouss17/sajda_back
```

puis installez les dépendances du projet avec la commande :

```shell
npm i
```

- ### Mise en place d'un serveur MySQL/MariaDB

La base de données SQL servira à enregistrer le plus gros des données relatives à l'application : **_mosquées_**, **_utilisateurs_**, **_configurations_**, **_posts_**, **_feedbacks_**, etc...
Le choix de ce type de base de données est pour profiter des nombreuses liaisons entre différentes tables et pour avoir des résultats de requête rapides.
Mettez en place un serveur MariaDB, manuellement ou via _XAMP_, _WAMP_, ou _MAMP_, créez une base de données au nom voulu puis importez le schéma ci dessous :

![[sajda.sql]]

Dans le fichier .env, remplissez les données relatives à votre base de données afin d'assurer la bonne connexion à celle-ci :

```
MYSQL_HOST=<your_host>

MYSQL_USER=<user>

MYSQL_PASSWORD=<your_password>
```

La connexion à la base de données SQL devrait fonctionner.

- ### Mise en place d'un serveur Redis

La base de données NoSQL servira à enregistrer les token d'utilisateur lors de leur authentification. Elle servira aussi à vérifier leur identité lors d'action nécessitant la vérification de rôle, comme lors de la configuration d'une mosquée par exemple. Le choix d'une base de donnée qui fonctionne en key/value a été fait car il n'y aura qu'un seul type de donnée (les token) qui sera enregistré dans une seule table.
Il y a plusieurs étapes à suivre pour mettre en place le serveur Redis :

1. Créez un compte sur [Redis](https://cloud.redis.io/?_gl=1*1us3g9y*_gcl_aw*R0NMLjE3MzQ0MjkwMzIuQ2p3S0NBaUEzNFM3QmhBdEVpd0FDWnp2NFdweS1yR0VxUHhxU0tpZ2MzVUszc2VVYzRvV2RoTzJnenhOMUpHZ2Nub0ctY0tLYTRnNEZSb0NZWG9RQXZEX0J3RQ..*_gcl_au*MTAyNzg2Mjk0NS4xNzM0NDI5MDMy#/).
2. Téléchargez l'application Redis Insight et configurez votre base de données.
3. Créez un serveur Redis avec docker grâce à la commande suivante :

```shell
docker run --name redis-server -p 12881:6379 -d redis
```

4. Si votre serveur Redis existe déjà mais n'est pas lancé, lancez le sur docker desktop puis utilisez la commande suivante :

```shell
docker exec -it redis-server redis-cli
```

- ### Lancement du serveur node

Une fois tous vos serveurs et base de données lancés, il ne reste plus qu'à lancer le serveur node en vous plaçant dans le dossier de travail et en lançant la commande :

```shell
nodemon
```
