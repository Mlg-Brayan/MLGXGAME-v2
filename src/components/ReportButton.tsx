'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

type Props = {
  reportedUserId: string;
  contentType: string;
  contentId: string;
};

const REASONS = [
  'Propos haineux ou insultants',
  'Harcèlement',
  'Spam ou publicité',
  'Contenu inapproprié',
  'Autre',
];

export default function ReportButton({ reportedUserId, contentType, contentId }: Props) {
  const [reported, setReported] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReport = async () => {
    if (!selectedReason) return;

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    if (!user) return;

    setSubmitting(true);

    const { error } = await supabase.from('reports').insert({
      reported_user_id: reportedUserId,
      reporter_id: user.id,
      content_type: contentType,
      content_id: contentId,
      reason: selectedReason,
    });

    setSubmitting(false);

    if (!error) {
      setReported(true);
      setShowConfirm(false);
    } else if (error.code === '23505') {
      // Déjà signalé par cet utilisateur (contrainte unique)
      setReported(true);
      setShowConfirm(false);
    }
  };

  if (reported) {
    return <span className="report-done">Signalé</span>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <button className="report-btn" onClick={() => setShowConfirm(!showConfirm)} aria-label="Signaler">
        <Flag size={14} />
      </button>
      {showConfirm && (
        <div className="report-confirm">
          <p>Pourquoi signaler ce message ?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
            {REASONS.map((r) => (
              <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="report-reason"
                  value={r}
                  checked={selectedReason === r}
                  onChange={() => setSelectedReason(r)}
                />
                {r}
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleReport} className="report-confirm-yes" disabled={!selectedReason || submitting}>
              {submitting ? '...' : 'Envoyer'}
            </button>
            <button onClick={() => setShowConfirm(false)} className="report-confirm-no">Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}