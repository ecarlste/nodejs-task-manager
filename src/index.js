import express from 'express';
import './db/mongoose';
import { tasksRouter, usersRouter } from './routes';

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Express server listening on port ${port}...`);
});
