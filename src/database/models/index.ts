import { Sequelize } from 'sequelize';
import { UserModal, User } from './Users';
import { RoleModel, Role } from './Roles';
import { ProfileModel, Profile } from './Profiles';
interface Modals {
  User: typeof User;
  Role: typeof Role;
  Profile: typeof Profile;
}
export const AllModal = (sequelize: Sequelize): Modals => ({
  User: UserModal(sequelize),
  Role: RoleModel(sequelize),
  Profile: ProfileModel(sequelize),
});
