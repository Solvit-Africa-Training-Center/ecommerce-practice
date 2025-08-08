import { Sequelize } from "sequelize";
import { UserModal, User } from "./Users";
import { RoleModel, Role } from "./Roles";
interface Modals {
  User: typeof User;
  Role: typeof Role;
  Profile: typeof Profile;
}
export const AllModal = (sequelize: Sequelize): Modals => {
  return {
    User: UserModal(sequelize),
    Role: RoleModel(sequelize),
  };
};
