export default function AboutSection() {
  return (
    <section className="about-section">
      <div className="about-content">
        <span className="about-badge">Notre mission</span>
        <h2>Le gaming, réuni en un seul endroit</h2>
        <p>
          MLGXGAME est une plateforme née de la passion du jeu vidéo, pensée pour rassembler en un seul endroit
          les meilleurs jeux disponible sur PC, mobile et navigateur. Notre mission est simple : offrir aux joueurs
          un catalogue fiable, à jour, et sans détour, tout en construisant une communauté active autour du gaming.
        </p>
        <p>
          Au-delà des jeux, nous voulons devenir la référence pour tout ce qui touche à l&apos;univers gamer :
          des recommandations d&apos;applications utiles au streaming et à l&apos;optimisation, des accessoires
          gaming sélectionnés avec soin, et bientôt des outils créés par nous-mêmes pour aider d&apos;autres
          créateurs à lancer leurs propres projets web. Alors vennez partager votre savoir avec nous.
        </p>

        <div className="about-stats">
          <div className="about-stat">
            <span className="about-stat-number">100%</span>
            <span className="about-stat-label">Accès gratuit</span>
         </div>
          <div className="about-stat">
            <span className="about-stat-number">4</span>
            <span className="about-stat-label">Plateformes</span>
          </div>
          <div className="about-stat">
            <span className="about-stat-number">24/7</span>
            <span className="about-stat-label">Disponible</span>
          </div>
        </div>
      </div>
    </section>
  );
}