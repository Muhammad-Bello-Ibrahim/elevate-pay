import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TransactionAttributes {
  id: string;
  user_id: string;
  type: 'fund' | 'withdrawal' | 'activation' | 'earning' | 'commission';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference: string;
  description?: string;
  payment_method?: string;
  gateway_reference?: string;
  gateway_response?: object;
  metadata?: object;
  created_at: Date;
  updated_at: Date;
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, 
  'id' | 'description' | 'payment_method' | 'gateway_reference' | 'gateway_response' | 'metadata' | 'created_at' | 'updated_at'
> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public id!: string;
  public user_id!: string;
  public type!: 'fund' | 'withdrawal' | 'activation' | 'earning' | 'commission';
  public amount!: number;
  public status!: 'pending' | 'completed' | 'failed' | 'cancelled';
  public reference!: string;
  public description?: string;
  public payment_method?: string;
  public gateway_reference?: string;
  public gateway_response?: object;
  public metadata?: object;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associations
  public user?: any;
}

Transaction.init(
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
    type: {
      type: DataTypes.ENUM('fund', 'withdrawal', 'activation', 'earning', 'commission'),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    reference: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    gateway_reference: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gateway_response: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('gateway_response') as unknown as string;
        return value ? JSON.parse(value) : null;
      },
      set(value: object) {
        this.setDataValue('gateway_response', value ? JSON.stringify(value) as any : null);
      }
    },
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('metadata') as unknown as string;
        return value ? JSON.parse(value) : null;
      },
      set(value: object) {
        this.setDataValue('metadata', value ? JSON.stringify(value) as any : null);
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
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['type'] },
      { fields: ['status'] },
      { fields: ['reference'] },
      { fields: ['gateway_reference'] },
      { fields: ['created_at'] }
    ]
  }
);

export default Transaction;