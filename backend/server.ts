import express from 'express';
import { body, validationResult } from 'express-validator';
import { Router } from 'express';

const app = express();

const userRouter = Router();
const emailRouter = Router();
const PORT = 3000;

app.listen(PORT, (error) => {
  console.log('Server listening on port 3000')
  if(error)
    throw error;
})

app.use('/user', userRouter);
app.use('/email', emailRouter);
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

emailRouter.post('/', (req, res) => {
  console.log(req.body);
  res.json({ received: true });
})

  // const result = validationResult(req);
  // if (result.isEmpty()){
  //   return res.send('Enter valid email')
  // }
  // res.send({ errors: result.array() })