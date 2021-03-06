/* eslint-disable no-underscore-dangle */
import { Router } from 'express';
import Task from '../models/task';
import auth from '../middleware/auth';

const router = new Router();

router.post('', auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('', auth, async (req, res) => {
  let conditions = { owner: req.user._id };

  if (req.query.completed) {
    conditions = { ...conditions, completed: req.query.completed };
  }

  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');

    if (!['asc', 'desc'].includes(parts[1])) {
      return res.status(400).send({ error: 'Invalid orderyBy direction specified' });
    }

    sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
  }

  const options = {
    limit: parseInt(req.query.limit, 10),
    skip: parseInt(req.query.skip, 10),
    sort
  };

  try {
    const tasks = await Task.find(conditions, null, options);
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    return res.send(task);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send(req.body);
    }

    Object.keys(req.body).forEach(prop => {
      task[prop] = req.body[prop];
    });
    task.save();

    return res.send(task);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    return res.send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default router;
