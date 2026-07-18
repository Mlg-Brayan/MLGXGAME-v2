'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Comment = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    setComments(data ?? []);
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('comments')
      .insert({ name: name.trim(), message: message.trim() });

    if (!error) {
      setName('');
      setMessage('');
      loadComments();
    }
    setSubmitting(false);
  };

  return (
    <section className="comments-section">
      <h2>Avis des joueurs</h2>

      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          required
        />
        <textarea
          placeholder="Votre avis sur le site..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={300}
          rows={3}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Envoi...' : 'Publier'}
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 && (
          <p className="comments-empty">Soyez le premier à laisser un avis !</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-header">
              <span className="comment-name">{comment.name}</span>
              <span className="comment-date">
                {new Date(comment.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <p className="comment-message">{comment.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}