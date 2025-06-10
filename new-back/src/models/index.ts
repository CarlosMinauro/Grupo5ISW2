import User from './user.model';
import Role from './role.model';
import Category from './category.model';
import Expense from './expense.model';
import Budget from './budget.model';
import AccessLog from './access-log.model';
import PasswordReset from './password-reset.model';
import CreditCard from './credit-card.model';

// User - Role relationship
User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

// User - Expense relationship
User.hasMany(Expense, { foreignKey: 'user_id' });
Expense.belongsTo(User, { foreignKey: 'user_id' });

// User - Budget relationship
User.hasMany(Budget, { foreignKey: 'user_id' });
Budget.belongsTo(User, { foreignKey: 'user_id' });

// User - AccessLog relationship
User.hasMany(AccessLog, { foreignKey: 'user_id' });
AccessLog.belongsTo(User, { foreignKey: 'user_id' });

// User - PasswordReset relationship
User.hasMany(PasswordReset, { foreignKey: 'usuarioId' });
PasswordReset.belongsTo(User, { foreignKey: 'usuarioId' });

// User - CreditCard relationship
User.hasMany(CreditCard, { foreignKey: 'user_id' });
CreditCard.belongsTo(User, { foreignKey: 'user_id' });

// Category - Expense relationship
Category.hasMany(Expense, { foreignKey: 'category_id' });
Expense.belongsTo(Category, { foreignKey: 'category_id' });

// Category - Budget relationship
Category.hasMany(Budget, { foreignKey: 'category_id' });
Budget.belongsTo(Category, { foreignKey: 'category_id' });

export {
  User,
  Role,
  Category,
  Expense,
  Budget,
  AccessLog,
  PasswordReset,
  CreditCard,
}; 