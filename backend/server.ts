import express, { type Request, type Response, type NextFunction} from 'express';
import { body, validationResult } from 'express-validator';
import { Router } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt, { type VerifyErrors, type JwtPayload } from 'jsonwebtoken';
import pool from './db/pool.js'
import { JWT_SECRET } from './db/config.js';
import { Resend } from 'resend';


const app = express();

const loginRouter = Router();
const emailRouter = Router();
const signUpRouter = Router();
const verifyRouter = Router();
const scoreRouter = Router();
const comfirmEmailRouter = Router();
const getScoreRouter = Router();
const PORT = 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

app.listen(PORT, (error) => {
  console.log('Server listening on port 3000')
  if(error)
    throw error;
})
app.use(cors());
app.use(express.json());
app.use('/login', loginRouter);
app.use('/email', emailRouter);
app.use('/signup', signUpRouter);
app.use('/verify', verifyRouter);
app.use('confirm-email', comfirmEmailRouter);
app.use('/save-score', scoreRouter);
app.use('/get-score', getScoreRouter);
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
  const signInToken = jwt.sign (
    {
      userId: user.id, 
      username: user.username
    }, JWT_SECRET,
    { expiresIn: '15h' }
  );
  res.json({signInToken});
})

signUpRouter.post('/', body('email').isEmail().notEmpty(), async (req, res) => {
  const { email, username, password } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(`INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id`, [email, hashedPassword, username]);

  const userId = result.rows[0].id;
  const signInToken = jwt.sign (
    {
      userId: userId, 
      username: username
    }, JWT_SECRET,
    { expiresIn: '5h' }
  );

  const emailConfirmToken = jwt.sign (
    {
      userId: userId
    }, JWT_SECRET,
    { expiresIn: '30m'}
  );

  const { data, error } = await resend.emails.send({
    from: "Memory card game []",
    to: [email],
    subject: `Hello ${username}`,
    html: `<strong>Welcome aboard</strong>To confirm your email, click<a href="http://localhost:5173/confirm-email/${emailConfirmToken}">here</a>`,
  });

  if (error) {
    return res.status(400).json({error});
  }

  res.json({signInToken});
})

verifyRouter.get('/', authenticateToken, async (req, res) => {
  res.json(req.user);
})

comfirmEmailRouter.get('/', authenticateToken, async (req, res) => {
  try { 
    await pool.query(`UPDATE users SET verified = $1 WHERE id = $2`, [true, req.user?.userId])
    res.sendStatus(200);
  } catch (error) {
    res.status(500);
  }
});

scoreRouter.post('/', authenticateToken, async (req, res) => {
  const { score, result, level } = req.body;
  const userId = req.user?.userId;
  try {
    await pool.query(`INSERT INTO scores (user_id, score, result, level) VALUES ($1, $2, $3, $4)`, [userId, score, result, level]);
    res.json({ saved: true});
  } catch (error) {
    res.status(500).json({saved: false});
  }
});

getScoreRouter.get('/', authenticateToken, async(req, res) => {
  const userId = req.user?.userId
  try {
    const result = await pool.query(`SELECT score, created_at, result FROM scores WHERE user_id = $1`, [userId]);
    const countXp = await pool.query(`SELECT SUM (score * 5 * CASE WHEN level = 'easy' THEN 0 WHEN level = 'medium' THEN 1.5 WHEN level = 'hard' THEN 2 END) AS total_xp FROM scores WHERE user_id = $1`, [userId]);
    res.json({ historicScore: result.rows, totalXp: countXp.rows[0].total_xp})
  } catch (error){
    console.log(error);
    res.status(500).json({error: 'No score has been stored'})
  }
})