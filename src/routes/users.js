/* eslint-disable no-underscore-dangle */
import { Router } from 'express';
import multer from 'multer';
import auth from '../middleware/auth';
import User from '../models/user';

const router = new Router();

router.post('', async (req, res) => {
  const user = new User(req.body);

  try {
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(401).send();
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token != req.token;
    });
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/me', auth, async (req, res) => {
  res.send(req.user);
});

router.put('/me', auth, async (req, res) => {
  try {
    Object.keys(req.body).forEach(prop => {
      req.user[prop] = req.body[prop];
    });

    await req.user.save();

    return res.send(req.user);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.delete('/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    return res.send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

const upload = multer({
  dest: `avatars`
});

router.post('/me/avatar', upload.single('avatar'), (req, res) => {
  res.send();
});

export default router;
