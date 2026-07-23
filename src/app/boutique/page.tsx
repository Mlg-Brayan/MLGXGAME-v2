import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';

export default async function BoutiquePage() {
  const { data: items } = await supabase.from('boutique').select('*');

  return (
    <main>
      <Header />
      <div style={{ padding: '32px clamp(16px, 4vw, 48px)' }}>
        <h1>Boutique</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {items?.length ?? 0} produit{(items?.length ?? 0) > 1 ? 's' : ''}
        </p>
        <div className="showcase-grid">
          {(items ?? []).map((item) => (
            <Link key={item.id} href={`/boutique/${item.slug}`} className="showcase-card">
              <div className="showcase-card-image">
                <Image src={item.image_url} alt={item.title} fill sizes="200px" />
              </div>
              <span className="showcase-card-title">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}