import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js"; // Update this import based on your actual db instance

interface FormAttributes {
  id: string;
  title: string;
  fields: object; // store fields as JSON
  ownerId: string;
}

export class Form extends Model<FormAttributes> implements FormAttributes {
  public id!: string;
  public title!: string;
  public fields!: object;
  public ownerId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Form.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fields: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "owner_id",
    },
  },
  {
    sequelize,
    tableName: "forms",
    modelName: "Form",
    underscored: true,
  }
);

// If you want to associate it with User:
export const associateForm = (models: any) => {
  Form.belongsTo(models.User, { foreignKey: "5" });
};
