import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <main>
      <Header />
      <div style={{ padding: '40px clamp(16px, 4vw, 48px)', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Conditions d&apos;utilisation</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>

        <h2>1. Acceptation des conditions</h2>
        <p>
          En accédant à MLGXGAME (ci-après « le Site ») et en l&apos;utilisant, vous reconnaissez avoir lu,
          compris et accepté d&apos;être lié par les présentes conditions d&apos;utilisation. Si vous n&apos;acceptez
          pas ces conditions, dans leur intégralité, vous devez cesser toute utilisation du Site.
        </p>

        <h2>2. Description du service</h2>
        <p>
          MLGXGAME est une plateforme de référencement de jeux vidéo, applications, templates web et produits
          liés au gaming. L&apos;accès au Site est gratuit ; certains produits, services ou contenus référencés
          par des tiers peuvent être payants.
        </p>

        <h2>3. Rôle d&apos;intermédiaire et absence de responsabilité sur les transactions et téléchargements tiers</h2>
        <p>
          MLGXGAME agit exclusivement en tant que catalogue et intermédiaire de référencement. Le Site ne vend,
          ne distribue et ne livre directement aucun jeu, aucune application, aucun template ni aucun produit
          physique ou numérique.
        </p>
        <p>
          Tout achat effectué via un lien présent sur le Site (y compris, sans s&apos;y limiter, les liens
          d&apos;affiliation de notre boutique) est conclu directement entre vous et le vendeur, la plateforme ou
          l&apos;éditeur tiers concerné. MLGXGAME n&apos;est partie à aucune de ces transactions et décline toute
          responsabilité quant à leur exécution, leur paiement, leur livraison, leur qualité ou leur conformité.
        </p>
        <p>
          De même, tout téléchargement de jeu, d&apos;application ou de logiciel effectué depuis un site tiers
          référencé par MLGXGAME s&apos;effectue sous l&apos;entière responsabilité de l&apos;utilisateur. MLGXGAME
          ne saurait être tenu responsable de tout dommage, perte de données, dysfonctionnement ou risque de
          sécurité résultant de l&apos;installation ou de l&apos;utilisation de contenus obtenus auprès de tiers.
        </p>

        <h2>4. Efforts raisonnables en matière de fiabilité et de sécurité</h2>
        <p>
          MLGXGAME met en œuvre des moyens raisonnables pour assurer la fiabilité, la disponibilité et la
          sécurité du Site, notamment par le biais de son infrastructure technique et de vérifications
          régulières des liens et contenus référencés. Toutefois, cette obligation est une obligation de
          moyens, et non de résultat : MLGXGAME ne peut garantir une disponibilité ininterrompue du Site, ni
          l&apos;absence totale d&apos;erreurs, de vulnérabilités ou de contenus tiers défaillants.
        </p>

        <h2>5. Contenu généré par les utilisateurs et retours constructifs</h2>
        <p>
          En publiant un commentaire ou un avis, vous garantissez que celui-ci ne contient aucun contenu
          illégal, diffamatoire, injurieux, discriminatoire ou portant atteinte aux droits de tiers. Nous nous
          réservons le droit de supprimer, sans préavis, tout contenu ne respectant pas ces règles.
        </p>
        <p>
          MLGXGAME accueille favorablement les critiques constructives visant à améliorer le Site, ses
          fonctionnalités ou son contenu. En revanche, les propos insultants, injurieux, harcelants ou
          dénués de toute intention constructive ne sont pas tolérés et pourront être supprimés.
        </p>

        <h2>6. Propriété intellectuelle</h2>
        <p>
          Les jeux, applications et produits référencés sur MLGXGAME appartiennent à leurs éditeurs et
          créateurs respectifs. MLGXGAME agit en tant que catalogue et ne revendique aucun droit sur ces
          contenus tiers.
        </p>

        <h2>7. Limitation générale de responsabilité</h2>
        <p>
          Dans toute la mesure permise par la loi applicable, MLGXGAME ne pourra être tenu responsable de tout
          dommage direct ou indirect résultant de l&apos;utilisation du Site, de l&apos;impossibilité de
          l&apos;utiliser, ou de l&apos;utilisation de tout contenu, produit ou service tiers accessible depuis
          celui-ci.
        </p>

        <h2>8. Modifications</h2>
        <p>
          Ces conditions peuvent être modifiées à tout moment. Il vous appartient de les consulter
          régulièrement. La poursuite de l&apos;utilisation du Site après modification vaut acceptation des
          nouvelles conditions.
        </p>

        <h2>9. Droit applicable</h2>
        <p>
          Ces conditions sont régies par le droit applicable aux États-Unis, lieu d&apos;exploitation du Site.
        </p>

        <h2>10. Contact</h2>
        <p>Pour toute question, contactez-nous à : [ton-email-de-contact@exemple.com]</p>
      </div>
      <Footer />
    </main>
  );
}