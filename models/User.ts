// models/User.ts
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at?: Date;
}

// Optional fields during creation
type UserCreationAttributes = Optional<UserAttributes, "id" | "created_at">;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password_hash!: string;
  public readonly created_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
    timestamps: false, // because your table uses `created_at` not `createdAt`
  }
);
