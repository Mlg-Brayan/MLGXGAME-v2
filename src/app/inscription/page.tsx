'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <main>
        <Header />
        <div className="auth-page">
          <h1>Vérifie ta boîte mail</h1>
          <p>Un lien de confirmation a été envoyé à {email}. Clique dessus pour activer ton compte.</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="auth-page">
        <h1>Créer un compte</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe (6 caractères min.)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>
        <p className="auth-switch">
          Déjà un compte ? <Link href="/connexion">Se connecter</Link>
        </p>
      </div>
      <Footer />
    </main>
  );
}