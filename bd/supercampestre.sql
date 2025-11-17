-- Configuración inicial
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

-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS `supercampestre` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `supercampestre`;

--
-- Estructura para tabla `departamento` (Tomada de la 2da petición)
--
DROP TABLE IF EXISTS `departamento`;
CREATE TABLE IF NOT EXISTS `departamento` (
  `IdDepartamento` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdDepartamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para tabla `departamento` (Tomado de la 1ra petición)
--
LOCK TABLES `departamento` WRITE;
/*!40000 ALTER TABLE `departamento` DISABLE KEYS */;
INSERT INTO `departamento` VALUES (1,'Mercancia_General','Mercancia en general'),(2,'Jugos_Y_Refrescos','Jugos y refrescos'),(11,'Frutas_y_Verduras','Frutas y verduras'),(14,'Carniceria','Carniceria');
/*!40000 ALTER TABLE `departamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Estructura para tabla `empleado` (Tomada de la 2da petición)
--
-- Se mantiene el IdEmpleado como clave primaria pero **sin AUTO_INCREMENT** para poder insertar el empleado '0' de la data.
DROP TABLE IF EXISTS `empleado`;
CREATE TABLE IF NOT EXISTS `empleado` (
  /* Aquí está el cambio: */
  `IdEmpleado` int(11) NOT NULL AUTO_INCREMENT,
  
  `Puesto` varchar(20) NOT NULL,
  `Sueldo` decimal(10,2) NOT NULL,
  `RFC` varchar(13) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  `Usuario` varchar(50) NOT NULL,
  `Contrasena` varchar(80) NOT NULL,
  PRIMARY KEY (`IdEmpleado`),
  UNIQUE KEY `RFC` (`RFC`),
  UNIQUE KEY `Contrasena` (`Contrasena`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para tabla `empleado` (Tomado de la 1ra petición)
--
LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
INSERT INTO `empleado` VALUES (0,'Admin',15500.00,'REPR950101XYZ','Reynaldo Daniel Reyes Parra','8112345678','Daniel','$2b$10$mC34hlvl8L0EDhsqEJU3lup1guyxX7Twg90e0oxIBZ7O2/8soWZKi'),(1,'Cajero',15500.00,'RAZL950101XYZ','Raul Adriell Zavala Lira','8112345678','Raul','$2b$10$j3HrSTmP7.HdO3RlZjoqkenZL7PNrY.HWaQY/3z.5k4ptueAep3aO'),(2,'Almacenista',15500.00,'GAOG950101XYZ','Gael Onofre Garcia','8112345678','Gael','$2b$10$yJKnqxTxNKZACNj1Y7keIehlMBSc.cu1e8G7uOkQjjelx/s4v1.fy');
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Estructura para tabla `factura` (Tomada de la 2da petición)
--
DROP TABLE IF EXISTS `factura`;
CREATE TABLE IF NOT EXISTS `factura` (
  `IdFactura` int(11) NOT NULL,
  `Cliente` varchar(150) DEFAULT NULL,
  `TipoCFDI` varchar(10) DEFAULT NULL,
  `ModoPago` varchar(50) DEFAULT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`IdFactura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para tabla `factura` (Tomado de la 1ra petición, que está vacío)
--
LOCK TABLES `factura` WRITE;
/*!40000 ALTER TABLE `factura` DISABLE KEYS */;
/*!40000 ALTER TABLE `factura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Estructura para tabla `producto` (Tomada de la 2da petición)
--
DROP TABLE IF EXISTS `producto`;
CREATE TABLE IF NOT EXISTS `producto` (
  `CodigoProducto` bigint(20) NOT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `IdDepartamento` int(11) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `ClaveSAT` varchar(50) DEFAULT NULL,
  `ClaveUnidadMedida` varchar(50) DEFAULT NULL,
  `Stock` int(11) NOT NULL DEFAULT 0,
  `RutaFoto` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`CodigoProducto`),
  KEY `IdDepartamento` (`IdDepartamento`),
  CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`IdDepartamento`) REFERENCES `departamento` (`IdDepartamento`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para tabla `producto` (Tomado de la 1ra petición)
--
LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,50.00,1,'Garrafon Bonafont','50202301','pz',15,'null'),(25,31.00,1,'Bolsa de hielo','50202302 ','pz',70,NULL),(26,30.00,1,'Tortillas 1Kg','50221300','pz',100,'null'),(27,45.00,1,'Garrafon Liv','50202301','pz',15,'null'),(852,15.00,2,'Jugo Kool Aid','50161814','pz',30,NULL),(1035,35.00,1,'Salsa Macha','50171831','pz',10,NULL),(1048,20.00,1,'Bolsa de hielo para enfriar chica','50202302','pz',30,NULL),(1049,28.00,1,'Bolsa de hielo para enfriar grande','50202302','pz',15,NULL),(1077,200.00,1,'Envase de Garrafon','24112601','pz',0,NULL),(7500525374486,15.00,1,'Agua Purificada','50202301','pz',60,NULL),(7501013105520,15.00,2,'Jumex Manzana 413ml','50202304','pz',50,'null');
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Estructura para tabla `ticket` (Tomada de la 2da petición)
--
DROP TABLE IF EXISTS `ticket`;
CREATE TABLE IF NOT EXISTS `ticket` (
  `NumeroTicket` int(11) NOT NULL AUTO_INCREMENT,
  `Subtotal` decimal(10,2) NOT NULL,
  `IdEmpleado` int(11) NOT NULL,
  `FechaHora` timestamp NOT NULL DEFAULT current_timestamp(),
  `MetodoPago` varchar(50) DEFAULT 'Efectivo',
  PRIMARY KEY (`NumeroTicket`),
  KEY `IdEmpleado` (`IdEmpleado`),
  CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`IdEmpleado`) REFERENCES `empleado` (`IdEmpleado`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- Se omite el AUTO_INCREMENT=7 para que empiece en 1.

--
-- Volcado de datos para tabla `ticket` (Tomado de la 1ra petición, que está vacío)
--
LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Estructura para tabla `venta` (Tomada de la 2da petición)
--
DROP TABLE IF EXISTS `venta`;
CREATE TABLE IF NOT EXISTS `venta` (
  `CodigoProducto` bigint(20) NOT NULL,
  `NumeroTicket` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`CodigoProducto`,`NumeroTicket`),
  KEY `NumeroTicket` (`NumeroTicket`),
  CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`CodigoProducto`) REFERENCES `producto` (`CodigoProducto`) ON UPDATE CASCADE,
  CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`NumeroTicket`) REFERENCES `ticket` (`NumeroTicket`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para tabla `venta` (Tomado de la 1ra petición, que está vacío)
--
LOCK TABLES `venta` WRITE;
/*!40000 ALTER TABLE `venta` DISABLE KEYS */;
/*!40000 ALTER TABLE `venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Finalización de configuración
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;