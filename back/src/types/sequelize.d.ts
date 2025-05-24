import { Model, DataTypes, Sequelize } from 'sequelize';

declare global {
    interface SequelizeModel {
        (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Model;
    }
} 