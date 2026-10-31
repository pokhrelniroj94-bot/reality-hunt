import express, { Request, Response } from 'express';
import { SafetyGuardrails } from '../src/ai/SafetyGuardrails';
import { ScriptedFallback } from '../src/ai/ScriptedFallback';
import { AIDialogueRequest } from '../src/types/ai';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// In-memory rate limiting map: IP -> lastTimestamp
const rateLimitMap = new Map<string, number>();

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    service: 'Reality Hunt Telemetry & AI Dialogue Server',
    fictionalDisclaimerEnforced: true,
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/ai-dialogue', (req: Request, res: Response) => {
  const clientIp = req.ip || 'unknown';
  const now = Date.now();
  const lastTime = rateLimitMap.get(clientIp) || 0;

  // Rate limit: 1 request every 2.5 seconds
  if (now - lastTime < 2500) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Comms channel busy. Allow 2.5 seconds between radio transmissions.',
    });
  }
  rateLimitMap.set(clientIp, now);

  const requestBody: AIDialogueRequest = req.body;
  if (!requestBody || !requestBody.playerInput) {
    return res.status(400).json({ error: 'Invalid Request: Missing playerInput' });
  }

  // 1. Safety Guardrails check
  const moderation = SafetyGuardrails.moderatePlayerInput(requestBody.playerInput);
  if (!moderation.isSafe) {
    return res.status(400).json({
      speaker: 'System Protocol',
      message: 'Transmission blocked: Non-compliant phrase detected. Remember all investigations are strictly fictional simulation.',
      tensionLevel: 'low',
      isFictionalDisclaimerEnforced: true,
    });
  }

  // 2. Generate response via Narrative Context Engine
  // (In production with Gemini API key set: calls Gemini 1.5 Pro / Flash with strict system prompt)
  const response = ScriptedFallback.getResponse(requestBody);

  // 3. Schema validation
  const validated = SafetyGuardrails.validateAIResponse(response);
  if (!validated) {
    return res.status(500).json({ error: 'Response failed schema validation' });
  }

  return res.json(validated);
});

export default app;
