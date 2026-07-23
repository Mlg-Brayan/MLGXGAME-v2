import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';

export default async function TemplatesPage() {
  const { data: templates } = await supabase.from('templates').select('*');

  return (
    <main>
      <Header />
      <div style={{ padding: '32px clamp(16px, 4vw, 48px)' }}>
        <h1>Templates Web</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {templates?.length ?? 0} template{(templates?.length ?? 0) > 1 ? 's' : ''}
        </p>
        <div className="showcase-grid">
          {(templates ?? []).map((t) => (
            <Link key={t.id} href={`/templates/${t.slug}`} className="showcase-card">
              <div className="showcase-card-image">
                <Image src={t.image_url} alt={t.title} fill sizes="200px" />
              </div>
              <span className="showcase-card-title">{t.title}</span>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}