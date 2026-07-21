'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, ShoppingBag, MessageCircle, User } from 'lucide-react';

const navItems = [
  { label: 'Accueil', href: '/', icon: Home },
  { label: 'Jeux', href: '/pc', icon: Gamepad2 },
  { label: 'Boutique', href: '/boutique', icon: ShoppingBag },
  { label: 'Discussion', href: '/discussion', icon: MessageCircle },
  { label: 'Connexion', href: '/connexion', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

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