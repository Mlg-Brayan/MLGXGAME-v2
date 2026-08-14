'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Home,
  Monitor,
  Smartphone,
  Globe,
  AppWindow,
  LayoutTemplate,
  ShoppingBag,
  MessageCircle,
  Crown,
} from 'lucide-react';
import { useMenu } from '@/context/MenuContext';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

const navItems = [
  { label: 'Accueil', href: '/', icon: Home },
  { label: 'Jeux PC', href: '/pc', icon: Monitor },
  { label: 'Jeux Mobile', href: '/mobile', icon: Smartphone },
  { label: 'Jeux en ligne', href: '/online', icon: Globe },
  { label: 'Applications Gaming', href: '/applications', icon: AppWindow },
  { label: 'Templates Web', href: '/templates', icon: LayoutTemplate },
  { label: 'Boutique', href: '/boutique', icon: ShoppingBag },
  { label: 'Discussion', href: '/discussion', icon: MessageCircle },
  { label: 'Premium', href: '/premium', icon: Crown },
];

export default function SidePanel() {
  const { menuOpen, setMenuOpen } = useMenu();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  if (!menuOpen) return null;

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'Utilisateur';

  return (
    <div className="side-panel-overlay" onClick={() => setMenuOpen(false)}>
      <div className="side-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu">✕</button>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                <Icon size={18} strokeWidth={1.75} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="side-panel-footer">
          {user ? (
            <span className="side-panel-username">{username}</span>
          ) : (
            <a href="/connexion" className="side-panel-auth-btn" onClick={() => setMenuOpen(false)}>
              Se connecter
            </a>
          )}
          <Image src="/logo.svg" alt="MLGXGAME" width={100} height={42} />
        </div>
      </div>
    </div>
  );
}