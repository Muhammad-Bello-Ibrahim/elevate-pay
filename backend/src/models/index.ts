import User from './User';
import Referral from './Referral';
import Transaction from './Transaction';
import Notification from './Notification';
import Leaderboard from './Leaderboard';

// Define associations
export function setupAssociations() {
  // User associations
  User.hasMany(Referral, { foreignKey: 'parent_id', as: 'children' });
  User.hasMany(Referral, { foreignKey: 'child_id', as: 'parents' });
  User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
  User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
  User.hasMany(Leaderboard, { foreignKey: 'user_id', as: 'leaderboardEntries' });

  // Referral associations
  Referral.belongsTo(User, { foreignKey: 'parent_id', as: 'parent' });
  Referral.belongsTo(User, { foreignKey: 'child_id', as: 'child' });

  // Transaction associations
  Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Notification associations
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Leaderboard associations
  Leaderboard.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
}

export {
  User,
  Referral,
  Transaction,
  Notification,
  Leaderboard
};