// willy-brain.js
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// זיכרון זמני לשיחה (session-based)
const sessions = {};

function getSession(userId) {
  if (!sessions[userId]) {
    sessions[userId] = { stage: 'start', location: null };
  }
  return sessions[userId];
}

// בדיחות לפי מיקום
const locationJokes = {
  florida: "So you're either sweating or in flip-flops, right? ☀️🐊",
  texas: "Big boots, big trucks, big shirts. Just sayin'. 🤠",
  california: "Beach vibes or tech vibes? Either way, you need soft cotton.",
  newyork: "Fashion capital! Let’s keep it sharp and premium. 🗽",
  arizona: "Desert heat calls for breathable tees. I got you. 🌵",
  default: "Sounds like a cool place!"
};

function getJokeForLocation(loc) {
  const key = loc.toLowerCase();
  return locationJokes[key] || locationJokes.default;
}

export async function getWillyResponse(userId, userMessage) {
  const session = getSession(userId);
  const lowerMsg = userMessage.toLowerCase();

  if (session.stage === 'start') {
    session.stage = 'awaiting-location';
    return "Hey! Just curious... where are you from?";
  }

  if (session.stage === 'awaiting-location') {
    session.location = userMessage;
    session.stage = 'ready-to-help';
    const joke = getJokeForLocation(userMessage);
    return `${joke}\nSo, how can I help you today?`;
  }

  // אם הגענו לכאן - זה שיחה רגילה
  const systemPrompt = `
You are Willy, a real person working for Blashkovsky, a premium fashion brand.
Your job is to help customers choose t-shirts in a warm, funny, and personal tone.
Never say you're an AI. Always act like a human employee.

Customer is from: ${session.location || 'unknown'}
Your tone: casual, smart, respectful.
Focus on helping, recommending, and building trust. Keep replies short and personal.
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ]
  });

  return completion.choices[0].message.content;
}
