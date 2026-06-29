import express, { type Request, type Response, type NextFunction} from 'express';
import { body, validationResult } from 'express-validator';
import { Router } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt, { type VerifyErrors, type JwtPayload } from 'jsonwebtoken';
import pool from './db/pool.js'
import { JWT_SECRET } from './db/config.js';


const app = express();

const loginRouter = Router();
const emailRouter = Router();
const signUpRouter = Router();
const verifyRouter = Router();
const PORT = 3000;

app.listen(PORT, (error) => {
  console.log('Server listening on port 3000')
  if(error)
    throw error;
})
app.use(cors());
app.use(express.json());
app.use('/login', loginRouter);
app.use('/email', emailRouter);
app.use(express.urlencoded({ extended: true}));

//Middleware

declare global {
  namespace Express {
    interface Request {
      user? : Decoded
    }
  }
}

type Decoded = {
  userId: number,
  username: string
}

function authenticateToken(req:Request, res:Response, next:NextFunction){
  const authHeader = req.headers['authorization'];
  if (!authHeader)
    return res.status(401).json({ error: 'No header provided' });
  const token = authHeader.split(' ')[1];
  if (!token)
    return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.user = decoded as Decoded;
    next();
  })
}

emailRouter.post('/', body('email').isEmail().notEmpty(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({error: 'Enter a valid email'});
  }
  const { email } = req.body;
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  if (result.rows.length === 0) {
    return res.json({login: false})
  }
  return res.json({login: true})
});

loginRouter.post('/', body('email').isEmail().notEmpty(), async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Email doesnt exist'});
  }
  const user = result.rows[0];
  const passwordCheck = await bcrypt.compare(password, user.password_hash);
  if (!passwordCheck) {
    return res.status(401).json({ error: 'Invalid credentials'});
  }
  const token = jwt.sign (
    {
      userId: user.id, 
      username: user.username
    }, JWT_SECRET,
    { expiresIn: '5h' }
  );
  res.json({token});
})

signUpRouter.post('/', body('email').isEmail().notEmpty(), async (req, res) => {
  const { email, username, password } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(`INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id`, [email, hashedPassword, username]);

  const userId = result.rows[0].id;
  const token = jwt.sign (
    {
      userId: userId, 
      username: username
    }, JWT_SECRET,
    { expiresIn: '5h' }
  );
  res.json({token});
})

verifyRouter.get('/', authenticateToken, async (req, res) => {
  res.json(req.user)
})
