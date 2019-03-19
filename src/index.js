import dotenv from 'dotenv';
import express from 'express';
import './db/mongoose';
import { tasksRouter, usersRouter } from './routes';

if (process.env.NODE_ENV === 'dev') {
  dotenv.config();
}

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Express server listening on port ${port}...`);
});
