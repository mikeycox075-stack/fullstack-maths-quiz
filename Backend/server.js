require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');
const Score = require('./models/Score');


const app = express();

// connect to database
connectDB();

app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/authRoutes');

app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
app.get('/api/profile', authMiddleware, (req, res) => {
    res.json({
        message: "Protected route accessed!",
        user: req.user
    });
});
app.get('/api/profile', authMiddleware, (req, res) => {
    res.json({
        message: "Protected route accessed!",
        user: req.user
    });
});

app.post('/api/score', authMiddleware, async (req, res) => {
    try {
        const { score, totalQuestions } = req.body;

        const newScore = new Score({
            userId: req.user.id,
            score,
            totalQuestions
        });

        await newScore.save();

        res.json({ message: "Score saved!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/scores', authMiddleware, async (req, res) => {
    try {
        const scores = await Score.find({ userId: req.user.id });
        res.json(scores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

