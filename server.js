import express from 'express';
import { config } from 'dotenv';
import OpenAI from 'openai';

config(); // טוען את משתני הסביבה מתוך .env

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

// נקודת הקצה לשליחת הודעות לצ'אט
app.post('/', async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: 'Missing message field' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    const reply = completion.choices[0].message.content;
    res.json({ response: reply });
  } catch (error) {
    console.error('❌ Error from OpenAI:', error);
    res.status(500).json({ error: 'Something went wrong with OpenAI.' });
  }
});

// הרצת השרת
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
