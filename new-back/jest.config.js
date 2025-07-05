module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/tests/**/*.ts',
  ],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testPathIgnorePatterns: ['<rootDir>/src/tests/setup.ts'],
  testEnvironmentOptions: {
    NODE_ENV: 'test',
    DB_HOST: 'localhost',
    DB_PORT: '5432',
    DB_NAME: 'pw_2025_0_test_db',
    DB_USER: 'Fach',
    DB_PASSWORD: 'kenay123',
    JWT_SECRET: 'mi_clave_super_segura_123!',
    CORS_ORIGIN: 'http://localhost:3000'
  }
}; 