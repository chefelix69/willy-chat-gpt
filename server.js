// server.js (גרסה חדשה שמתחברת ל־willy-brain.js)
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { getWillyResponse } from './willy-brain.js';

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// צ'אט API – כל הודעה מנותבת למוח של ווילי
app.post('/chat', async (req, res) => {
  try {
    const userId = req.body.userId || req.ip; // מזהה לפי IP או מזהה לקוח עתידי
    const userMessage = req.body.message;

    const response = await getWillyResponse(userId, userMessage);

    res.json({ response });
  } catch (error) {
    console.error('❌ Error in /chat:', error);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

// ברירת מחדל – לבדיקה מרנדר או מבחוץ
app.get('/', (req, res) => {
  res.send('✅ Willy server is up and running!');
});

// מאזין לפניות
app.listen(port, () => {
  console.log(`✅ Willy server is running on port ${port}`);
});
