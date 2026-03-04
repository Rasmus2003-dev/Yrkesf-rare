import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';

// Initialize Database
const db = new Database('ykb.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    quiz_id TEXT,
    quiz_title TEXT,
    score INTEGER,
    total_questions INTEGER,
    percentage INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    question_id TEXT,
    quiz_id TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, question_id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Middleware to verify JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

async function startServer() {
  console.log('Server running in:', __dirname);
  console.log('Public directory:', path.join(__dirname, 'public'));
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  // Explicit route for images to debug and ensure they are served
  app.use('/images', (req, res, next) => {
    const imagePath = path.join(__dirname, 'public', 'images', req.path);
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      next();
    }
  });

  // Quiz Data API
  app.get('/api/quizzes', (req, res) => {
    try {
      const filePath = path.join(__dirname, 'src', 'data', 'ykb_quizzes.json');
      const data = fs.readFileSync(filePath, 'utf8');
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
  });

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name } = req.body;
      
      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return res.status(400).json({ error: 'E-postadressen används redan' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const stmt = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)');
      const info = stmt.run(email, hashedPassword, name);

      const token = jwt.sign({ id: info.lastInsertRowid, email }, JWT_SECRET, { expiresIn: '24h' });
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      res.json({ id: info.lastInsertRowid, email, name });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Registreringen misslyckades' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
      if (!user) {
        return res.status(400).json({ error: 'Felaktig e-post eller lösenord' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Felaktig e-post eller lösenord' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      res.json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Inloggningen misslyckades' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    try {
      const user = db.prepare('SELECT id, email, name FROM users WHERE id = ?').get(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  // Quiz Results Routes
  app.post('/api/results', authenticateToken, (req: any, res) => {
    try {
      const { quiz_id, quiz_title, score, total_questions, percentage } = req.body;
      const stmt = db.prepare(`
        INSERT INTO quiz_results (user_id, quiz_id, quiz_title, score, total_questions, percentage)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(req.user.id, quiz_id, quiz_title, score, total_questions, percentage);
      res.json({ success: true });
    } catch (error) {
      console.error('Save result error:', error);
      res.status(500).json({ error: 'Failed to save quiz result' });
    }
  });

  app.get('/api/results', authenticateToken, (req: any, res) => {
    try {
      const results = db.prepare('SELECT * FROM quiz_results WHERE user_id = ? ORDER BY timestamp DESC').all(req.user.id);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch results' });
    }
  });

  // Bookmark Routes
  app.post('/api/bookmarks', authenticateToken, (req: any, res) => {
    try {
      const { question_id, quiz_id } = req.body;
      const stmt = db.prepare('INSERT OR IGNORE INTO bookmarks (user_id, question_id, quiz_id) VALUES (?, ?, ?)');
      stmt.run(req.user.id, question_id, quiz_id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to bookmark question' });
    }
  });

  app.delete('/api/bookmarks/:questionId', authenticateToken, (req: any, res) => {
    try {
      const stmt = db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND question_id = ?');
      stmt.run(req.user.id, req.params.questionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove bookmark' });
    }
  });

  app.get('/api/bookmarks', authenticateToken, (req: any, res) => {
    try {
      const bookmarks = db.prepare('SELECT * FROM bookmarks WHERE user_id = ?').all(req.user.id);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
  });

  // Dev Tool: Save Recreated Image
  app.post('/api/save-image', (req, res) => {
    try {
      const { path: imagePath, data } = req.body;
      if (!imagePath || !data) {
        return res.status(400).json({ error: 'Path and data are required' });
      }

      const safePath = path.join(__dirname, 'public', imagePath.replace(/^\//, ''));
      const dir = path.dirname(safePath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(safePath, Buffer.from(data, 'base64'));
      console.log(`Saved image to ${safePath}`);
      res.json({ success: true });
    } catch (error) {
      console.error('Save image error:', error);
      res.status(500).json({ error: 'Failed to save image' });
    }
  });

  // Dev Tool: Update Quiz Data
  app.post('/api/update-quiz-data', (req, res) => {
    try {
      const { data } = req.body;
      if (!data) {
        return res.status(400).json({ error: 'Data is required' });
      }

      const filePath = path.join(__dirname, 'src', 'data', 'ykb_quizzes.json');
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      res.json({ success: true });
    } catch (error) {
      console.error('Update quiz data error:', error);
      res.status(500).json({ error: 'Failed to update quiz data' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
