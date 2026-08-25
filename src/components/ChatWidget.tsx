'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useChat } from '@/context/ChatContext';
import { supabase } from '@/lib/supabaseClient';
import { getUserIdentifier } from '@/lib/getUserIdentifier';

type Message = {
  from: 'user' | 'bot';
  text: string;
  suggestions?: { title: string; slug: string; type: string }[];
};

export default function ChatWidget() {
  const { chatOpen, setChatOpen } = useChat();
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Salut ! Dis-moi ce que tu cherches (un jeu, un accessoire, un template...) et je m\'occupe du reste.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const name = data.user?.user_metadata?.username || data.user?.email?.split('@')[0];
      if (name) {
        setUsername(name);
        setMessages([{ from: 'bot', text: `Salut ${name} ! Dis-moi ce que tu cherches et je m'occupe du reste.` }]);
      }
    });
  }, []);

  if (!chatOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { from: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userId: getUserIdentifier(),
          username,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: 'bot', text: data.reply, suggestions: data.suggestions }]);
    } catch {
      setMessages((prev) => [...prev, { from: 'bot', text: 'Erreur de connexion, réessaie.' }]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-widget">
      <div className="chat-widget-header">
        <span>Assistant MLGxGame</span>
        <button onClick={() => setChatOpen(false)} aria-label="Fermer le chat">✕</button>
      </div>

      <div className="chat-widget-body">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message chat-message-${msg.from}`}>
            <p>{msg.text}</p>
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="chat-suggestions">
                {msg.suggestions.map((s) => (
                  <Link key={`${s.type}-${s.slug}`} href={`/${s.type}/${s.slug}`} className="chat-suggestion-chip">
                    {s.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="chat-message chat-message-bot"><p>...</p></div>}
        <div ref={endRef} />
      </div>

      <div className="chat-widget-input">
        <input
          type="text"
          placeholder="Écris un message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Envoyer</button>
      </div>
    </div>
  );
}