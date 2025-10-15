CREATE DATABASE IF NOT EXISTS supercampestre;
USE SuperCampestre;

CREATE TABLE Departamento (
    IdDepartamento INT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(255)
);

CREATE TABLE Empleado (
    IdEmpleado INT PRIMARY KEY,
    Puesto VARCHAR(20) NOT NULL,
    Sueldo DECIMAL(10, 2) NOT NULL,
    RFC VARCHAR(13) UNIQUE NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Telefono VARCHAR(15),
    Usuario VARCHAR(50) NOT NULL,
    Contrasena VARCHAR(80) UNIQUE NOT NULL
);

CREATE TABLE Producto (
    CodigoProducto INT(20) PRIMARY KEY,
    Precio DECIMAL(10, 2) NOT NULL,
    IdDepartamento INT NOT NULL,
    Descripcion VARCHAR(255),
    ClaveSAT VARCHAR(50),
    ClaveUnidadMedida VARCHAR(50),
    Stock INT NOT NULL DEFAULT 0,
    RutaFoto VARCHAR(255),

    FOREIGN KEY (IdDepartamento) REFERENCES Departamento(IdDepartamento)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);


CREATE TABLE Ticket (
    NumeroTicket INT PRIMARY KEY AUTO_INCREMENT,
    Subtotal DECIMAL(10, 2) NOT NULL,
    IdEmpleado INT NOT NULL,

    FOREIGN KEY (IdEmpleado) REFERENCES Empleado(IdEmpleado)
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

CREATE TABLE Factura (
    IdFactura INT PRIMARY KEY,
    Cliente VARCHAR(150),
    TipoCFDI VARCHAR(10),
    ModoPago VARCHAR(50),
    Telefono VARCHAR(15)

);

CREATE TABLE Venta (
    CodigoProducto INT(20) NOT NULL,
    NumeroTicket INT NOT NULL,
    Cantidad INT NOT NULL,
    Subtotal DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (CodigoProducto, NumeroTicket),

    FOREIGN KEY (CodigoProducto) REFERENCES Producto(CodigoProducto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    FOREIGN KEY (NumeroTicket) REFERENCES Ticket(NumeroTicket)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


