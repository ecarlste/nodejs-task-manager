/* eslint-disable no-underscore-dangle */
import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import auth from '../middleware/auth';
import User from '../models/user';
import { sendCancellationEmail, sendWelcomeEmail } from '../emails/account';

const router = new Router();

router.post('', async (req, res) => {
  const user = new User(req.body);

  try {
    const token = await user.generateAuthToken();
    sendWelcomeEmail(user.email, user.name);
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
      return token.token !== req.token;
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
    sendCancellationEmail(req.user.email, req.user.name);
    await req.user.remove();
    return res.send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

const upload = multer({
  limits: {
    fileSize: 1048576
  },
  fileFilter(req, file, callback) {
    const pattern = new RegExp(/\.(jpg|jpeg|png)$/i);
    if (!pattern.test(file.originalname)) {
      callback(new Error('File must be a JPG, JPEG, or PNG'));
    }

    callback(undefined, true);
  }
});

router.post(
  '/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get('/me/avatar', auth, async (req, res) => {
  if (!req.user.avatar) {
    return res.status(404).send();
  }

  return res.set('Content-Type', 'image/png').send(req.user.avatar);
});

router.delete('/me/avatar', auth, async (req, res) => {
  if (req.user.avatar) {
    req.user.avatar = undefined;
    await req.user.save();
  }
  res.send();
});

export default router;
