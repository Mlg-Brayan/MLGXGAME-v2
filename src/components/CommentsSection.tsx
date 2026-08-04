'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Comment = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

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
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setUsername(data.user?.user_metadata?.username || data.user?.email?.split('@')[0] || '');
    });
  }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !userId) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('comments')
      .insert({ name: username, message: message.trim(), user_id: userId });

    if (!error) {
      setMessage('');
      loadComments();
    }
    setSubmitting(false);
  };

  return (
    <section className="comments-section">
      <h2>Avis des joueurs</h2>

      {userId ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Connecté en tant que <strong>{username}</strong>
          </p>
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
      ) : (
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          <Link href="/connexion" style={{ color: 'var(--accent)' }}>Connecte-toi</Link> pour laisser un avis.
        </p>
      )}

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