'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Send, Volume2, User, Bot } from 'lucide-react';

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
      content: 'Whomp is a whitty French poet whose writing is a mix of Ocean Vuong and Charles Bernstein',
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

  // 🧠 Add startup chime on mount
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
        body: formData,
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
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
    // 💻 Retro Apple terminal background + style
    <div className="min-h-screen bg-black bg-cover bg-center text-magenta font-mono" style={{ backgroundImage: "url('/images/poetry-bg.jpg')" }}>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="bg-black rounded-xl shadow-xl overflow-hidden border border-magenta">
          <div className="h-[700px] flex flex-col">
            <div className="p-4 bg-black border-b border-magenta">
              <h1 className="text-2xl font-semibold text-magenta flex items-center">
                AI Poet Chat <span className="ml-2 animate-pulse">▮</span>
              </h1>
              <p className="text-sm text-magenta">Chat with Whomp, the French AI poet</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.slice(1).map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-magenta flex items-center justify-center">
                      <Bot size={20} className="text-black" />
                    </div>
                  )}
                  
                  <div
                    className={`flex flex-col max-w-[70%] ${
                      message.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'bg-magenta text-black'
                          : 'bg-black border border-magenta text-magenta'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => speakText(message.content)}
                        className="mt-2 text-magenta hover:text-white transition-colors"
                        aria-label="Text to speech"
                      >
                        <Volume2 size={16} />
                      </button>
                    )}
                    
                    {message.timestamp && (
                      <span className="text-xs text-magenta mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-magenta flex items-center justify-center">
                      <User size={20} className="text-black" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-magenta flex items-center justify-center">
                    <Bot size={20} className="text-black" />
                  </div>
                  <div className="bg-black border border-magenta rounded-2xl p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-magenta rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-magenta rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-magenta rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-black border-t border-magenta">
              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 bg-black border border-magenta rounded-lg text-magenta placeholder-magenta focus:outline-none focus:ring-2 focus:ring-magenta"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-3 rounded-lg border border-magenta transition-colors ${
                    isRecording
                      ? 'bg-magenta text-black'
                      : 'bg-black text-magenta hover:bg-magenta hover:text-black'
                  }`}
                  disabled={isLoading}
                >
                  {isRecording ? <Square size={20} /> : <Mic size={20} />}
                </button>
                <button
                  type="submit"
                  className="p-3 bg-magenta text-black rounded-lg hover:bg-white hover:text-magenta transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!input.trim() || isLoading}
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
