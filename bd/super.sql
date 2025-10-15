-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para supercampestre
CREATE DATABASE IF NOT EXISTS `supercampestre` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `supercampestre`;

-- Volcando estructura para tabla supercampestre.departamento
CREATE TABLE IF NOT EXISTS `departamento` (
  `IdDepartamento` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdDepartamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla supercampestre.departamento: ~0 rows (aproximadamente)

-- Volcando estructura para tabla supercampestre.empleado
CREATE TABLE IF NOT EXISTS `empleado` (
  `IdEmpleado` int(11) NOT NULL,
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

-- Volcando datos para la tabla supercampestre.empleado: ~3 rows (aproximadamente)
INSERT INTO `empleado` (`IdEmpleado`, `Puesto`, `Sueldo`, `RFC`, `Nombre`, `Telefono`, `Usuario`, `Contrasena`) VALUES
	(0, 'Admin', 15500.00, 'REPR950101XYZ', 'Reynaldo Daniel Reyes Parra', '8112345678', 'Daniel', '$2b$10$mC34hlvl8L0EDhsqEJU3lup1guyxX7Twg90e0oxIBZ7O2/8soWZKi'),
	(1, 'Cajero', 15500.00, 'RAZL950101XYZ', 'Raul Adriell Zavala Lira', '8112345678', 'Raul', '$2b$10$j3HrSTmP7.HdO3RlZjoqkenZL7PNrY.HWaQY/3z.5k4ptueAep3aO'),
	(2, 'Almacenista', 15500.00, 'GAOG950101XYZ', 'Gael Onofre Garcia', '8112345678', 'Gael', '$2b$10$yJKnqxTxNKZACNj1Y7keIehlMBSc.cu1e8G7uOkQjjelx/s4v1.fy');

-- Volcando estructura para tabla supercampestre.factura
CREATE TABLE IF NOT EXISTS `factura` (
  `IdFactura` int(11) NOT NULL,
  `Cliente` varchar(150) DEFAULT NULL,
  `TipoCFDI` varchar(10) DEFAULT NULL,
  `ModoPago` varchar(50) DEFAULT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`IdFactura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla supercampestre.factura: ~0 rows (aproximadamente)

-- Volcando estructura para tabla supercampestre.producto
CREATE TABLE IF NOT EXISTS `producto` (
  `CodigoProducto` int(20) NOT NULL,
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

-- Volcando datos para la tabla supercampestre.producto: ~0 rows (aproximadamente)

-- Volcando estructura para tabla supercampestre.ticket
CREATE TABLE IF NOT EXISTS `ticket` (
  `NumeroTicket` int(11) NOT NULL AUTO_INCREMENT,
  `Subtotal` decimal(10,2) NOT NULL,
  `IdEmpleado` int(11) NOT NULL,
  PRIMARY KEY (`NumeroTicket`),
  KEY `IdEmpleado` (`IdEmpleado`),
  CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`IdEmpleado`) REFERENCES `empleado` (`IdEmpleado`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla supercampestre.ticket: ~0 rows (aproximadamente)

-- Volcando estructura para tabla supercampestre.venta
CREATE TABLE IF NOT EXISTS `venta` (
  `CodigoProducto` int(20) NOT NULL,
  `NumeroTicket` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`CodigoProducto`,`NumeroTicket`),
  KEY `NumeroTicket` (`NumeroTicket`),
  CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`CodigoProducto`) REFERENCES `producto` (`CodigoProducto`) ON UPDATE CASCADE,
  CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`NumeroTicket`) REFERENCES `ticket` (`NumeroTicket`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla supercampestre.venta: ~0 rows (aproximadamente)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
