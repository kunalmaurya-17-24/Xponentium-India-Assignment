const { Sequelize, DataTypes } = require('sequelize');

// Use in-memory database for tests, file-based for production
const storage = process.env.NODE_ENV === 'test' ? ':memory:' : './expenses.db';
  const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false // Disable logging in all environments
});

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

// Sync database only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  sequelize.sync();
}

module.exports = { sequelize, Expense };
