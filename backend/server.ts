import express from 'express';
import { body, validationResult } from 'express-validator';
import { Router } from 'express';

const app = express();

const userRouter = Router();
const emailRouter = Router();
const PORT = 3000;

app.listen(PORT, (error) => {
  if(error)
    throw error;
})

app.use('/user', userRouter);
app.use('/email', emailRouter);
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

userRouter.post('/', (req, res) => {
  req.body
})