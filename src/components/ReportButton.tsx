'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

type Props = {
  reportedUserId: string;
  contentType: string;
  contentId: string;
};

export default function ReportButton({ reportedUserId, contentType, contentId }: Props) {
  const [reported, setReported] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReport = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    if (!user) return;

    await supabase.from('reports').insert({
      reported_user_id: reportedUserId,
      reporter_id: user.id,
      content_type: contentType,
      content_id: contentId,
      reason: 'Signalé par un utilisateur',
    });

    setReported(true);
    setShowConfirm(false);
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
          <p>Signaler ce message ?</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleReport} className="report-confirm-yes">Oui</button>
            <button onClick={() => setShowConfirm(false)} className="report-confirm-no">Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}