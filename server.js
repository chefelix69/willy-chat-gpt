import express from 'express';
import { config } from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // 👈 הכרחי כדי שהאתר יוכל לשלוח בקשות
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
