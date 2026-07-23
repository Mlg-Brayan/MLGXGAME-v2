import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';

export default async function ApplicationsPage() {
  const { data: apps } = await supabase.from('applications').select('*');

  return (
    <main>
      <Header />
      <div style={{ padding: '32px clamp(16px, 4vw, 48px)' }}>
        <h1>Applications Gaming</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {apps?.length ?? 0} application{(apps?.length ?? 0) > 1 ? 's' : ''}
        </p>
        <div className="showcase-grid">
          {(apps ?? []).map((app) => (
            <Link key={app.id} href={`/applications/${app.slug}`} className="showcase-card">
              <div className="showcase-card-image">
                <Image src={app.image_url} alt={app.title} fill sizes="200px" />
              </div>
              <span className="showcase-card-title">{app.title}</span>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}