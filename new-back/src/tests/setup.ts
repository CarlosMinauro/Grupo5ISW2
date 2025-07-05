import dotenv from 'dotenv';
import { sequelize } from '../config/database';

// Cargar variables de entorno
dotenv.config();

// Forzar uso de la base principal si no se especifica otra
process.env.DB_NAME = process.env.DB_NAME || 'pw-2025-0_db'; // Cambia aquí si tu base principal tiene otro nombre

// Setear variables de entorno solo si no existen
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || '5432';
process.env.DB_USER = process.env.DB_USER || 'Fach';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'kenay123';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_super_segura_123!';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Este archivo asegura que los tests de integración usen la base principal y cierren la conexión correctamente.

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('Test database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to test database:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
    console.log('Test database connection closed.');
  } catch (error) {
    console.error('Error closing test database connection:', error);
  }
}); 