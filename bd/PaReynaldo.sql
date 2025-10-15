-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: supercampestre
-- ------------------------------------------------------
-- Server version	9.4.0

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
-- Table structure for table `departamento`
--
CREATE DATABASE IF NOT EXISTS `supercampestre` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `supercampestre`;

DROP TABLE IF EXISTS `departamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departamento` (
  `IdDepartamento` int NOT NULL,
  `Nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`IdDepartamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamento`
--

LOCK TABLES `departamento` WRITE;
/*!40000 ALTER TABLE `departamento` DISABLE KEYS */;
INSERT INTO `departamento` VALUES (1,'Mercancia_General','Mercancia en general'),(2,'Jugos_Y_Refrescos','Jugos y refrescos'),(11,'Frutas_y_Verduras','Frutas y verduras'),(14,'Carniceria','Carniceria');
/*!40000 ALTER TABLE `departamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado` (
  `IdEmpleado` int NOT NULL,
  `Puesto` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `Sueldo` decimal(10,2) NOT NULL,
  `RFC` varchar(13) COLLATE utf8mb4_general_ci NOT NULL,
  `Nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Telefono` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Usuario` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `Contrasena` varchar(80) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`IdEmpleado`),
  UNIQUE KEY `RFC` (`RFC`),
  UNIQUE KEY `Contrasena` (`Contrasena`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado`
--

LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
INSERT INTO `empleado` VALUES (0,'Admin',15500.00,'REPR950101XYZ','Reynaldo Daniel Reyes Parra','8112345678','Daniel','$2b$10$mC34hlvl8L0EDhsqEJU3lup1guyxX7Twg90e0oxIBZ7O2/8soWZKi'),(1,'Cajero',15500.00,'RAZL950101XYZ','Raul Adriell Zavala Lira','8112345678','Raul','$2b$10$j3HrSTmP7.HdO3RlZjoqkenZL7PNrY.HWaQY/3z.5k4ptueAep3aO'),(2,'Almacenista',15500.00,'GAOG950101XYZ','Gael Onofre Garcia','8112345678','Gael','$2b$10$yJKnqxTxNKZACNj1Y7keIehlMBSc.cu1e8G7uOkQjjelx/s4v1.fy');
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factura`
--

DROP TABLE IF EXISTS `factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factura` (
  `IdFactura` int NOT NULL,
  `Cliente` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `TipoCFDI` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ModoPago` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Telefono` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`IdFactura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factura`
--

LOCK TABLES `factura` WRITE;
/*!40000 ALTER TABLE `factura` DISABLE KEYS */;
/*!40000 ALTER TABLE `factura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `CodigoProducto` bigint(50) COLLATE utf8mb4_general_ci NOT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `IdDepartamento` int NOT NULL,
  `Descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ClaveSAT` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ClaveUnidadMedida` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Stock` int NOT NULL DEFAULT '0',
  `RutaFoto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`CodigoProducto`),
  KEY `IdDepartamento` (`IdDepartamento`),
  CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`IdDepartamento`) REFERENCES `departamento` (`IdDepartamento`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,50.00,1,'Garrafon Bonafont','50202301','pz',15,'null'),(1077,200.00,1,'Envase de Garrafon','24112601','pz',0,NULL),(26,30.00,1,'Tortillas 1Kg','50221300','pz',100,'null'),(27,45.00,1,'Garrafon Liv','50202301','pz',15,'null'),(7501013105520,15.00,2,'Jumex Manzana 413ml','50202304','pz',50,'null');
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `NumeroTicket` int NOT NULL AUTO_INCREMENT,
  `Subtotal` decimal(10,2) NOT NULL,
  `IdEmpleado` int NOT NULL,
  PRIMARY KEY (`NumeroTicket`),
  KEY `IdEmpleado` (`IdEmpleado`),
  CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`IdEmpleado`) REFERENCES `empleado` (`IdEmpleado`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venta`
--

DROP TABLE IF EXISTS `venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venta` (
  `CodigoProducto` bigint(50) COLLATE utf8mb4_general_ci NOT NULL,
  `NumeroTicket` int NOT NULL,
  `Cantidad` int NOT NULL,
  `Subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`CodigoProducto`,`NumeroTicket`),
  KEY `NumeroTicket` (`NumeroTicket`),
  CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`CodigoProducto`) REFERENCES `producto` (`CodigoProducto`) ON UPDATE CASCADE,
  CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`NumeroTicket`) REFERENCES `ticket` (`NumeroTicket`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta`
--

LOCK TABLES `venta` WRITE;
/*!40000 ALTER TABLE `venta` DISABLE KEYS */;
/*!40000 ALTER TABLE `venta` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-15  8:35:11
