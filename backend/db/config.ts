import dotenv from 'dotenv';
dotenv.config({ path: '../.env'})

export const DATABASE_URL = process.env.DATABASE_URL

const JWT_SECRET_VALUE = process.env.JWT_SECRET;
if (!JWT_SECRET_VALUE) {
  throw new Error('No signature')
}
export const JWT_SECRET:string = JWT_SECRET_VALUE;