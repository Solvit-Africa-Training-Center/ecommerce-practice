import databaseConfig from "../config/config";
import { Sequelize } from "sequelize";
import { AllModal } from "./models";
interface ConfigInterface {
  username: string;
  password: string;
  database: string;
  port: number;
  host: string;
}

const dbConnection = () => {
  const db_config = databaseConfig() as ConfigInterface;
  const sequelize = new Sequelize({
    ...db_config,
    dialect: "postgres",
  });
  sequelize.authenticate().then(() => {
    console.log("databasee Connected");
  });
  return sequelize;
};

const sequelizeInstance = dbConnection();
const models = AllModal(sequelizeInstance);

if (models.User.associate) models.User.associate(models);
if (models.Role.associate) models.Role.associate(models);
if (models.Order.associate) models.Order.associate(models);
if (models.Product.associate) models.Product.associate(models);
if (models.ProductCategory.associate) models.ProductCategory.associate(models);
if (models.OrderItem.associate) models.OrderItem.associate(models);

export const Database = { ...models, database: sequelizeInstance };
