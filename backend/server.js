const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const app = express();
const JWT_SECRET = 'melody-house-super-secret-key';

app.use(cors());
app.use(express.json());

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token không hợp lệ' });
    req.user = user;
    next();
  });
};

// --- API AUTH ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return res.status(400).json({ error: 'Tên người dùng đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword }
    });
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(400).json({ error: 'Sai tài khoản hoặc mật khẩu' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Sai tài khoản hoặc mật khẩu' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// --- API FAVORITES ---
app.post('/api/favorites/:songId', authenticateToken, async (req, res) => {
  try {
    const songId = parseInt(req.params.songId);
    const userId = req.user.id;
    
    const existing = await prisma.favorite.findUnique({
      where: { userId_songId: { userId, songId } }
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.json({ favorited: false });
    } else {
      await prisma.favorite.create({ data: { userId, songId } });
      return res.json({ favorited: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { song: true }
    });
    res.json(favorites.map(f => f.song));
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Thư mục chứa file upload (đảm bảo nó tồn tại)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình Multer để upload file pdf/midi
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// API lấy danh sách bài hát
app.get('/api/songs', async (req, res) => {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// API lấy chi tiết 1 bài hát
app.get('/api/songs/:id', async (req, res) => {
  try {
    const song = await prisma.song.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!song) return res.status(404).json({ error: 'Không tìm thấy bài hát' });
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// API tạo bài hát mới (kèm upload file)
app.post('/api/songs', upload.fields([
  { name: 'sheetFile', maxCount: 1 },
  { name: 'midiFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, artist, difficulty } = req.body;
    
    // Tạo link truy cập file (nếu có)
    const sheetUrl = req.files['sheetFile'] ? `/uploads/${req.files['sheetFile'][0].filename}` : null;
    const midiUrl = req.files['midiFile'] ? `/uploads/${req.files['midiFile'][0].filename}` : null;

    const newSong = await prisma.song.create({
      data: {
        title,
        artist,
        difficulty: difficulty || 'Medium',
        sheetUrl,
        midiUrl,
      }
    });

    res.json(newSong);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Không thể tạo bài hát' });
  }
});

// Seed data nếu database trống
app.post('/api/seed', async (req, res) => {
  const count = await prisma.song.count();
  if (count === 0) {
    await prisma.song.createMany({
      data: [
        { title: 'River Flows In You', artist: 'Traditional', difficulty: 'Easy' },
        { title: 'Für Elise', artist: 'Beethoven', difficulty: 'Medium' },
        { title: 'Nocturne Op. 9 No. 2', artist: 'Chopin', difficulty: 'Hard' }
      ]
    });
    return res.json({ message: 'Seeded!' });
  }
  res.json({ message: 'Already seeded' });
});

// Phục vụ file tĩnh
app.use('/uploads', express.static(uploadsDir));

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on http://0.0.0.0:${PORT}`);
});
