'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, ShoppingBag, MessageCircle, User } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function BottomNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const navItems = [
    { label: 'Accueil', href: '/', icon: Home },
    { label: 'Jeux', href: '/jeux', icon: Gamepad2 },
    { label: 'Boutique', href: '/boutique', icon: ShoppingBag },
    { label: 'Discussion', href: '/discussion', icon: MessageCircle },
    { label: 'Profil', href: isLoggedIn ? '/profil' : '/connexion', icon: User },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${isActive ? 'bottom-nav-active' : ''}`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.2 : 1.75} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}