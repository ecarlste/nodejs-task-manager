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

router.get('', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send();
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

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return res.status(404).send(req.body);
    }

    return res.send(task);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).send();
    }

    return res.send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default router;
