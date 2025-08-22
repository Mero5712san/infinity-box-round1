// config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        logging: false
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Sequelize connected to MySQL!');
    } catch (err) {
        console.error('DB connection error:', err);
        throw err;
    }
};
