import { Router } from 'express';
import User from '../models/user';
import auth from '../middleware/auth';

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
    res.send({ user: user.getPublicProfile(), token });
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

router.put('/:id', auth, async (req, res) => {
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

router.delete('/:id', auth, async (req, res) => {
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

export default router;
