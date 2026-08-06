import dotenv from 'dotenv';
dotenv.config({ path: '../.env'})

export const DB_URL = process.env.DB_URL

const JWT_SECRET_VALUE = process.env.JWT_SECRET;
if (!JWT_SECRET_VALUE) {
  throw new Error('No signature')
}
export const JWT_SECRET:string = JWT_SECRET_VALUE;