'use client';

import { useMenu } from '@/context/MenuContext';

export default function SidePanel() {
  const { menuOpen, setMenuOpen } = useMenu();

  if (!menuOpen) return null;

  return (
    <div className="side-panel-overlay" onClick={() => setMenuOpen(false)}>
      <div className="side-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu">✕</button>
        <nav>
          <a href="/">Accueil</a>
          <a href="/pc">Jeux PC</a>
          <a href="/mobile">Jeux Mobile</a>
          <a href="/online">Jeux en ligne</a>
          <a href="/applications">Applications Gaming</a>
          <a href="/templates">Templates Web</a>
          <a href="/boutique">Boutique</a>
          <a href="/discussion">Discussion</a>
          <a href="/premium">Premium</a>
        </nav>
      </div>
    </div>
  );
}