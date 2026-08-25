import Link from 'next/link';
import Image from 'next/image';
import { Gamepad2, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-tag">JOUE. COMPÈTE. GAGNE.</span>
        <h1 className="hero-title">
          Bienvenue sur <span className="hero-title-accent">MLGxGame</span>
        </h1>
        <p className="hero-text">
          Découvre les meilleurs jeux PC et Mobile, rejoins la communauté et deviens une légende.
        </p>
        <div className="hero-actions">
          <Link href="/jeux" className="hero-cta-primary">
            <Gamepad2 size={18} />
            Découvrir les jeux
          </Link>
          <Link href="/discussion" className="hero-cta-secondary">
            <Users size={18} />
            Rejoindre la communauté
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <Image src="/hero-gamer.png" alt="MLGxGame" fill sizes="500px" priority />
      </div>
    </section>
  );
}