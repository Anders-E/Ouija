import dotenv from 'dotenv';

// Read environment variables
dotenv.config();

export const config: OuijaConfig = {
    port: parseInt(process.env.PORT) || 3000,
    environment: process.env.NODE_ENV
};

interface OuijaConfig {
    port: number;
    environment: string;
}
