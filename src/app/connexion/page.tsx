'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const attemptsCheck = await fetch('/api/check-login-attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const attemptsData = await attemptsCheck.json();

    if (attemptsData.blocked) {
      setError(`Trop de tentatives. Réessaie dans ${attemptsData.waitMinutes} minutes.`);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      await fetch('/api/record-login-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, success: false }),
      });
      setError('Email ou mot de passe incorrect.');
      return;
    }

    await fetch('/api/record-login-attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, success: true }),
    });

    const banCheck = await fetch('/api/check-ban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const banData = await banCheck.json();

    if (banData.banned) {
      await supabase.auth.signOut();
      setError('Ce compte a été banni : ' + banData.reason);
      return;
    }

    router.push('/');
    router.refresh();
  } catch (err) {
    console.error('Erreur connexion:', err);
    setError('Une erreur est survenue. Réessaie.');
  } finally {
    setLoading(false);
  }
};

  return (
    <main>
      <Header />
      <div className="auth-page">
        <h1>Se connecter</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="auth-switch">
          Pas encore de compte ? <Link href="/inscription">Créer un compte</Link>
        </p>
      </div>
      <Footer />
    </main>
  );
}