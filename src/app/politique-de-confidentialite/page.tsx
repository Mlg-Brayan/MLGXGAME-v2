import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Header />
      <div style={{ padding: '40px clamp(16px, 4vw, 48px)', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Politique de confidentialité</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>

        <h2>1. Qui sommes-nous</h2>
        <p>
          MLGXGAME est un site édité par un particulier, opéré depuis les États-Unis. Pour toute question
          concernant cette politique, vous pouvez nous contacter à l&apos;adresse indiquée en bas de cette page.
        </p>

        <h2>2. Données que nous collectons</h2>
        <p>Nous collectons les données suivantes :</p>
        <ul>
          <li>
            <strong>Commentaires</strong> : lorsque vous publiez un avis, nous enregistrons le nom que vous
            renseignez et le contenu de votre message.
          </li>
          <li>
            <strong>Votes</strong> : un identifiant anonyme est généré et stocké dans votre navigateur
            (localStorage) pour éviter les votes multiples. Cet identifiant n&apos;est pas lié à votre identité réelle.
          </li>
          <li>
            <strong>Préférences de navigation</strong> : nous enregistrons localement, dans votre navigateur,
            les catégories de jeux que vous consultez, afin de personnaliser les recommandations affichées.
            Ces données restent sur votre appareil et ne sont pas transmises à des tiers.
          </li>
        </ul>

        <h2>3. Cookies et stockage local</h2>
        <p>
          Le site utilise le stockage local de votre navigateur (localStorage) pour mémoriser vos préférences
          et votre statut de vote. Aucun cookie de suivi publicitaire tiers n&apos;est utilisé à ce jour.
        </p>

        <h2>4. Services tiers</h2>
        <p>Nous utilisons les services suivants pour faire fonctionner le site :</p>
        <ul>
          <li><strong>Supabase</strong> : hébergement de notre base de données (commentaires, votes, catalogue).</li>
          <li><strong>Vercel</strong> : hébergement du site.</li>
        </ul>
        <p>
          Certains liens présents sur le site (notamment dans notre boutique) sont des liens d&apos;affiliation.
          Nous pouvons percevoir une commission si vous effectuez un achat via ces liens, sans coût
          supplémentaire pour vous.
        </p>

        <h2>5. Vos droits</h2>
        <p>
          Vous pouvez demander la suppression de tout commentaire publié en nous contactant. Vous pouvez
          également effacer les données stockées localement dans votre navigateur à tout moment via les
          paramètres de votre navigateur.
        </p>

        <h2>6. Modifications</h2>
        <p>
          Cette politique peut être mise à jour à mesure que le site évolue. La date de dernière modification
          est indiquée en haut de cette page.
        </p>

        <h2>7. Contact</h2>
        <p>Pour toute question, contactez-nous à : [ton-email-de-contact@exemple.com]</p>
      </div>
      <Footer />
    </main>
  );
}