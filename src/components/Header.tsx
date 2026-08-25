'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Bot } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useMenu } from '@/context/MenuContext';
import { useChat } from '@/context/ChatContext';
import type { User } from '@supabase/supabase-js';
import { syncPreferencesFromSupabase } from '@/lib/trackInteraction';

type Result = {
  id: number;
  title: string;
  slug: string;
  image_url: string;
  type: string;
};

export default function Header() {
  const { menuOpen, setMenuOpen } = useMenu();
  const { setChatOpen } = useChat();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUser(data.user);
    if (data.user) syncPreferencesFromSupabase(data.user.id);
  });

  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
    if (session?.user) syncPreferencesFromSupabase(session.user.id);
  });

  return () => authListener.subscription.unsubscribe();
}, []);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const [games, apps, templates, boutique] = await Promise.all([
        supabase.from('games').select('id, title, slug, image_url').ilike('title', `%${query}%`).limit(3),
        supabase.from('applications').select('id, title, slug, image_url').ilike('title', `%${query}%`).limit(3),
        supabase.from('templates').select('id, title, slug, image_url').ilike('title', `%${query}%`).limit(3),
        supabase.from('boutique').select('id, title, slug, image_url').ilike('title', `%${query}%`).limit(3),
      ]);

      const combined: Result[] = [
        ...(games.data ?? []).map((g) => ({ ...g, type: 'jeux' })),
        ...(apps.data ?? []).map((a) => ({ ...a, type: 'applications' })),
        ...(templates.data ?? []).map((t) => ({ ...t, type: 'templates' })),
        ...(boutique.data ?? []).map((b) => ({ ...b, type: 'boutique' })),
      ];

      setResults(combined);
      setShowDropdown(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length === 0) return;
    setShowDropdown(false);
    router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'Utilisateur';

  return (
    <>
      <header className="site-header">
        <button className="hamburger-btn hamburger-mobile-only" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <a href="/" className="logo-link">
          <Image src="/logo.svg" alt="MLGxGame" width={140} height={60} priority />
        </a>

        <div className="search-bar" ref={searchRef}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Rechercher..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowDropdown(true)}
            />
          </form>

          {showDropdown && results.length > 0 && (
            <div className="search-dropdown">
              {results.map((item) => (
                <a
                  key={item.type + '-' + item.id}
                  href={'/' + item.type + '/' + item.slug}
                  className="search-dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  <div className="search-dropdown-image">
                    <Image src={item.image_url} alt={item.title} fill sizes="40px" />
                  </div>
                  <span>{item.title}</span>
                </a>
              ))}
              <a
                href={'/recherche?q=' + encodeURIComponent(query)}
                className="search-dropdown-more"
                onClick={() => setShowDropdown(false)}
              >
                Voir tous les résultats
             </a> 
            </div>
            
          )}
        </div>

        <div className="header-actions">
          {user ? (
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button className="user-menu-trigger" onClick={() => setUserMenuOpen((prev) => !prev)}>
                {username}
              </button>
              {userMenuOpen && (
                <div className="user-menu-dropdown">
                  <Link href="/profil" onClick={() => setUserMenuOpen(false)}>Mon profil</Link>
                  <Link href="/favoris" onClick={() => setUserMenuOpen(false)}>Mes favoris</Link>
                  <button onClick={handleLogout}>Se déconnecter</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/connexion" className="auth-btn">Se connecter</Link>
          )}
          <button className="icon-btn" aria-label="Assistant IA" onClick={() => setChatOpen(true)}>
            <Bot size={22} strokeWidth={1.75} />
          </button>
        </div>
      </header>
    </>
  );
}