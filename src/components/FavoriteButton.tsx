'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

type Props = {
  itemType: string;
  itemSlug: string;
  itemTitle: string;
  itemImage: string;
};

export default function FavoriteButton({ itemType, itemSlug, itemTitle, itemImage }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkFavorite() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      setUserId(user?.id ?? null);

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: favorite } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_slug', itemSlug)
        .maybeSingle();

      setIsFavorite(!!favorite);
      setLoading(false);
    }

    checkFavorite();
  }, [itemType, itemSlug]);

  const handleClick = async () => {
    if (!userId) {
      router.push('/connexion');
      return;
    }

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('item_type', itemType)
        .eq('item_slug', itemSlug);
      setIsFavorite(false);
    } else {
      await supabase.from('favorites').insert({
        user_id: userId,
        item_type: itemType,
        item_slug: itemSlug,
        item_title: itemTitle,
        item_image: itemImage,
      });
      setIsFavorite(true);
    }
  };

  if (loading) return null;

  return (
    <button
      className={`favorite-btn ${isFavorite ? 'favorite-btn-active' : ''}`}
      onClick={handleClick}
      aria-label="Ajouter aux favoris"
    >
      <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
  );
}