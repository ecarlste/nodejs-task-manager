import express from 'express';
import './db/mongoose';
import { tasksRouter, usersRouter } from './routes';

const app = express();

app.use(express.json());
app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);

module.exports = app;
