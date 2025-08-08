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

export const Database = { ...models, database: sequelizeInstance };
