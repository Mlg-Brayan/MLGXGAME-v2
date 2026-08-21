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
    // Vérifie s'il n'est pas déjà banni (temporairement ou définitivement)
    const { data: alreadyBanned } = await supabaseAdmin
      .from('banned_users')
      .select('id')
      .eq('user_id', reportedUserId)
      .maybeSingle();

    if (!alreadyBanned) {
      const { data: targetUser } = await supabaseAdmin.auth.admin.getUserById(reportedUserId);
      const suspensionEnd = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

      await supabaseAdmin.from('banned_users').insert({
        user_id: reportedUserId,
        email: targetUser?.user?.email ?? null,
        reason: 'Suspension automatique de 48h - 3 signalements en attente de revue',
        banned_until: suspensionEnd.toISOString(),
      });
    }

    await resend.emails.send({
      from: 'MLGXGAME <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: `⚠️ Utilisateur suspendu 48h (${count} signalements)`,
      html: `<p>Un utilisateur a été <strong>automatiquement suspendu 48h</strong> après ${count} signalements.</p>
             <p>ID utilisateur : ${reportedUserId}</p>
             <p>Vérifie et décide : bannissement permanent ou levée de la suspension.</p>
             <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/reports">Voir dans le panel admin</a></p>`,
    });
  }

  return NextResponse.json({ ok: true, count });
}