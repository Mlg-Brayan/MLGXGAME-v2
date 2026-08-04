'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

type Favorite = {
  id: number;
  item_type: string;
  item_slug: string;
  item_title: string;
  item_image: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [username, setUsername] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData.user;

      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);
      const name = currentUser.user_metadata?.username || currentUser.email?.split('@')[0] || '';
      setUsername(name);
      setNewUsername(name);

      const { data: favs } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('id', { ascending: false })
        .limit(6);

      setFavorites(favs ?? []);

      const { count: votes } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('user_identifier', currentUser.id);

      setVoteCount(votes ?? 0);

      const { count: comments } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.id);

      setCommentCount(comments ?? 0);
      setLoading(false);
    }

    load();
  }, []);

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) return;
    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      data: { username: newUsername.trim() },
    });

    if (!error) {
      setUsername(newUsername.trim());
      setEditingUsername(false);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <main>
        <Header />
        <div style={{ padding: '32px' }} />
        <Footer />
      </main>
    );
  }

  if (!user) {
    return (
      <main>
        <Header />
        <div style={{ padding: '32px clamp(16px, 4vw, 48px)' }}>
          <h1>Mon profil</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>
            <Link href="/connexion" style={{ color: 'var(--accent)' }}>Connecte-toi</Link> pour accéder à ton profil.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div style={{ padding: '32px clamp(16px, 4vw, 48px)', maxWidth: '720px', margin: '0 auto' }}>
        <h1>Mon profil</h1>

        <div className="profile-card">
          <div className="profile-avatar">{username.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            {editingUsername ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="profile-username-input"
                />
                <button onClick={handleUpdateUsername} disabled={saving} className="profile-save-btn">
                  {saving ? '...' : 'OK'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="profile-username">{username}</span>
                <button onClick={() => setEditingUsername(true)} className="profile-edit-link">
                  Modifier
                </button>
              </div>
            )}
            <span className="profile-email">{user.email}</span>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-number">{favorites.length}</span>
            <span className="profile-stat-label">Favoris</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-number">{voteCount}</span>
            <span className="profile-stat-label">Votes</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-number">{commentCount}</span>
            <span className="profile-stat-label">Avis</span>
          </div>
        </div>

        <div className="profile-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0 }}>Favoris récents</h2>
            <Link href="/favoris" style={{ color: 'var(--accent)', fontSize: '13px' }}>Voir tout</Link>
          </div>

          {favorites.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Aucun favori pour l&apos;instant.</p>
          ) : (
            <div className="showcase-grid">
              {favorites.map((fav) => (
                <Link key={fav.id} href={`/${fav.item_type}/${fav.item_slug}`} className="showcase-card">
                  <div className="showcase-card-image">
                    <Image src={fav.item_image} alt={fav.item_title} fill sizes="200px" />
                  </div>
                  <span className="showcase-card-title">{fav.item_title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}