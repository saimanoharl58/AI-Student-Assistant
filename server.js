const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname)));

// Lazy-loaded GoogleGenAI client
let aiClient = null;
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  if (!aiClient) {
    const { GoogleGenAI } = require('@google/genai');
    aiClient = new GoogleGenAI({ apiKey: apiKey.trim() });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here');
  res.json({
    status: 'ok',
    hasKey: hasKey,
    model: 'gemini-2.5-flash',
    message: hasKey 
      ? 'Backend connected and GEMINI_API_KEY detected.' 
      : 'Backend connected, but GEMINI_API_KEY is missing or empty in .env.'
  });
});

// Chat endpoint with official Google Gen AI SDK
app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      return res.status(503).json({
        error: 'Missing GEMINI_API_KEY. Please set your real Google Gemini API key in the server-side .env file and restart the server.'
      });
    }

    const { message, history } = req.body;
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(500).json({ error: 'Failed to initialize Google Gen AI client.' });
    }

    // Format conversational context for Gemini
    const contents = [];
    if (Array.isArray(history)) {
      history.slice(-8).forEach(item => {
        if (item.text && item.role) {
          contents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.text }]
          });
        }
      });
    }

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }]
    });

    const systemInstruction = 'You are StudyMate AI, an expert, encouraging, and structured college study assistant. Help students master complex academic topics, break down lecture notes, explain challenging concepts with clear analogies, and develop effective exam preparation strategies. Use structured markdown formatting with bold text for essential terminology, concise bullet points, and code snippets when explaining technical or mathematical subjects.';

    // Generate content using official Google Gen AI SDK
    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: { systemInstruction: systemInstruction }
      });
    } catch (primaryErr) {
      // Fallback model if gemini-2.5-flash is not available in the region or tier
      const errMsg = primaryErr.message || '';
      if (errMsg.includes('not found') || errMsg.includes('404')) {
        console.warn('Falling back to gemini-1.5-flash...');
        response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: contents,
          config: { systemInstruction: systemInstruction }
        });
      } else {
        throw primaryErr;
      }
    }

    const reply = response.text || 'No response generated.';
    return res.json({ reply: reply });
  } catch (error) {
    console.error('Error generating content from Gemini API:', error);

    const errorMessage = error.message || '';
    const status = error.status || 500;

    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('API key not valid') || status === 400 || status === 403) {
      return res.status(403).json({
        error: 'Invalid or unauthorized GEMINI_API_KEY. Please verify your Gemini API key in the .env file.'
      });
    }

    if (errorMessage.includes('RESOURCE_EXHAUSTED') || status === 429) {
      return res.status(429).json({
        error: 'Gemini API quota or rate limit exceeded. Please wait a moment and try again.'
      });
    }

    return res.status(500).json({
      error: `Gemini API request failed: ${errorMessage || 'Unknown server error.'}`
    });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`StudyMate AI server running at http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn(`[Notice] GEMINI_API_KEY is not configured in .env. Please set it to enable live Gemini AI responses.`);
  } else {
    console.log(`[Success] GEMINI_API_KEY detected. Online Gemini AI ready.`);
  }
});
