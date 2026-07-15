'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <a href="/" className="logo-link">
          <Image src="/logo.svg" alt="MLG XGAME" width={140} height={40} priority />
        </a>

        <div className="search-bar">
          <input type="text" placeholder="Rechercher un jeu..." />
        </div>

        <div className="header-actions">
          <a href="/connexion" className="auth-btn">
            Se connecter
          </a>

          <button className="icon-btn" aria-label="Assistant IA">
            🤖
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="side-panel-overlay" onClick={() => setMenuOpen(false)}>
          <div className="side-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu">
              ✕
            </button>
            <nav>
              <a href="/">Accueil</a>
              <a href="/pc">Jeux PC</a>
              <a href="/android">Android</a>
              <a href="/ios">iOS</a>
              <a href="/premium">Premium</a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}