export const configuration = (): configurationType => ({
  //? SERVER
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT || '3000', 10),
  //? CORE
  ENABLE_DOCUMENTATION: process.env.ENABLE_DOCUMENTATION === 'true',
  //? DATABASE
  DATABASE_URL: process.env.DATABASE_URL,
  //? JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXP: process.env.JWT_EXP,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_EXP_REFRESH: process.env.JWT_EXP_REFRESH,
  //? SECURITY
  ALLOWED_API_KEYS: process.env.ALLOWED_API_KEYS,
  //? SENDGRID
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
});

type configurationType = {
  NODE_ENV: string;
  PORT: number;
  ENABLE_DOCUMENTATION: boolean;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXP: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_EXP_REFRESH: string;
  ALLOWED_API_KEYS: string;
  SENDGRID_API_KEY: string;
  SENDGRID_FROM_EMAIL: string;
};
