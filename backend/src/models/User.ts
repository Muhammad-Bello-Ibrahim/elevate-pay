import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import bcrypt from 'bcryptjs';

export interface UserAttributes {
  id: string;
  name: string;
  phone: string;
  email: string;
  nin: string;
  password_hash: string;
  profile_pic?: string;
  current_level: number;
  badges: string[];
  is_activated: boolean;
  activation_date?: Date;
  total_earned: number;
  available_balance: number;
  pending_withdrawals: number;
  referral_code: string;
  phone_verified: boolean;
  email_verified: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 
  'id' | 'profile_pic' | 'current_level' | 'badges' | 'is_activated' | 
  'activation_date' | 'total_earned' | 'available_balance' | 'pending_withdrawals' |
  'phone_verified' | 'email_verified' | 'last_login' | 'created_at' | 'updated_at'
> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public phone!: string;
  public email!: string;
  public nin!: string;
  public password_hash!: string;
  public profile_pic?: string;
  public current_level!: number;
  public badges!: string[];
  public is_activated!: boolean;
  public activation_date?: Date;
  public total_earned!: number;
  public available_balance!: number;
  public pending_withdrawals!: number;
  public referral_code!: string;
  public phone_verified!: boolean;
  public email_verified!: boolean;
  public last_login?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Instance methods
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }

  public toJSON(): Partial<UserAttributes> {
    const values = { ...this.get() } as any;
    delete values.password_hash;
    return values;
  }

  public getCurrentLevelName(): string {
    const levels = ['Starter', 'Basic', 'Growth', 'Expansion', 'Elite'];
    return levels[this.current_level] || 'Starter';
  }

  public getChainProgress(): { completed: number; total: number; percentage: number } {
    // This will be calculated based on referrals - for now return basic structure
    const total = parseInt(process.env.MAX_CHAIN_SIZE || '31');
    const completed = 0; // Will be calculated from referrals
    return {
      completed,
      total,
      percentage: (completed / total) * 100
    };
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
        notEmpty: true
      }
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      validate: {
        is: /^(\+234|0)[789][01]\d{8}$/ // Nigerian phone number format
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    nin: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
      validate: {
        len: [11, 11],
        isNumeric: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    profile_pic: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    current_level: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 4
      }
    },
    badges: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      get() {
        const value = this.getDataValue('badges') as unknown as string;
        return value ? JSON.parse(value) : [];
      },
      set(value: string[]) {
        this.setDataValue('badges', JSON.stringify(value) as any);
      }
    },
    is_activated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    activation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    total_earned: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    available_balance: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    pending_withdrawals: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    referral_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    phone_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
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
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user: User) => {
        if (!user.referral_code) {
          // Generate unique referral code
          const code = user.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7);
          user.referral_code = code;
        }
      }
    },
    indexes: [
      { fields: ['phone'] },
      { fields: ['email'] },
      { fields: ['nin'] },
      { fields: ['referral_code'] },
      { fields: ['is_activated'] }
    ]
  }
);

export default User;