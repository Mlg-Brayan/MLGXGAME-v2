'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

type Favorite = {
  id: number;
  item_type: string;
  item_slug: string;
  item_title: string;
  item_image: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: false });

      setFavorites(data ?? []);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <main>
      <Header />
      <div style={{ padding: '32px clamp(16px, 4vw, 48px)' }}>
        <h1>Mes favoris</h1>

        {!loading && !loggedIn && (
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>
            Connecte-toi pour voir et gérer tes favoris.
          </p>
        )}

        {!loading && loggedIn && favorites.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>
            Tu n&apos;as pas encore de favoris. Clique sur le cœur d&apos;un jeu, d&apos;une application,
            d&apos;un template ou d&apos;un produit pour l&apos;ajouter ici.
          </p>
        )}

        {favorites.length > 0 && (
          <div className="showcase-grid" style={{ marginTop: '20px' }}>
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
      <Footer />
    </main>
  );
}