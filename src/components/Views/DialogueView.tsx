import React, { useState } from 'react';
import { aiDialogue } from '../../ai/AIDialogueService';
import { AIDialogueResponse } from '../../types/ai';
import { Radio, Send, X, Mic, Volume2 } from 'lucide-react';
import { audio } from '../../audio/HorrorAudioEngine';

interface DialogueViewProps {
  currentObjective: string;
  foundClues: string[];
  solvedPuzzles: string[];
  fearLevel: number;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  'Dispatcher 7, what is my current status?',
  'How do I seal the runic ward?',
  'Explain the 87.4 MHz signal anomaly.',
  'What is the origin of The Visitor?',
];

export const DialogueView: React.FC<DialogueViewProps> = ({
  currentObjective,
  foundClues,
  solvedPuzzles,
  fearLevel,
  onClose,
}) => {
  const [messages, setMessages] = useState<
    Array<{ sender: string; text: string; time: string; isAi: boolean }>
  >([
    {
      sender: 'Dispatcher 7',
      text: 'Telemetry established on secure band. Speak clearly, Investigator. Atmospheric readings show anomalous interference.',
      time: '02:41',
      isAi: true,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      sender: 'Investigator',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAi: false,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    audio.playStaticBurst(0.2, 0.3);

    const response: AIDialogueResponse = await aiDialogue.sendMessage({
      episodeId: 'EPISODE_01_THE_VISITOR',
      gamePhase: 'EXPLORATION',
      currentObjective,
      foundClues,
      solvedPuzzles,
      fearLevel,
      playerInput: textToSend,
      conversationHistory: [],
    });

    setIsLoading(false);
    const aiMsg = {
      sender: response.speaker,
      text: response.message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAi: true,
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 6, 10, 0.94)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 85,
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        height: '580px',
        backgroundColor: '#0c0f18',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid #1e293b',
          backgroundColor: '#0f1320'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio color="#ef4444" size={22} />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                TACTICAL RADIO RELAY (FREQ 87.4)
              </div>
              <div style={{ fontSize: '0.7rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                Dispatcher 7 Online • Guardrails Active
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Log */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.isAi ? 'flex-start' : 'flex-end',
                maxWidth: '82%',
                backgroundColor: msg.isAi ? '#141824' : '#1e293b',
                border: `1px solid ${msg.isAi ? '#232b3f' : '#334155'}`,
                borderRadius: '8px',
                padding: '10px 14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '8px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: msg.isAi ? '#ef4444' : '#38bdf8' }}>
                  {msg.sender}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{msg.time}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: 0, lineHeight: 1.45 }}>
                {msg.text}
              </p>
            </div>
          ))}
          {isLoading && (
            <div style={{ alignSelf: 'flex-start', color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>
              Transcribing incoming signal through static filter...
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#0a0d14',
          borderTop: '1px solid #191e2e',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto'
        }}>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              style={{
                whiteSpace: 'nowrap',
                padding: '4px 10px',
                borderRadius: '14px',
                backgroundColor: '#161a29',
                border: '1px solid #283049',
                color: '#cbd5e1',
                fontSize: '0.7rem',
                cursor: 'pointer'
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          gap: '10px',
          backgroundColor: '#0f1320'
        }}>
          <input
            type="text"
            placeholder="Transmit query to Dispatcher 7..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(inputText);
            }}
            disabled={isLoading}
            style={{
              flex: 1,
              backgroundColor: '#161a26',
              border: '1px solid #2c344d',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#f8fafc',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleSend(inputText)}
            disabled={isLoading || !inputText.trim()}
            style={{
              padding: '0 16px',
              backgroundColor: '#ef4444',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
