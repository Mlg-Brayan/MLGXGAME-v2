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
  const isPasswordStrong = (pwd: string) => {
  const hasMinLength = pwd.length >= 8;
  const hasUppercase = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(pwd);
  return hasMinLength && hasUppercase && hasNumber && hasSpecialChar;
};
 const handleSubmit = async (e: React.FormEvent) => {
  if (!isPasswordStrong(password)) {
  setError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial (!@#$%...).');
  setLoading(false);
  return;
}
  e.preventDefault();
  setError('');
  setLoading(true);

  const trimmedUsername = username.trim();

  // Vérifie si le pseudo est déjà pris
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .ilike('username', trimmedUsername)
    .maybeSingle();

  if (existing) {
    setError('Ce pseudo est déjà pris.');
    setLoading(false);
    return;
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: trimmedUsername },
    },
  });

  if (signUpError) {
    setError(signUpError.message);
    setLoading(false);
    return;
  }

  if (signUpData.user) {
    await supabase.from('profiles').insert({
      id: signUpData.user.id,
      username: trimmedUsername,
    });
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
            placeholder="Mot de passe (8+ car., 1 majuscule, 1 chiffre, 1 spécial)"
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