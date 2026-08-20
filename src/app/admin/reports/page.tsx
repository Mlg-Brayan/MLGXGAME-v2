import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BanButton from '@/components/BanButton';

export default async function AdminReportsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/');
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: reports } = await supabaseAdmin.from('reports').select('*');

  const counts: Record<string, { count: number; reasons: string[] }> = {};
  (reports ?? []).forEach((r) => {
    if (!counts[r.reported_user_id]) counts[r.reported_user_id] = { count: 0, reasons: [] };
    counts[r.reported_user_id].count += 1;
    counts[r.reported_user_id].reasons.push(r.reason);
  });

  const flagged = Object.entries(counts)
    .filter(([, v]) => v.count >= 3)
    .sort((a, b) => b[1].count - a[1].count);

  return (
    <main>
      <Header />
      <div style={{ padding: '32px clamp(16px, 4vw, 48px)', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Utilisateurs signalés (3+)</h1>
        {flagged.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>Aucun utilisateur à examiner pour le moment.</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
          {flagged.map(([userId, data]) => (
            <div key={userId} className="comment-item">
              <p style={{ fontWeight: 700 }}>ID : {userId}</p>
              <p style={{ color: 'var(--accent)', marginTop: '4px' }}>{data.count} signalements</p>
              <ul style={{ marginTop: '8px', paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                {data.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <div style={{ marginTop: '12px' }}>
                <BanButton userId={userId} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
