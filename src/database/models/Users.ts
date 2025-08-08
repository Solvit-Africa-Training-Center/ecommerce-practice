import { Sequelize, Model, DataTypes } from "sequelize";

interface UserAttribute {
  id: string;
  name: string;
  email: string;
  gender: "male" | "female" | "other";
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}
export interface UserCreationAttribute
  extends Omit<UserAttribute, "id" | "role" | "password"> {
  id?: string;
  role?: string;
  password?: string;
}

export class User
  extends Model<UserAttribute, UserCreationAttribute>
  implements UserAttribute
{
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public gender!: "male" | "female" | "other";
  public updatedAt!: Date;
  public deletedAt: null = null;
  public createdAt: Date = new Date();

  public toJSON(): object | UserAttribute {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      gender: this.gender,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };
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
      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "User",
      tableName: "users",
    },
  );
  return User;
};
