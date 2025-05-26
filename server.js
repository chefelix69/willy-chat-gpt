import express from 'express';
import { config } from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';
import fs from 'fs/promises'; // כדי לקרוא את ה־system prompt

config(); // טוען את מפתח ה־API מתוך .env

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // מאפשר פנייה מהדפדפן
app.use(express.json());

// הגדרת OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// צ'אט API
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    // קריאה לתוכן של ווילי מתוך קובץ
    const systemPrompt = await fs.readFile('./willy-systemPrompt.txt', 'utf-8');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // אפשר גם gpt-3.5-turbo
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.9,
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// 🟢 מסלול ברירת מחדל – כדי ש־Render ו־UptimeRobot יקבלו תשובה
app.get('/', (req, res) => {
  res.send('✅ Willy server is up and running!');
});

// מאזין לפניות
app.listen(port, () => {
  console.log(`✅ Willy server is running on port ${port}`);
});
