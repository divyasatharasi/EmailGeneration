CREATE DATABASE `email-id-generation-db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

CREATE TABLE `user_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(80) DEFAULT NULL,
  `otp` varchar(15) DEFAULT NULL,
  `is_admin` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `customer_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(45) NOT NULL,
  `lead_full_name` varchar(95) NOT NULL,
  `lead_first_name` varchar(45) NOT NULL,
  `lead_middle_name` varchar(45) DEFAULT NULL,
  `lead_last_name` varchar(45) DEFAULT NULL,
  `designation` varchar(45) NOT NULL,
  `industry` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `course` varchar(45) DEFAULT NULL,
  `email_1` varchar(100) DEFAULT NULL,
  `email_2` varchar(100) DEFAULT NULL,
  `email_3` varchar(100) DEFAULT NULL,
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `email-id-generation-db`.`customer_info` 
ADD COLUMN `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `email_3`;

CREATE TABLE `domain_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(95) NOT NULL,
  `domain` varchar(45) NOT NULL,
  `format1` varchar(45) DEFAULT NULL,
  `format2` varchar(45) DEFAULT NULL,
  `format3` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `company_name_UNIQUE` (`company_name`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



