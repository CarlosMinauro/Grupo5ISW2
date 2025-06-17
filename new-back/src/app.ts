import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import expenseRoutes from './routes/expense.routes';
import budgetRoutes from './routes/budget.routes';
import categoryRoutes from './routes/category.routes';
import accountStatusRoutes from './routes/account-status.routes';
import creditCardRoutes from './routes/credit-card.routes';
import sequelize from './config/database';
// Import all models for explicit sync
// import { User, Category, Expense, Budget, AccessLog, PasswordReset } from './models';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/account-status', accountStatusRoutes);
app.use('/api/cards', creditCardRoutes);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Database connection and server start
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Database synchronization is handled by migrations.
    // await sequelize.sync({ models: [User, Expense, Budget, AccessLog, PasswordReset], alter: true }); 
    // console.log('Database synchronized (Role and Category tables already exist).');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('Registered routes:');
      app._router.stack.forEach((r: any) => {
        if (r.route && r.route.path) {
          console.log(`${Object.keys(r.route.methods).join(', ').toUpperCase()} ${r.route.path}`);
        }
      });
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer(); 