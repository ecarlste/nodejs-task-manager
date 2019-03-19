import { Router } from 'express';
import User from '../models/user';

const router = new Router();

router.post('', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }

    return res.send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send(req.body);
    }

    Object.keys(req.body).forEach(prop => {
      user[prop] = req.body[prop];
    });

    await user.save();

    return res.send(user);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    return res.send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    res.send(user);
  } catch (error) {
    res.status(401).send();
  }
});

export default router;