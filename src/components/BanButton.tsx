'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BanButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBan = async () => {
    if (!confirm('Confirmer le bannissement de cet utilisateur ?')) return;
    setLoading(true);

    const res = await fetch('/api/ban-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    setLoading(false);
    if (res.ok) router.refresh();
  };

  return (
    <button onClick={handleBan} disabled={loading} className="report-confirm-yes" style={{ padding: '8px 16px' }}>
      {loading ? 'Bannissement...' : 'Bannir cet utilisateur'}
    </button>
  );
}