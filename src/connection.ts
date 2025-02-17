import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Client } = pg;

const client = new Client ({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const connectToDb = async() => {
    try{
        await client.connect();
        console.log('Connected to database.')
    } catch (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
};

export { client, connectToDb };

