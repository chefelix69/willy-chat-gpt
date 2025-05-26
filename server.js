import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import fs from 'fs/promises';
import OpenAI from 'openai';

config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const systemPrompt = await fs.readFile('./willy-systemPrompt.txt', 'utf-8');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.9
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Willy server is up and running!');
});

app.listen(port, () => {
  console.log(`✅ Willy server is running on port ${port}`);
});
