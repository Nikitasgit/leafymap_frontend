import BackButton from "@/components/common/buttons/BackButton";
import { APP_NAME } from "@/utils/constants";
import initTranslations from "../../../i18n";
import styles from "./cgu.module.scss";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("cgu", locale);
}

export default async function CGUPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await initTranslations(locale, ["common"]);

  return (
    <div className={styles.cguPage}>
      <div className={styles.backButtonContainer}>
        <BackButton />
      </div>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Conditions Générales d&apos;Utilisation
        </h1>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Objet</h2>
            <p>
              Les présentes conditions générales d&apos;utilisation (CGU)
              régissent l&apos;utilisation de la plateforme {APP_NAME}. En
              accédant et en utilisant notre service, vous acceptez d&apos;être
              lié par ces conditions.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Définitions</h2>
            <ul>
              <li>
                <strong>Plateforme :</strong> Le site web {APP_NAME}
              </li>
              <li>
                <strong>Utilisateur :</strong> Toute personne accédant à la
                plateforme
              </li>
              <li>
                <strong>Contenu :</strong> Toute information, donnée, texte,
                image ou média publié sur la plateforme
              </li>
              <li>
                <strong>Organisateur :</strong> Utilisateur gérant un lieu ou
                des événements
              </li>
              <li>
                <strong>Créateur :</strong> Utilisateur présentant des produits
                ou participant à des événements
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Acceptation des conditions</h2>
            <p>
              L&apos;utilisation de la plateforme implique l&apos;acceptation
              pleine et entière des présentes CGU. Si vous n&apos;acceptez pas
              ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Comptes utilisateurs</h2>
            <ul>
              <li>
                Chaque utilisateur est responsable de la confidentialité de ses
                identifiants (email et mot de passe).
              </li>
              <li>
                Toute activité réalisée via un compte utilisateur est réputée
                être effectuée par son titulaire.
              </li>
              <li>
                {APP_NAME} se réserve le droit de suspendre ou supprimer un
                compte en cas de non-respect des présentes CGU.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Utilisation de la plateforme</h2>
            <p>Vous vous engagez à :</p>
            <ul>
              <li>
                Utiliser la plateforme conformément à la législation en vigueur
              </li>
              <li>
                Ne pas publier de contenu illégal, offensant, diffamatoire ou
                inapproprié
              </li>
              <li>Respecter les droits de propriété intellectuelle</li>
              <li>
                Ne pas tenter de compromettre la sécurité ou le bon
                fonctionnement de la plateforme
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Contenu généré par les utilisateurs</h2>
            <p>
              Les utilisateurs restent propriétaires des contenus (textes,
              photos, vidéos) qu&apos;ils publient sur la plateforme. En
              publiant un contenu, vous accordez à {APP_NAME} une licence non
              exclusive, gratuite et mondiale pour afficher, héberger et
              diffuser ce contenu dans le cadre de la plateforme.
            </p>
            <p>
              Il est interdit de publier du contenu mensonger, diffamatoire,
              discriminatoire ou portant atteinte aux droits d&apos;auteurs ou à
              la vie privée d&apos;autrui.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Messagerie interne</h2>
            <p>
              La messagerie intégrée est réservée aux échanges liés à
              l&apos;organisation d&apos;événements et de partenariats. Tout
              usage abusif (spam, harcèlement, publicité non autorisée) est
              strictement interdit et pourra entraîner la suspension du compte.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Responsabilité</h2>
            <p>
              {APP_NAME} agit uniquement comme intermédiaire et n&apos;intervient
              pas dans les partenariats, événements ou transactions entre
              utilisateurs. Chaque organisateur est seul responsable de la
              légalité et de la conformité des événements qu&apos;il publie.
            </p>
            <p>
              {APP_NAME} ne garantit pas la disponibilité ininterrompue du
              service et ne saurait être tenu responsable en cas de panne
              technique, perte de données ou attaque informatique.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Suppression de compte et données</h2>
            <p>
              L&apos;utilisateur peut demander la suppression de son compte et
              de ses données personnelles à tout moment. Certaines informations
              (logs techniques, factures) peuvent être conservées temporairement
              pour des obligations légales.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Propriété intellectuelle</h2>
            <p>
              Tous les contenus créés par {APP_NAME} (textes, images, logos,
              design, code) sont protégés par le droit d&apos;auteur. Toute
              reproduction sans autorisation est interdite.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Protection des données</h2>
            <p>
              Le traitement de vos données personnelles est régi par notre
              politique de confidentialité, conforme au Règlement Général sur la
              Protection des Données (RGPD).
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Modification des CGU</h2>
            <p>
              {APP_NAME} se réserve le droit de modifier ces conditions à tout
              moment. Les modifications prendront effet dès leur publication sur
              la plateforme.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Contact</h2>
            <p>
              Pour toute question concernant ces conditions d&apos;utilisation,
              vous pouvez nous contacter à l&apos;adresse :
              victorleman1@gmail.com
            </p>
          </section>

          <section className={styles.section}>
            <h2>14. Droit applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit français. En cas de
              litige, les tribunaux français seront seuls compétents.
            </p>
          </section>

          <div className={styles.lastUpdated}>
            <p>
              <em>Dernière mise à jour : Septembre 2025</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
