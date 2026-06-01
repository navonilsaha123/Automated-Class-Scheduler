-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: class_scheduler
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `institute_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7dq7qwom6wham6omx9qjlx9f` (`institute_id`),
  CONSTRAINT `FK7dq7qwom6wham6omx9qjlx9f` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'2026-03-27 18:46:13.085692','CSE',1),(5,'2026-03-27 19:54:47.973165','CSE',3),(6,'2026-03-27 19:54:51.291224','IT',3),(7,'2026-03-27 19:55:03.643975','Data Science',3);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institutes`
--

DROP TABLE IF EXISTS `institutes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institutes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK8xiqjjnfbb6sk7tebjxeiqkqj` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institutes`
--

LOCK TABLES `institutes` WRITE;
/*!40000 ALTER TABLE `institutes` DISABLE KEYS */;
INSERT INTO `institutes` VALUES (1,'string','9685745698','2026-03-27 18:16:42.781965','user@example.com','example','$2a$10$PWWdCsRJUT7F292yAhy8IekjLQ2bcJXOMHiMlQuOmkU3R.TtFxw0u'),(2,'ok','9687452369','2026-03-27 18:44:34.245217','abc@gmail.com','ABC','$2a$10$3sPQRDpiQKJ4OLjoGqPjyuMjgEWWTApk0FeC5biM.oU4B4qD2Wqb.'),(3,'','8967452305','2026-03-27 19:43:03.264094','mckv@edu.in','MCKV INSTITUTE OF ENGINEERING','$2a$10$F.fqVUejLJneVhgFygiOGeMKP1cT1..q5nblWuqJ2T9oE6jg5gPbu');
/*!40000 ALTER TABLE `institutes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `period_duration` int NOT NULL,
  `periods_per_week` int NOT NULL,
  `type` enum('LAB','THEORY') NOT NULL,
  `department_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgh0j5ejuox2kr2av0l8158c0a` (`department_id`),
  CONSTRAINT `FKgh0j5ejuox2kr2av0l8158c0a` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'2026-03-27 19:04:54.182641','DBMS',1,5,'THEORY',1),(2,'2026-03-27 19:05:01.132873','OS',1,5,'THEORY',1),(3,'2026-03-27 19:05:07.685585','DSA',1,5,'THEORY',1),(4,'2026-03-27 19:05:17.377281','Computer Networks',1,5,'THEORY',1),(5,'2026-03-27 19:06:35.235433','Math',1,5,'THEORY',1),(6,'2026-03-27 19:07:35.649538','Linux lab',2,2,'LAB',1),(7,'2026-03-27 19:07:45.872123','Python lab',2,2,'LAB',1),(8,'2026-03-27 19:08:41.130652','Electronics lab',2,2,'LAB',1),(16,'2026-03-27 19:55:23.999327','DBMS',1,6,'THEORY',5),(17,'2026-03-27 19:55:39.035636','Computer Networks',1,6,'THEORY',5),(18,'2026-03-27 19:56:18.715905','Digital Electronics',1,5,'THEORY',5),(19,'2026-03-27 19:56:31.754371','Operating System',1,6,'THEORY',5),(20,'2026-03-27 19:56:49.651269','Discrete Math',1,6,'THEORY',5),(21,'2026-03-27 19:57:08.333537','Linux Lab',2,2,'LAB',5),(22,'2026-03-27 19:57:27.036271','Java Lab',2,2,'LAB',5),(23,'2026-03-27 19:57:39.450950','SQL',2,2,'LAB',5),(24,'2026-03-27 19:58:16.514172','Operating System',1,6,'THEORY',6),(25,'2026-03-27 19:58:31.104545','DSA',1,6,'THEORY',6),(26,'2026-03-27 19:58:42.785353','DBMS',1,6,'THEORY',6),(27,'2026-03-27 19:58:57.513445','Linux Lab',2,2,'LAB',6),(28,'2026-03-27 19:59:18.851381','SQL Lab',2,2,'LAB',6),(29,'2026-03-27 20:00:21.827628','C Lab',2,2,'LAB',6),(31,'2026-03-27 20:01:15.990478','DBMS',1,6,'THEORY',7),(32,'2026-03-27 20:01:27.043137','Operating System',1,6,'THEORY',7),(33,'2026-03-27 20:01:31.860508','DSA',1,6,'THEORY',7),(34,'2026-03-27 20:01:42.269424','Linux Lab',2,2,'LAB',7),(35,'2026-03-27 20:02:15.928052','SQL Lab',2,2,'LAB',7),(36,'2026-03-27 20:02:26.950906','Discrete Math',1,6,'THEORY',7),(37,'2026-03-27 20:03:20.544194','Java Lab',2,2,'LAB',7),(38,'2026-03-27 20:03:32.295299','TOC',1,5,'THEORY',7);
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-02 23:47:01
