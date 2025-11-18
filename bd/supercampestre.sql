-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for supercampestre
DROP DATABASE IF EXISTS `supercampestre`;
CREATE DATABASE IF NOT EXISTS `supercampestre` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `supercampestre`;

-- Dumping structure for table supercampestre.departamento
DROP TABLE IF EXISTS `departamento`;
CREATE TABLE IF NOT EXISTS `departamento` (
  `IdDepartamento` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdDepartamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table supercampestre.departamento: ~13 rows (approximately)
REPLACE INTO `departamento` (`IdDepartamento`, `Nombre`, `Descripcion`) VALUES
	(1, 'Mercancia_General', 'Mercancia en general'),
	(2, 'Jugos_Y_Refrescos', 'Jugos y refrescos'),
	(3, 'Papeleria', 'Artículos de papelería y oficina'),
	(5, 'Productos_Empaquetados', 'Alimentos y bienes preempaquetados'),
	(6, 'Lacteos', 'Leche, queso, yogur y otros lácteos'),
	(7, 'Cerveza', 'Bebidas alcohólicas (Cerveza)'),
	(8, 'Cigarros', 'Productos de tabaco y cigarros'),
	(9, 'Articulos_Sin_Codigo', 'Artículos con código generado o manual'),
	(10, 'Abarrotes_Comestibles', 'Alimentos secos y procesados comestibles'),
	(11, 'Frutas_y_Verduras', 'Frutas y verduras'),
	(12, 'Abarrotes_No_Comestibles', 'Productos de limpieza y cuidado personal'),
	(13, 'Dulces', 'Golosinas, chicles y confitería'),
	(14, 'Carniceria', 'Carniceria');

-- Dumping structure for table supercampestre.empleado
DROP TABLE IF EXISTS `empleado`;
CREATE TABLE IF NOT EXISTS `empleado` (
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

-- Dumping data for table supercampestre.empleado: ~3 rows (approximately)
REPLACE INTO `empleado` (`IdEmpleado`, `Puesto`, `Sueldo`, `RFC`, `Nombre`, `Telefono`, `Usuario`, `Contrasena`) VALUES
	(4, 'gerente', 15500.00, 'REPR950101XYZ', 'Reynaldo Daniel Reyes Parra', '8112345678', 'Daniel', '$2b$10$mC34hlvl8L0EDhsqEJU3lup1guyxX7Twg90e0oxIBZ7O2/8soWZKi'),
	(1, 'admin', 15500.00, 'RAZL950101XYZ', 'Raul Adriell Zavala Liras', '8112345678', 'Raul', '$2b$10$j3HrSTmP7.HdO3RlZjoqkenZL7PNrY.HWaQY/3z.5k4ptueAep3aO'),
	(2, 'almacenista', 15500.00, 'GAOG950101XYZ', 'Gael Onofre Garcia', '8112345678', 'Gael', '$2b$10$yJKnqxTxNKZACNj1Y7keIehlMBSc.cu1e8G7uOkQjjelx/s4v1.fy');

-- Dumping structure for table supercampestre.factura
DROP TABLE IF EXISTS `factura`;


-- Dumping data for table supercampestre.factura: ~0 rows (approximately)

-- Dumping structure for table supercampestre.producto
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
  `IVA` tinyint(4) DEFAULT 0,
  `Activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`CodigoProducto`),
  KEY `IdDepartamento` (`IdDepartamento`),
  CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`IdDepartamento`) REFERENCES `departamento` (`IdDepartamento`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table supercampestre.producto: ~10 rows (approximately)
REPLACE INTO `producto` (`CodigoProducto`, `Precio`, `IdDepartamento`, `Descripcion`, `ClaveSAT`, `ClaveUnidadMedida`, `Stock`, `RutaFoto`, `IVA`, `Activo`) VALUES
	(1, 35.00, 1, 'HOla', '50171831', 'pz', 9, NULL, 0, 1),
	(25, 31.00, 1, 'Bolsa de hielo', '50202302 ', 'pz', 63, NULL, 0, 1),
	(26, 30.00, 1, 'Tortillas 1Kg', '50221300', 'pz', 96, 'null', 0, 1),
	(27, 45.00, 1, 'Garrafon Liv', '50202301', 'pz', 15, 'null', 0, 1),
	(1035, 35.00, 6, 'Salsa Macha', '50171831', 'pz', 9, NULL, 1, 1),
	(1048, 20.00, 1, 'Bolsa de hielo para enfriar chica', '50202302', 'pz', 30, NULL, 0, 1),
	(1049, 28.00, 1, 'Bolsa de hielo para enfriar grande', '50202302', 'pz', 14, NULL, 0, 1),
	(1077, 200.00, 1, 'Envase de Garrafon', '24112601', 'pz', 0, NULL, 0, 1),
	(45554, 30.00, 1, 'Paraversijalaeliva', '123', 'pz', 16, NULL, 1, 1),
	(1333855, 60.00, 11, 'tercerica', '1516', 'pz', 21, NULL, 1, 1);

-- Dumping structure for table supercampestre.ticket
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table supercampestre.ticket: ~21 rows (approximately)
REPLACE INTO `ticket` (`NumeroTicket`, `Subtotal`, `IdEmpleado`, `FechaHora`, `MetodoPago`) VALUES
	(2, 80.00, 1, '2025-11-14 20:28:20', 'Tarjeta'),
	(3, 50.00, 1, '2025-11-17 18:29:00', 'Efectivo'),
	(4, 50.00, 1, '2025-11-17 18:30:59', 'Efectivo'),
	(5, 81.00, 1, '2025-11-17 18:31:50', 'Efectivo'),
	(6, 61.00, 1, '2025-11-17 18:32:35', 'Tarjeta'),
	(7, 30.00, 1, '2025-11-17 18:34:30', 'Efectivo'),
	(8, 113.00, 1, '2025-11-17 18:37:07', 'Efectivo'),
	(9, 50.00, 1, '2025-11-17 19:00:43', 'Cheque'),
	(10, 50.00, 1, '2025-11-17 19:01:10', 'Tarjeta'),
	(11, 250.00, 1, '2025-11-17 19:01:29', 'Cheque'),
	(12, 50.00, 1, '2025-11-17 21:14:07', 'Efectivo'),
	(13, 30.00, 1, '2025-11-17 21:16:23', 'Tarjeta'),
	(14, 31.00, 1, '2025-11-17 21:23:15', 'Efectivo'),
	(15, 50.00, 1, '2025-11-17 21:28:21', 'Tarjeta'),
	(16, 62.00, 1, '2025-11-17 21:28:36', 'Cheque'),
	(17, 31.00, 1, '2025-11-17 22:38:09', 'Efectivo'),
	(20, 50.00, 1, '2025-11-17 22:54:33', 'Efectivo'),
	(21, 30.00, 1, '2025-11-18 00:37:58', 'Efectivo'),
	(22, 32.40, 1, '2025-11-18 00:45:10', 'Efectivo'),
	(23, 63.40, 1, '2025-11-18 00:48:19', 'Tarjeta'),
	(24, 97.20, 1, '2025-11-18 01:24:35', 'Tarjeta');

-- Dumping structure for table supercampestre.venta
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

-- Dumping data for table supercampestre.venta: ~28 rows (approximately)
REPLACE INTO `venta` (`CodigoProducto`, `NumeroTicket`, `Cantidad`, `Subtotal`) VALUES
	(1, 2, 1, 50.00),
	(1, 3, 1, 50.00),
	(1, 4, 1, 50.00),
	(1, 5, 1, 50.00),
	(1, 8, 1, 50.00),
	(1, 9, 1, 50.00),
	(1, 10, 1, 50.00),
	(1, 11, 5, 250.00),
	(1, 12, 1, 50.00),
	(1, 15, 1, 50.00),
	(1, 20, 1, 50.00),
	(25, 5, 1, 31.00),
	(25, 6, 1, 31.00),
	(25, 14, 1, 31.00),
	(25, 16, 2, 62.00),
	(25, 17, 1, 31.00),
	(25, 23, 1, 31.00),
	(26, 2, 1, 30.00),
	(26, 6, 1, 30.00),
	(26, 7, 1, 30.00),
	(26, 13, 1, 30.00),
	(1035, 8, 1, 35.00),
	(1049, 8, 1, 28.00),
	(45554, 21, 1, 30.00),
	(45554, 22, 1, 30.00),
	(45554, 23, 1, 30.00),
	(45554, 24, 1, 30.00),
	(1333855, 24, 1, 60.00);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
