import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';

// Initialize Database
const db = new Database('notes.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS job_monitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    query TEXT,
    city TEXT,
    last_checked DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS job_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monitor_id INTEGER,
    job_id TEXT,
    headline TEXT,
    employer TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN DEFAULT 0,
    FOREIGN KEY(monitor_id) REFERENCES job_monitors(id)
  );

  CREATE TABLE IF NOT EXISTS saved_jobs (
    id TEXT PRIMARY KEY,
    user_id INTEGER,
    headline TEXT,
    employer TEXT,
    municipality TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
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

async function checkMonitors() {
  try {
    const monitors = db.prepare('SELECT * FROM job_monitors').all() as any[];
    
    for (const monitor of monitors) {
      const { id, query, city, last_checked } = monitor;
      let searchQuery = query;
      if (city) searchQuery += ` ${city}`;

      // Format last_checked for API (YYYY-MM-DDTHH:MM:SS)
      const lastCheckedDate = new Date(last_checked);
      const formattedDate = lastCheckedDate.toISOString().split('.')[0];

      try {
        const response = await fetch(
          `https://jobsearch.api.jobtechdev.se/search?q=${encodeURIComponent(searchQuery)}&published-after=${formattedDate}&limit=5`,
          { headers: { 'accept': 'application/json' } }
        );

        if (response.ok) {
          const data = await response.json();
          const newJobs = data.hits || [];

          const insertNotif = db.prepare(`
            INSERT INTO job_notifications (monitor_id, job_id, headline, employer)
            VALUES (?, ?, ?, ?)
          `);
          
          const checkExists = db.prepare('SELECT 1 FROM job_notifications WHERE job_id = ?');

          for (const job of newJobs) {
            // Check if notification already exists to avoid duplicates
            const exists = checkExists.get(job.id);
            if (!exists) {
              insertNotif.run(id, job.id, job.headline, job.employer?.name || 'Okänd arbetsgivare');
            }
          }

          // Update last_checked
          db.prepare('UPDATE job_monitors SET last_checked = CURRENT_TIMESTAMP WHERE id = ?').run(id);
        }
      } catch (err) {
        console.error(`Error checking monitor ${id}:`, err);
      }
    }
  } catch (error) {
    console.error('Monitor check failed:', error);
  }
}

// Run monitor check every 60 seconds for demo purposes
setInterval(checkMonitors, 60000);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name } = req.body;
      
      // Check if user exists
      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return res.status(400).json({ error: 'E-postadressen används redan' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert user
      const stmt = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)');
      const info = stmt.run(email, hashedPassword, name);

      // Create token
      const token = jwt.sign({ id: info.lastInsertRowid, email }, JWT_SECRET, { expiresIn: '24h' });
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
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

      // Find user
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
      if (!user) {
        return res.status(400).json({ error: 'Felaktig e-post eller lösenord' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Felaktig e-post eller lösenord' });
      }

      // Create token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
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
  
  // Protected Routes (require auth)
  
  // Monitor Routes
  app.post('/api/monitors', authenticateToken, (req: any, res) => {
    try {
      const { query, city } = req.body;
      const stmt = db.prepare('INSERT INTO job_monitors (user_id, query, city) VALUES (?, ?, ?)');
      const info = stmt.run(req.user.id, query, city);
      
      // Trigger an immediate check for this new monitor
      checkMonitors();
      
      res.json({ id: info.lastInsertRowid, success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create monitor' });
    }
  });

  app.get('/api/notifications', authenticateToken, (req: any, res) => {
    try {
      // Get notifications for monitors owned by the user
      const notifs = db.prepare(`
        SELECT n.* FROM job_notifications n
        JOIN job_monitors m ON n.monitor_id = m.id
        WHERE m.user_id = ?
        ORDER BY n.timestamp DESC 
        LIMIT 50
      `).all(req.user.id);
      res.json(notifs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  app.post('/api/notifications/mark-read', authenticateToken, (req: any, res) => {
    try {
      // Mark notifications as read for monitors owned by the user
      db.prepare(`
        UPDATE job_notifications 
        SET read = 1 
        WHERE monitor_id IN (SELECT id FROM job_monitors WHERE user_id = ?)
      `).run(req.user.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update notifications' });
    }
  });

  // Saved Jobs Routes
  app.get('/api/saved-jobs', authenticateToken, (req: any, res) => {
    try {
      const jobs = db.prepare('SELECT * FROM saved_jobs WHERE user_id = ? ORDER BY timestamp DESC').all(req.user.id);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch saved jobs' });
    }
  });

  app.post('/api/saved-jobs', authenticateToken, (req: any, res) => {
    try {
      const { id, headline, employer, municipality } = req.body;
      db.prepare('INSERT OR REPLACE INTO saved_jobs (id, user_id, headline, employer, municipality) VALUES (?, ?, ?, ?, ?)').run(id, req.user.id, headline, employer, municipality);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save job' });
    }
  });

  app.delete('/api/saved-jobs/:id', authenticateToken, (req: any, res) => {
    try {
      db.prepare('DELETE FROM saved_jobs WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete saved job' });
    }
  });

  // API Routes
  app.get('/api/notes', authenticateToken, (req: any, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY timestamp DESC');
      const notes = stmt.all(req.user.id);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  });

  app.post('/api/notes', authenticateToken, (req: any, res) => {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }
      const stmt = db.prepare('INSERT INTO notes (user_id, content) VALUES (?, ?)');
      const info = stmt.run(req.user.id, content);
      res.json({ id: info.lastInsertRowid, content });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save note' });
    }
  });

  app.put('/api/notes/:id', authenticateToken, (req: any, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const stmt = db.prepare('UPDATE notes SET content = ?, timestamp = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?');
      const info = stmt.run(content, id, req.user.id);
      if (info.changes === 0) return res.status(404).json({ error: 'Note not found' });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update note' });
    }
  });

  app.delete('/api/notes/:id', authenticateToken, (req: any, res) => {
    try {
      const { id } = req.params;
      const stmt = db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?');
      const info = stmt.run(id, req.user.id);
      if (info.changes === 0) return res.status(404).json({ error: 'Note not found' });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete note' });
    }
  });

  // Job Search Proxy (Public)
  app.get('/api/jobs', async (req, res) => {
    try {
      const { q = 'lastbilsförare', offset = '0', limit = '10', 'published-after': publishedAfter } = req.query;
      
      // Default: Swedish JobTech API
      let url = `https://jobsearch.api.jobtechdev.se/search?q=${encodeURIComponent(q as string)}&offset=${offset}&limit=${limit}`;
      
      if (publishedAfter) {
        url += `&published-after=${publishedAfter}`;
      }

      const response = await fetch(
        url,
        {
          headers: {
            'accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`JobTech API responded with ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Job search error:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  });

  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(
        `https://jobsearch.api.jobtechdev.se/ad/${id}`,
        {
          headers: {
            'accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`JobTech API responded with ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Job details error:', error);
      res.status(500).json({ error: 'Failed to fetch job details' });
    }
  });

  app.get('/api/jobs/:id/logo', async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`https://jobsearch.api.jobtechdev.se/ad/${id}/logo`);
      
      if (!response.ok) {
        return res.status(404).send();
      }

      const contentType = response.headers.get('content-type');
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.send(buffer);
    } catch (error) {
      console.error('Job logo error:', error);
      res.status(500).send();
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
    // Production static file serving (if we were building for prod)
    app.use(express.static(path.resolve(__dirname, 'dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
