import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface LeaderboardAttributes {
  id: string;
  user_id: string;
  month: number;
  year: number;
  total_earned: number;
  referrals_count: number;
  rank: number;
  created_at: Date;
  updated_at: Date;
}

interface LeaderboardCreationAttributes extends Optional<LeaderboardAttributes, 
  'id' | 'rank' | 'created_at' | 'updated_at'
> {}

class Leaderboard extends Model<LeaderboardAttributes, LeaderboardCreationAttributes> implements LeaderboardAttributes {
  public id!: string;
  public user_id!: string;
  public month!: number;
  public year!: number;
  public total_earned!: number;
  public referrals_count!: number;
  public rank!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associations
  public user?: any;
}

Leaderboard.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 2020
      }
    },
    total_earned: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    referrals_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Leaderboard',
    tableName: 'leaderboards',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['user_id', 'month', 'year'], unique: true },
      { fields: ['month', 'year'] },
      { fields: ['rank'] },
      { fields: ['total_earned'] }
    ]
  }
);

export default Leaderboard;