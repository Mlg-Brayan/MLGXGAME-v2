import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ banned: false });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabaseAdmin
    .from('banned_users')
    .select('id, reason, banned_until')
    .eq('email', email)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ banned: false });
  }

  // Suspension temporaire expirée : on la lève automatiquement
  if (data.banned_until && new Date(data.banned_until) < new Date()) {
    await supabaseAdmin.from('banned_users').delete().eq('id', data.id);
    return NextResponse.json({ banned: false });
  }

  return NextResponse.json({ banned: true, reason: data.reason });
}