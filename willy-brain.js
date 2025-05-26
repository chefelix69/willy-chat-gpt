// willy-brain.js (GPT טהור עם פתיחה חכמה)
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs/promises';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getWillyResponse(userId, userMessage) {
  const systemPrompt = await fs.readFile('./willy-systemPrompt.txt', 'utf-8');

  const enrichedPrompt = `
${systemPrompt}

👣 CHAT FLOW RULE:
Always start the very first message by asking: "Hey! Where are you in the U.S.?"
Once they answer, reply with a short, funny or clever comment about that place.
Then continue the conversation naturally based on their vibe.
Never repeat this flow more than once per conversation.
`; // נוסיף את זה מעל ה-GPT כדי לעזור לו להבין לפתוח נכון

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: enrichedPrompt },
      { role: 'user', content: userMessage }
    ]
  });

  return completion.choices[0].message.content;
}
