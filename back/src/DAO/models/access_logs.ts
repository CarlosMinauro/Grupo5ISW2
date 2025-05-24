import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';

interface AccessLogAttributes {
    id: number;
    user_id: number;
    action: string;
    access_time: Date;
    firstaccess: boolean;
}

interface AccessLogCreationAttributes extends Omit<AccessLogAttributes, 'id'> {}

export default (sequelize: Sequelize): ModelStatic<Model<AccessLogAttributes, AccessLogCreationAttributes>> => {
    class Access_logs extends Model<AccessLogAttributes, AccessLogCreationAttributes> implements AccessLogAttributes {
        public id!: number;
        public user_id!: number;
        public action!: string;
        public access_time!: Date;
        public firstaccess!: boolean;
    }

    Access_logs.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            action: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            access_time: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            firstaccess: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            }
        },
        {
            sequelize,
            tableName: 'Access_logs',
            modelName: 'Access_logs',
            timestamps: false,
        }
    );

    return Access_logs;
}; 