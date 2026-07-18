DROP DATABASE IF EXISTS ciudad_clima;
CREATE DATABASE ciudad_clima;
USE ciudad_clima;

CREATE TABLE usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(225) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ciudad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  estado VARCHAR(100),
  codigo_pais CHAR(2) NOT NULL,
  codigo_postal CHAR(10),
  nombre_normalizado VARCHAR(100) NOT NULL,
  estado_normalizado VARCHAR(100) NOT NULL DEFAULT '',
  lat DECIMAL(9,6),
  lon DECIMAL(9,6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ciudad_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT uq_ciudad_usuario_nombre_estado
    UNIQUE (id_usuario, nombre_normalizado, estado_normalizado, codigo_pais)
);

CREATE TABLE planes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_ciudad INT NOT NULL,
  fecha DATE,
  actividad VARCHAR(100) NOT NULL,
  notas VARCHAR(100),
  completado BOOLEAN DEFAULT FALSE,
  clima_esperado VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_planes_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_planes_ciudad FOREIGN KEY (id_ciudad)
    REFERENCES ciudad(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE token_revocado (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token TEXT,
  id_usuario INT NOT NULL,
  expira_en TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_token_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);