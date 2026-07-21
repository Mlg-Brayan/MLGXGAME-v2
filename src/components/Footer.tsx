export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <a href="/politique-de-confidentialite">Politique de confidentialité</a>
        <a href="/conditions-utilisation">Conditions d&apos;utilisation</a>
      </div>
      <p>© {new Date().getFullYear()} MLGXGAME. Tous droits réservés.</p>
      <p className="footer-credit">
        Créé par Malonga Emmanuel Brayan, avec l&apos;assistance de Claude AI
      </p>
    </footer>
  );
}