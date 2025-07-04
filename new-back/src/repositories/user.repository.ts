import { BaseRepository } from './base.repository';
import User from '../models/user.model';
import { IUser } from '../interfaces/models';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: { email } as Partial<IUser>,
      attributes: ['id', 'name', 'email', 'password_hash', 'role_id'],
    });
  }

  async findByRole(roleId: number): Promise<User[]> {
    return this.findBy({ role_id: roleId } as Partial<IUser>);
  }

  async createAdditionalUser(userData: Partial<IUser>): Promise<User> {
    return this.create(userData);
  }

  async findAdditionalUsers(parentUserId: number): Promise<User[]> {
    return this.findBy({ parent_user_id: parentUserId } as Partial<IUser>);
  }
} 