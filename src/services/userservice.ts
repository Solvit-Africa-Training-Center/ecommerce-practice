import { Database } from "../database";
import { AddUserInterface, UserInterface } from "../types/userInterface";

export class UserService {
  static async createUser(userData: AddUserInterface): Promise<UserInterface> {
    try {
      const user = await Database.User.create();
      return user.toJSON() as UserInterface;
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers(): Promise<UserInterface[]> {
    try {
      const users = await Database.User.findAll();
      return users.map((user) => user.toJSON() as UserInterface);
    } catch (error) {
      throw error;
    }
  }
}
