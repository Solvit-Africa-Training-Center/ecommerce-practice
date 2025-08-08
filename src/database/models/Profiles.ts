import { Sequelize, Model, DataTypes } from "sequelize";

interface ProfileAttribute {
  id: string;
  userId: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  profilePicture?: string;
  bio?: string;
  gender?: string;
  dateOfBirth?: Date;
  country?: string;
  city?: string;
  address?: string;
  roleId: string;
  isVerified: boolean;
  lastLogin?: Date;
  isActive: boolean;
  updatedAt: Date;
  deletedAt?: null;
  createdAt?: Date;
}
export interface ProfileCreationAttribute
  extends Omit<
    ProfileAttribute,
    "id" | "deletedAt" | "createdAt" | "updatedAt"
  > {
  id?: string;
  deletedAt?: null;
  createdAt?: Date;
  updatedAt?: Date;
}
export class Profile
  extends Model<ProfileAttribute, ProfileCreationAttribute>
  implements ProfileAttribute
{
  public id!: string;
  public userId!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone?: string;
  public profilePicture?: string;
  public bio?: string;
  public gender?: string;
  public dateOfBirth?: Date;
  public country?: string;
  public city?: string;
  public address?: string;
  public roleId!: string;
  public isVerified!: boolean;
  public lastLogin?: Date;
  public isActive!: boolean;
  public updatedAt!: Date;
  public deletedAt: null = null;
  public createdAt: Date = new Date();
  public toJSON(): object | ProfileAttribute {
    return {
      id: this.id,
      userId: this.userId, // Add userId to JSON output
      name: this.name,
      email: this.email,
      phone: this.phone,
      profilePicture: this.profilePicture,
      bio: this.bio,
      gender: this.gender,
      dateOfBirth: this.dateOfBirth,
      country: this.country,
      city: this.city,
      address: this.address,
      roleId: this.roleId,
      isVerified: this.isVerified,
      lastLogin: this.lastLogin,
      isActive: this.isActive,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };
  }
  static associate(models: any) {
    Profile.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    Profile.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  }
}
export const ProfileModel = (sequelize: Sequelize) => {
  Profile.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Profiles",
      tableName: "profiles",
      timestamps: true,
      paranoid: true,
    },
  );
  return Profile;
};
