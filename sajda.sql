-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 06 jan. 2025 à 00:01
-- Version du serveur :  10.4.13-MariaDB
-- Version de PHP : 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sajda`
--

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `url_name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url_name` (`url_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `comment`, `url_name`) VALUES
(4, 'general test', 'test', 'general_test'),
(5, 'general test 2', 'test', 'general_test_2');

-- --------------------------------------------------------

--
-- Structure de la table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
CREATE TABLE IF NOT EXISTS `feedbacks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `detail` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `target` enum('mosquee','imam') NOT NULL,
  `checked` tinyint(1) NOT NULL DEFAULT 0,
  `responded` tinyint(1) NOT NULL DEFAULT 0,
  `id_mosquee` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_mosquee` (`id_mosquee`),
  KEY `id_user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `title`, `detail`, `created_at`, `target`, `checked`, `responded`, `id_mosquee`, `id_user`) VALUES
(1, 'test', 'test', '2025-01-06 00:58:37', 'imam', 0, 0, 1, 4);

-- --------------------------------------------------------

--
-- Structure de la table `mosquees`
--

DROP TABLE IF EXISTS `mosquees`;
CREATE TABLE IF NOT EXISTS `mosquees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `address` varchar(200) NOT NULL,
  `city` varchar(100) NOT NULL,
  `zip` varchar(10) NOT NULL,
  `country` varchar(100) NOT NULL,
  `date_created` date DEFAULT NULL,
  `numero` varchar(15) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `x` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `isAvailable` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `mosquees`
--

INSERT INTO `mosquees` (`id`, `name`, `address`, `city`, `zip`, `country`, `date_created`, `numero`, `facebook`, `x`, `instagram`, `isAvailable`) VALUES
(1, 'test2', 'test', 'test', '15658', 'test', NULL, NULL, NULL, NULL, NULL, 1),
(4, 'test2', 'test', 'test', '1565', 'test', NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `mosquee_config`
--

DROP TABLE IF EXISTS `mosquee_config`;
CREATE TABLE IF NOT EXISTS `mosquee_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iqama_fajr` tinyint(4) DEFAULT NULL,
  `iqama_dhor` tinyint(4) DEFAULT NULL,
  `iqama_asr` tinyint(4) DEFAULT NULL,
  `iqama_maghrib` tinyint(4) DEFAULT NULL,
  `iqama_isha` tinyint(4) DEFAULT NULL,
  `nb_jumuas` tinyint(4) DEFAULT NULL,
  `jumuas` text DEFAULT NULL,
  `color` varchar(10) DEFAULT NULL,
  `id_mosquee` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_mosquee` (`id_mosquee`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `mosquee_config`
--

INSERT INTO `mosquee_config` (`id`, `iqama_fajr`, `iqama_dhor`, `iqama_asr`, `iqama_maghrib`, `iqama_isha`, `nb_jumuas`, `jumuas`, `color`, `id_mosquee`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(2, 0, 10, 10, 5, 10, 2, '[12:45,13:30]', 'red', 4);

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `content` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `media` varchar(150) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `id_mosquee` int(11) NOT NULL,
  `id_category` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_category` (`id_category`),
  KEY `id_mosquee` (`id_mosquee`),
  KEY `id_user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `posts`
--

INSERT INTO `posts` (`id`, `title`, `content`, `created_at`, `updated_at`, `media`, `active`, `id_mosquee`, `id_category`, `id_user`) VALUES
(5, 'test', 'test', '2025-01-05 23:09:13', '2025-01-05 23:17:05', 'test', 0, 1, 4, 4),
(7, 'test', 'test', '2025-01-05 23:09:19', NULL, 'test', 1, 1, 4, 4);

-- --------------------------------------------------------

--
-- Structure de la table `responses_feedback`
--

DROP TABLE IF EXISTS `responses_feedback`;
CREATE TABLE IF NOT EXISTS `responses_feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `response` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `id_user` int(11) NOT NULL,
  `id_user_who_ask` int(11) NOT NULL,
  `id_feedback` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_feedback` (`id_feedback`),
  KEY `id_user` (`id_user`),
  KEY `id_user_who_ask` (`id_user_who_ask`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `birthdate` date NOT NULL,
  `external_id` varchar(50) NOT NULL,
  `pseudo` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `role` enum('user','admin','gerant','imam') NOT NULL DEFAULT 'user',
  `creation_timestamp` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `birthdate`, `external_id`, `pseudo`, `password`, `role`, `creation_timestamp`) VALUES
(3, 'ousmane', 'diarra', 'ous@gmail.com', '1998-02-17', '1236', 'ouss', '$2b$10$TbDEzaiKJ6b5kzUzGNik3u1t88lOBa3EArtS3XWZM6G2mI7JhQSzu', 'gerant', '2025-01-02 21:42:10'),
(4, 'ousmane', 'diarra', 'ousss@gmail.com', '1998-02-17', '1236', 'ous', '$2b$10$FhHTXdhbC17oLKtIuHLtqe2qbiCEDt9a0FYb8lQ3Yix7y4zU4MB76', 'admin', '2025-01-02 21:50:22');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`id_mosquee`) REFERENCES `mosquees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `mosquee_config`
--
ALTER TABLE `mosquee_config`
  ADD CONSTRAINT `mosquee_config_ibfk_1` FOREIGN KEY (`id_mosquee`) REFERENCES `mosquees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`id_mosquee`) REFERENCES `mosquees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `posts_ibfk_3` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Contraintes pour la table `responses_feedback`
--
ALTER TABLE `responses_feedback`
  ADD CONSTRAINT `responses_feedback_ibfk_1` FOREIGN KEY (`id_feedback`) REFERENCES `feedbacks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `responses_feedback_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `responses_feedback_ibfk_3` FOREIGN KEY (`id_user_who_ask`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
