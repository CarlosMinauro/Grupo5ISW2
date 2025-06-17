import dotenv from 'dotenv';
import { sequelize } from '../config/database';

// Load environment variables
dotenv.config();

// Set test environment
process.env.NODE_ENV = 'test';

// Setup before all tests
beforeAll(async () => {
  // Connect to test database
  await sequelize.authenticate();
});

// Cleanup after all tests
afterAll(async () => {
  // Close database connection
  await sequelize.close();
}); 