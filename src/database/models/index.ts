import { Sequelize } from "sequelize";
import { UserModal, User } from "./Users";
interface Modals {
  User: typeof User;
}
export const AllModal = (sequelize: Sequelize): Modals => {
  return {
    User: UserModal(sequelize),
  };
};
