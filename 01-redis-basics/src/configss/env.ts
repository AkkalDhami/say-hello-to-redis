import dotenv from "dotenv";
dotenv.config();

interface ENV {
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
}

const env: ENV = {
  PORT: parseInt(process.env.PORT as string, 10) || 6000,
  DATABASE_URL: process.env.DATABASE_URL as string,
  REDIS_URL: process.env.REDIS_URL as string
};

export default env;
