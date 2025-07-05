import { BaseRepository } from './base.repository';
import PasswordReset from '../models/password-reset.model';
import { IPasswordReset } from '../interfaces/models';
import { Op } from 'sequelize';

export class PasswordResetRepository extends BaseRepository<PasswordReset> {
  constructor() {
    super(PasswordReset);
  }

  async findByToken(token: string): Promise<PasswordReset | null> {
    return this.findOne({ token } as Partial<IPasswordReset>);
  }

  async findByUserId(userId: number): Promise<PasswordReset[]> {
    return this.findBy({ usuarioId: userId } as Partial<IPasswordReset>);
  }

  async deleteExpiredTokens(): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const result = await this.model.destroy({
      where: {
        created_at: {
          [Op.lt]: oneHourAgo,
        },
      },
    });
    return result;
  }

  async deleteUserTokens(userId: number): Promise<number> {
    const result = await this.model.destroy({
      where: {
        usuarioId: userId,
      },
    });
    return result;
  }
} 