'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import { Trash2 } from 'lucide-react';
import ReportButton from '@/components/ReportButton';

type Post = {
  id: number;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
};

export default function DiscussionPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState('');

  const loadPosts = useCallback(async () => {
    const { data } = await supabase
      .from('discussion_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    setPosts(data ?? []);
  }, []);

  useEffect(() => {
    loadPosts();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setUsername(data.user?.user_metadata?.username || data.user?.email?.split('@')[0] || '');
    });
  }, [loadPosts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !userId) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('discussion_posts')
      .insert({ user_id: userId, username, message: message.trim() });

    if (!error) {
      setMessage('');
      loadPosts();
    }
    setSubmitting(false);
  };

  const handleDelete = async (postId: number) => {
    await supabase.from('discussion_posts').delete().eq('id', postId).eq('user_id', userId);
    loadPosts();
  };

  return (
    <main>
      <Header />
      <div style={{ padding: '32px clamp(16px, 4vw, 48px)', maxWidth: '720px', margin: '0 auto' }}>
        <h1>Discussion</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Échange avec la communauté MLGXGAME : partage tes découvertes, pose des questions, discute jeux.
        </p>

        {userId ? (
          <form className="comment-form" onSubmit={handleSubmit}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Publier en tant que <strong>{username}</strong>
            </p>
            <textarea
              placeholder="Quoi de neuf ?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={3}
              required
            />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Publication...' : 'Publier'}
            </button>
          </form>
        ) : (
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            <Link href="/connexion" style={{ color: 'var(--accent)' }}>Connecte-toi</Link> pour participer à la discussion.
          </p>
        )}

        <div className="comments-list">
          {posts.length === 0 && (
            <p className="comments-empty">Aucun message pour l&apos;instant. Sois le premier à lancer la discussion !</p>
          )}
          {posts.map((post) => (
            <div key={post.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-name">{post.username}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <span className="comment-date">
    {new Date(post.created_at).toLocaleDateString('fr-FR')}
  </span>
  {userId === post.user_id ? (
    <button
      onClick={() => handleDelete(post.id)}
      aria-label="Supprimer"
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
    >
      <Trash2 size={14} />
    </button>
  ) : (
    userId && <ReportButton reportedUserId={post.user_id} contentType="discussion" contentId={String(post.id)} />
  )}
</div>
              </div>
              <p className="comment-message">{post.message}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}