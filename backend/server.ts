import express from 'express';
import { body, validationResult } from 'express-validator';
import { Router } from 'express';
import cors from 'cors';

const app = express();

const userRouter = Router();
const emailRouter = Router();
const PORT = 3000;

app.listen(PORT, (error) => {
  console.log('Server listening on port 3000')
  if(error)
    throw error;
})
app.use(cors());
app.use(express.json());
app.use('/user', userRouter);
app.use('/email', emailRouter);
app.use(express.urlencoded({ extended: true}));

emailRouter.post(
  '/', 
  body('email').isEmail().notEmpty(), 
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({error: 'Enter a valid email'});
    }
    console.log(req.body)
});

  // const result = validationResult(req);
  // if (result.isEmpty()){
  //   return res.send('Enter valid email')
  // }
  // res.send({ errors: result.array() })