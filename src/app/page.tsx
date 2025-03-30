'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Send, Volume2, User, Bot } from 'lucide-react';
import './RetroStyles.css';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
  id: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content:
        'Whomp is a whitty French poet whose writing is a mix of Ocean Vuong and Charles Bernstein',
      id: 'system-prompt'
    }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Play startup chime on component mount
  useEffect(() => {
    const audio = new Audio('/sounds/mac-startup.mp3');
    audio.volume = 0.6;
    audio.play().catch(err => console.log('Autoplay prevented:', err));
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
      formData.append('file', file);

      const response = await fetch('/api/speech', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transcribe audio');
      }

      const data = await response.json();
      setInput(data.text);
    } catch (error: any) {
      console.error('Error transcribing audio:', error);
      alert(error.message || 'Failed to transcribe audio');
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (text: string) => {
    try {
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error: any) {
      console.error('Error generating speech:', error);
      alert(error.message || 'Failed to generate speech');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
      id: `user-${Date.now()}`
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const assistantMessage = await response.json();

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: assistantMessage.content,
          timestamp: Date.now(),
          id: `assistant-${Date.now()}`
        }
      ]);
    } catch (error) {
      console.error('Error getting completion:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: Date.now(),
          id: `error-${Date.now()}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="outer-container">
      <div className="imac-g3">
        <div className="logo">
          AI Poet Chat <span className="flicker-cursor">▮</span>
        </div>
        <div className="screen">
          <div className="chat-window">
            <div className="messages">
              {messages.slice(1).map((message) => (
                <div key={message.id} className={`message ${message.role}`}>
                  {message.role === 'assistant' && (
                    <div className="avatar assistant">
                      <Bot size={20} />
                    </div>
                  )}
                  <div className="message-content">
                    <div className="message-bubble">
                      <p>{message.content}</p>
                    </div>
                    {message.role === 'assistant' && (
                      <button onClick={() => speakText(message.content)} aria-label="Text to speech">
                        <Volume2 size={16} />
                      </button>
                    )}
                    {message.timestamp && (
                      <span className="timestamp">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="avatar user">
                      <User size={20} />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="message assistant">
                  <div className="avatar assistant">
                    <Bot size={20} />
                  </div>
                  <div className="loading-indicator">
                    <div className="loading-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        <div className="bottom-curve">
        <div className="input-container">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`button ${isRecording ? 'recording' : 'notRecording'}`}
                  disabled={isLoading}
                >
                  {isRecording ? <Square size={20} /> : <Mic size={20} />}
                </button>
                <button type="submit" className="button send" disabled={!input.trim() || isLoading}>
                  <Send size={20} />
                </button>
              </form>
            </div>
        </div>
      </div>
      <div className="keyboard">
        <div className="key">ESC</div>
        <div className="key">1</div>
        <div className="key">2</div>
        <div className="key">3</div>
        <div className="key">4</div>
        <div className="key">5</div>
        <div className="key">6</div>
        <div className="key">7</div>
        <div className="key">8</div>
        <div className="key">9</div>
        <div className="key">0</div>
        <div className="key">⌫</div>
        <div className="key">TAB</div>
        <div className="key">Q</div>
        <div className="key">W</div>
        <div className="key">E</div>
        <div className="key">R</div>
        <div className="key">T</div>
        <div className="key">Y</div>
        <div className="key">U</div>
        <div className="key">I</div>
        <div className="key">O</div>
        <div className="key">P</div>
        <div className="key">\</div>
        <div className="key">CAPS</div>
        <div className="key">A</div>
        <div className="key">S</div>
        <div className="key">D</div>
        <div className="key">F</div>
        <div className="key">G</div>
        <div className="key">H</div>
        <div className="key">J</div>
        <div className="key">K</div>
        <div className="key">L</div>
        <div className="key">ENTER</div>
        <div className="key">SHIFT</div>
        <div className="key">Z</div>
        <div className="key">X</div>
        <div className="key">C</div>
        <div className="key">V</div>
        <div className="key">B</div>
        <div className="key">N</div>
        <div className="key">M</div>
        <div className="key">,</div>
        <div className="key">.</div>
        <div className="key">/</div>
        <div className="key">SHIFT</div>
        <div className="key" style={{ gridColumn: 'span 3' }}>SPACE</div>
        <div className="key">CMD</div>
        <div className="key">CTRL</div>
      </div>
    </div>
  );
}
