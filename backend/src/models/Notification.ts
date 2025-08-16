import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface NotificationAttributes {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'referral' | 'earning' | 'system' | 'achievement' | 'withdrawal' | 'activation';
  read_status: boolean;
  metadata?: object;
  created_at: Date;
  updated_at: Date;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 
  'id' | 'read_status' | 'metadata' | 'created_at' | 'updated_at'
> {}

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: string;
  public user_id!: string;
  public title!: string;
  public message!: string;
  public type!: 'referral' | 'earning' | 'system' | 'achievement' | 'withdrawal' | 'activation';
  public read_status!: boolean;
  public metadata?: object;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associations
  public user?: any;
}

Notification.init(
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255],
        notEmpty: true
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM('referral', 'earning', 'system', 'achievement', 'withdrawal', 'activation'),
      allowNull: false
    },
    read_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['type'] },
      { fields: ['read_status'] },
      { fields: ['created_at'] }
    ]
  }
);

export default Notification;