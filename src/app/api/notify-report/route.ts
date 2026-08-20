import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { reportedUserId } = await request.json();

  if (!reportedUserId) {
    return NextResponse.json({ error: 'Missing reportedUserId' }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { count } = await supabaseAdmin
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('reported_user_id', reportedUserId);

  if (count !== null && count >= 3) {
    await resend.emails.send({
      from: 'MLGXGAME <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: `⚠️ Utilisateur signalé ${count} fois`,
      html: `<p>Un utilisateur a été signalé <strong>${count} fois</strong>.</p>
             <p>ID utilisateur : ${reportedUserId}</p>
             <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/reports">Voir dans le panel admin</a></p>`,
    });
  }

  return NextResponse.json({ ok: true, count });
}