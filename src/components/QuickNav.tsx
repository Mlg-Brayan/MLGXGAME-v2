import Link from 'next/link';
import { Monitor, Smartphone, LayoutTemplate, AppWindow, ShoppingBag,  MessageCircle } from 'lucide-react';

const smallTiles = [
  { label: 'Jeux PC', href: '/pc', icon: Monitor },
  { label: 'Jeux Mobile', href: '/mobile', icon: Smartphone },
  { label: 'Templates Web', href: '/templates', icon: LayoutTemplate },
  { label: 'Applications Gaming', href: '/applications', icon: AppWindow },
  { label: 'Boutique', href: '/boutique', icon: ShoppingBag },
  { label: 'Discussion', href: '/discussion', icon: MessageCircle },
];

export default function QuickNav() {
  return (
    <div className="bento-wrapper">
      <div className="bento-small-tiles">
        {smallTiles.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="bento-tile">
              <Icon className="bento-icon" strokeWidth={1.75} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      
    </div>
  );
}