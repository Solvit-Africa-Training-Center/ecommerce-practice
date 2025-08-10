// models/Users.ts
import { Sequelize, Model, DataTypes } from 'sequelize';
import { Role } from './Roles';

interface UserAttribute {
  id: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

export interface UserCreationAttribute
  extends Omit<UserAttribute, 'id' | 'deletedAt' | 'createdAt' | 'updatedAt' | 'isEmailVerified'> {
  id?: string;
  isEmailVerified?: boolean;
  deletedAt?: null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Model<UserAttribute, UserCreationAttribute> implements UserAttribute {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public roleId!: string;
  public isEmailVerified!: boolean;
  public emailVerificationToken?: string;
  public emailVerificationExpires?: Date;
  public passwordResetToken?: string;
  public passwordResetExpires?: Date;
  public updatedAt!: Date;
  public deletedAt: null = null;
  public createdAt: Date = new Date();

  public toJSON(): object | UserAttribute {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      roleId: this.roleId,
      isEmailVerified: this.isEmailVerified,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };
  }

  static associate(models: { Role: typeof Role }): void {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });
  }
}

export const UserModal = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emailVerificationExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Users',
      tableName: 'users',
    },
  );
  return User;
};