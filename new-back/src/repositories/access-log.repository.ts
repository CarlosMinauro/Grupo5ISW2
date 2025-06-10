import { BaseRepository } from './base.repository';
import AccessLog from '../models/access-log.model';
import { IAccessLog } from '../interfaces/models';
import { Op } from 'sequelize';

export class AccessLogRepository extends BaseRepository<AccessLog> {
  constructor() {
    super(AccessLog);
  }

  async findByUserId(userId: number): Promise<AccessLog[]> {
    return this.findBy({ user_id: userId } as Partial<IAccessLog>);
  }

  async findByDateRange(userId: number, startDate: Date, endDate: Date): Promise<AccessLog[]> {
    return this.model.findAll({
      where: {
        user_id: userId,
        access_time: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['access_time', 'DESC']],
    });
  }

  async getFirstAccess(userId: number): Promise<AccessLog | null> {
    return this.model.findOne({
      where: {
        user_id: userId,
        firstaccess: true,
      },
    });
  }

  async getLastAccess(userId: number): Promise<AccessLog | null> {
    return this.model.findOne({
      where: {
        user_id: userId,
      },
      order: [['access_time', 'DESC']],
    });
  }
} 