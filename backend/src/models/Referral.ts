import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ReferralAttributes {
  id: string;
  parent_id: string;
  child_id: string;
  level: number;
  placement_type: 'direct' | 'system';
  chain_id?: string;
  position_in_chain?: number;
  is_active: boolean;
  earnings_paid: number;
  created_at: Date;
  updated_at: Date;
}

interface ReferralCreationAttributes extends Optional<ReferralAttributes, 
  'id' | 'chain_id' | 'position_in_chain' | 'is_active' | 'earnings_paid' | 'created_at' | 'updated_at'
> {}

class Referral extends Model<ReferralAttributes, ReferralCreationAttributes> implements ReferralAttributes {
  public id!: string;
  public parent_id!: string;
  public child_id!: string;
  public level!: number;
  public placement_type!: 'direct' | 'system';
  public chain_id?: string;
  public position_in_chain?: number;
  public is_active!: boolean;
  public earnings_paid!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associations
  public parent?: any;
  public child?: any;
}

Referral.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    child_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    placement_type: {
      type: DataTypes.ENUM('direct', 'system'),
      allowNull: false,
      defaultValue: 'direct'
    },
    chain_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    position_in_chain: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    earnings_paid: {
      type: DataTypes.DECIMAL(12, 2),
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
    modelName: 'Referral',
    tableName: 'referrals',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['parent_id'] },
      { fields: ['child_id'] },
      { fields: ['level'] },
      { fields: ['placement_type'] },
      { fields: ['chain_id'] },
      { fields: ['is_active'] },
      { fields: ['created_at'] }
    ]
  }
);

export default Referral;