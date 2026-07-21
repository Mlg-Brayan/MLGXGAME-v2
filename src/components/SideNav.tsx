'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Gamepad2, ShoppingBag, User } from 'lucide-react';

const navItems = [
  { label: 'Accueil', href: '/', icon: Home },
  { label: 'Recherche', href: '/recherche', icon: Search },
  { label: 'Jeux', href: '/pc', icon: Gamepad2 },
  { label: 'Boutique', href: '/boutique', icon: ShoppingBag },
  { label: 'Profil', href: '/connexion', icon: User },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="side-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`side-nav-item ${isActive ? 'side-nav-active' : ''}`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.2 : 1.75} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}