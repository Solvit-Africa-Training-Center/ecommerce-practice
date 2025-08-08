import { Sequelize, Model, DataTypes } from "sequelize";

interface UserAttribute {
  id: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

export interface UserCreationAttribute
  extends Omit<UserAttribute, "id" | "deletedAt" | "createdAt" | "updatedAt"> {
  id?: string;
  deletedAt?: null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User
  extends Model<UserAttribute, UserCreationAttribute>
  implements UserAttribute
{
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public roleId!: string;
  public updatedAt!: Date;
  public deletedAt: null = null;
  public createdAt: Date = new Date();

  public toJSON(): object | UserAttribute {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      roleId: this.roleId,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };
  }

  static associate(models: any) {
    User.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
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
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Users",
      tableName: "users",
    },
  );
  return User;
};
