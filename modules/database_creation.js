const createDatabase = (con) => {
  let query = `
    -- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 20 déc. 2024 à 14:16
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : sajda
--

-- --------------------------------------------------------

--
-- Structure de la table categories
--

CREATE TABLE IF NOT EXISTS categories (
  id int(11) NOT NULL,
  name varchar(100) NOT NULL,
  comment varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table feedbacks
--

CREATE TABLE IF NOT EXISTS feedbacks (
  id int(11) NOT NULL,
  title varchar(100) NOT NULL,
  detail varchar(255) NOT NULL,
  created_at datetime NOT NULL,
  target enum('mosquee','imam','','') NOT NULL,
  checked tinyint(1) NOT NULL,
  responded tinyint(1) NOT NULL,
  id_mosquee int(11) NOT NULL,
  id_user int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table mosquees
--

CREATE TABLE IF NOT EXISTS mosquees (
  id int(11) NOT NULL,
  name varchar(200) NOT NULL,
  address varchar(200) NOT NULL,
  city varchar(100) NOT NULL,
  zip varchar(10) NOT NULL,
  country varchar(100) NOT NULL,
  date_created date DEFAULT NULL,
  numero varchar(15) DEFAULT NULL,
  facebook varchar(255) DEFAULT NULL,
  x varchar(255) DEFAULT NULL,
  instagram varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table mosquee_config
--

CREATE TABLE IF NOT EXISTS mosquee_config (
  id int(11) NOT NULL,
  iqama_fajr tinyint(4) NOT NULL,
  iqama_dhor tinyint(4) NOT NULL,
  iqama_asr tinyint(4) NOT NULL,
  iqama_maghrib tinyint(4) NOT NULL,
  iqama_isha tinyint(4) NOT NULL,
  nb_jumuas tinyint(4) NOT NULL,
  jumuas text NOT NULL,
  color varchar(10) NOT NULL,
  id_mosquee int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table posts
--

CREATE TABLE IF NOT EXISTS posts (
  id int(11) NOT NULL,
  title varchar(150) NOT NULL,
  content varchar(255) NOT NULL,
  created_at datetime NOT NULL DEFAULT current_timestamp(),
  updated_at datetime DEFAULT NULL,
  media varchar(150) DEFAULT NULL,
  active tinyint(1) NOT NULL,
  id_mosquee int(11) NOT NULL,
  id_category int(11) NOT NULL,
  id_user int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table responses_feedback
--

CREATE TABLE IF NOT EXISTS responses_feedback (
  id int(11) NOT NULL,
  response varchar(255) NOT NULL,
  created_at datetime NOT NULL DEFAULT current_timestamp(),
  id_user int(11) NOT NULL,
  id_user_who_ask int(11) NOT NULL,
  id_feedback int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table roles
--

CREATE TABLE IF NOT EXISTS roles (
  id int(11) NOT NULL,
  name varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table users
--

CREATE TABLE IF NOT EXISTS users (
  id int(11) NOT NULL,
  firstname varchar(100) NOT NULL,
  lastname varchar(100) NOT NULL,
  email varchar(150) NOT NULL,
  birthdate date NOT NULL,
  external_id varchar(50) NOT NULL,
  username varchar(100) NOT NULL,
  password varchar(200) NOT NULL,
  id_role int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table categories
--
ALTER TABLE categories
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY name (name);

--
-- Index pour la table feedbacks
--
ALTER TABLE feedbacks
  ADD PRIMARY KEY (id),
  ADD KEY id_mosquee (id_mosquee),
  ADD KEY id_user (id_user);

--
-- Index pour la table mosquees
--
ALTER TABLE mosquees
  ADD PRIMARY KEY (id);

--
-- Index pour la table mosquee_config
--
ALTER TABLE mosquee_config
  ADD PRIMARY KEY (id),
  ADD KEY id_mosquee (id_mosquee);

--
-- Index pour la table posts
--
ALTER TABLE posts
  ADD PRIMARY KEY (id),
  ADD KEY id_category (id_category),
  ADD KEY id_mosquee (id_mosquee),
  ADD KEY id_user (id_user);

--
-- Index pour la table responses_feedback
--
ALTER TABLE responses_feedback
  ADD PRIMARY KEY (id),
  ADD KEY id_feedback (id_feedback),
  ADD KEY id_user (id_user),
  ADD KEY id_user_who_ask (id_user_who_ask);

--
-- Index pour la table roles
--
ALTER TABLE roles
  ADD PRIMARY KEY (id);

--
-- Index pour la table users
--
ALTER TABLE users
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY email (email),
  ADD UNIQUE KEY username (username),
  ADD KEY id_role (id_role);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table categories
--
ALTER TABLE categories
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table feedbacks
--
ALTER TABLE feedbacks
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table mosquees
--
ALTER TABLE mosquees
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table mosquee_config
--
ALTER TABLE mosquee_config
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table posts
--
ALTER TABLE posts
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table responses_feedback
--
ALTER TABLE responses_feedback
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table roles
--
ALTER TABLE roles
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table users
--
ALTER TABLE users
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table feedbacks
--
ALTER TABLE feedbacks
  ADD CONSTRAINT feedbacks_ibfk_1 FOREIGN KEY (id_mosquee) REFERENCES mosquees (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT feedbacks_ibfk_2 FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table mosquee_config
--
ALTER TABLE mosquee_config
  ADD CONSTRAINT mosquee_config_ibfk_1 FOREIGN KEY (id_mosquee) REFERENCES mosquees (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table posts
--
ALTER TABLE posts
  ADD CONSTRAINT posts_ibfk_1 FOREIGN KEY (id_category) REFERENCES categories (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT posts_ibfk_2 FOREIGN KEY (id_mosquee) REFERENCES mosquees (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT posts_ibfk_3 FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table responses_feedback
--
ALTER TABLE responses_feedback
  ADD CONSTRAINT responses_feedback_ibfk_1 FOREIGN KEY (id_feedback) REFERENCES feedbacks (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT responses_feedback_ibfk_2 FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT responses_feedback_ibfk_3 FOREIGN KEY (id_user_who_ask) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table users
--
ALTER TABLE users
  ADD CONSTRAINT users_ibfk_1 FOREIGN KEY (id_role) REFERENCES roles (id) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

    `;

  con.query(query, (err, rows) => {
    if (err) return console.error("Table Creation Failed", err);

    console.log(`Successfully Created Table`);
  });
};

module.exports = { createDatabase };
