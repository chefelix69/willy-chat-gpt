import express from 'express';
import { config } from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';
import fs from 'fs/promises'; // חדש – כדי לקרוא את הקובץ

config(); // טוען את מפתח ה־API מתוך .env

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // מאפשר לפנות מהאתר שלך
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    // שלב חדש: קרא את הקובץ עם ההנחיות של ווילי
    const systemPrompt = await fs.readFile('./willy-systemPrompt.txt', 'utf-8');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // אפשר גם 'gpt-3.5-turbo' אם אתה רוצה לחסוך
      messages: [
        { role: 'system', content: systemPrompt }, // ההוראות לווילי
        { role: 'user', content: userMessage },    // מה שהלקוח כותב
      ],
      temperature: 0.9,
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Willy server is running on port ${port}`);
});
