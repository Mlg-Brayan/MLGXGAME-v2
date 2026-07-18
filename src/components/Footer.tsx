export default function Footer() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} MLGXGAME. Tous droits réservés.</p>
      <p className="footer-credit">
        Créé par Malonga Emmanuel Brayan, avec l&apos;assistance de Claude AI
      </p>
    </footer>
  );
}