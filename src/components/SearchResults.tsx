'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { addToHistory, getHistory, clearHistory } from '@/lib/searchHistory';

type Item = {
  id: number;
  title: string;
  slug: string;
  image_url: string;
  type: string;
};

export default function SearchResults({ query, results }: { query: string; results: Item[] }) {
  const [history, setHistory] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (query.length > 0) {
      addToHistory(query);
    }
    setHistory(getHistory());
  }, [query]);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  if (query.length === 0) {
    return (
      <div style={{ padding: '32px clamp(16px, 4vw, 48px)' }}>
        <h1>Rechercher</h1>

        {history.length > 0 ? (
          <>
            <div className="search-history-header">
              <h2>Recherches récentes</h2>
              <button onClick={handleClearHistory} className="search-history-clear">
                Effacer
              </button>
            </div>
            <div className="search-history-list">
              {history.map((term) => (
                <button
                  key={term}
                  className="search-history-item"
                  onClick={() => router.push(`/recherche?q=${encodeURIComponent(term)}`)}
                >
                  {term}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>
            Utilisez la barre de recherche en haut pour trouver un jeu, une application, un template ou un produit.
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '32px clamp(16px, 4vw, 48px)' }}>
      <h1>Résultats pour &quot;{query}&quot;</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        {results.length} résultat{results.length > 1 ? 's' : ''}
      </p>

      <div className="showcase-grid">
        {results.map((item) => (
          <Link key={`${item.type}-${item.id}`} href={`/${item.type}/${item.slug}`} className="showcase-card">
            <div className="showcase-card-image">
              <Image src={item.image_url} alt={item.title} fill sizes="200px" />
            </div>
            <span className="showcase-card-title">{item.title}</span>
          </Link>
        ))}
      </div>

      {results.length === 0 && <p>Aucun résultat trouvé pour cette recherche.</p>}
    </div>
  );
}