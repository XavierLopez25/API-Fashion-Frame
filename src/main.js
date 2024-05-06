import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

import {
  registerUser,
  loginUser,
  getUserById,
  getPosts,
  getPostById,
  getPostsByUser,
  createPost,
  updatePost,
  deletePost,
} from './db.js';

import authenticateToken from './middleware.js';

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(cors());

const port = 5000;

app.get('/', async (req, res) => {
  res.send('Hello World from API.');
});

app.post('/register', async (req, res) => {
  const { username, password_md5, email } = req.body;
  try {
    await registerUser(username, password_md5, email);
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully.',
      data: [username, email],
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password_md5 } = req.body;
  try {
    const user = await loginUser(username, password_md5);
    console.log(user);
    if (user) {
      const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });
      res.status(200).json({
        status: 'success',
        message: 'User logged in successfully.',
        username: user.username,
        id: user.id,
        token: token,
        role: user.role,
      });
    } else {
      res.status(401).json({ status: 'failed', message: 'Invalid username or password.' });
    }
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

app.get('/user/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await getUserById(id);
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

app.get('/posts', authenticateToken, async (req, res) => {
  try {
    const posts = await getPosts();
    res.status(200).json({ status: 'success', data: posts });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

app.get('/post/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const post = await getPostById(id);
    res.status(200).json({ status: 'success', data: post });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

app.get('/posts/user/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const posts = await getPostsByUser(user_id);
    res.status(200).json({ status: 'success', data: posts });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

app.post('/post', authenticateToken, async (req, res) => {
  const { title, warframe, content, tags, image, user_id } = req.body;
  try {
    await createPost(title, warframe, content, tags, image, user_id);
    res.status(201).json({ status: 'success', message: 'Post created successfully.' });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

app.put('/post/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  const { title, warframe, content, tags, image } = req.body;
  try {
    await updatePost(id, title, warframe, content, tags, image);
    res.status(200).json({ status: 'success', message: 'Post updated successfully.' });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

app.delete('/post/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await deletePost(id);
    res.status(200).json({ status: 'success', message: result });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`);
});
