Plan de migration — Frontend React + Backend Express + MongoDB (conserver EXACTEMENT le design)

Objectif
- Migrer le frontend statique existant en une application React (SPA/SSR selon besoin) et implémenter un backend Express avec MongoDB Community pour les services API.
- Conserver à l’identique le rendu visuel (même DOM, mêmes classes CSS, mêmes assets, mêmes media queries et tailles).
- Fournir sauvegardes et procédure permettant rollback rapide.

Principes clés
1. Ne pas renommer de classes CSS existantes ni modifier les variables de style (ex: color: $black ou var(--black, #000)).
2. Réutiliser tous les fichiers CSS/SCSS/JS originaux tels quels. Si besoin d’encapsuler dans des composants React, rendre la même structure DOM et appliquer exactement les mêmes classes.
3. Préserver les media queries et breakpoints inchangés.
4. Convertir les éventuels styles inline uniquement si nécessaire, en créant des classes portant exactement les mêmes règles et en ajoutant ces classes au DOM (ne pas modifier les noms de variables CSS existants).
5. Workflow incrémental: ne pas remplacer tout le site d’un coup. Migrer page par page, commencer par la page d’accueil (priorité demandée).

Étapes préliminaires — sauvegarde complète (obligatoire)
- Créer une archive complète du site frontend (tout le dossier www.vaticannews.va et assets: etc/designs/..., content/dam/..., fichiers .html, .css, .js). Exemple (exécuter localement):
  - cp -r www.vaticannews.va backups/www-vaticannews-va-YYYYMMDD
  - tar -czf backups/www-vaticannews-va-YYYYMMDD.tar.gz www.vaticannews.va
- Exporter la base de données (si existante) et sauvegarder backend actuel.
- Versionner la sauvegarde dans un repo privé ou un stockage d’artefacts.
- Créer un point de restauration/branch pour revenir rapidement en arrière.

Architecture recommandée
- Frontend: React + Vite (ou Create React App) pour développement rapide. Si SSR est nécessaire (SEO), utiliser Next.js mais garder DOM intact.
- Backend: Node.js + Express
- DB: MongoDB Community (ou Atlas pour production) — collections et schéma légers.
- Déploiement: frontend sur Netlify / Vercel / static host; backend sur Fly / Heroku / DigitalOcean; base Mongo sur instance gérée (Atlas) ou serveur MongoDB community auto-hébergé.

Structure du projet (exemple)
- repo-root/
  - frontend/
    - public/ (copier tout le dossier www.vaticannews.va ici: public/*)
    - src/
      - components/
        - Header/ (Header.jsx, Header.css)
        - Footer/
        - Teaser/
        - SearchBar/
      - pages/
        - Home.jsx (reproduit exactement le HTML de fr.html)
      - assets/ (images, icons — pointer vers public/etc/...)
    - package.json
  - backend/
    - src/
      - routes/
      - controllers/
      - models/
      - app.js
    - package.json
  - migration_plan/

Stratégie de reproduction EXACTE du design
1. Copier tel quel le HTML initial (ex: fr.html) dans frontend/public/fr.html afin d’avoir une référence de rendu.
2. Créer composants React qui rendent exactement le même HTML:
   - Favoriser composants «vanilla» qui retournent le fragment HTML original (JSX identique à l’HTML) plutôt que de refactorer structure DOM.
   - Exemple: Header.jsx doit rendre la même balise <header id="header-main" ...> avec les mêmes classes et attributs.
3. Ne changez pas les attributs aria, les titres, ni l’ordre des éléments (pour l’accessibilité et SEO).
4. Importer exactement les fichiers CSS/JS originaux (dans public/etc/designs/...) et référencer ces fichiers globalement (index.html).
5. Conserver les scripts JS anciens si nécessaires (ex: libs UI). Si vous reconstruisez certaines interactions en React, assurez-vous du résultat visuel identique.

Pages prioritaires
- Page d’accueil (fr.html) — priorité N°1 (vous l’avez indiqué). Reproduire:
  - header (logo, menu, languageBar, searchBar)
  - contenu principal (teasers, cartes, images, typographies)
  - footer (liens, social)
  - tailles, marges, paddings, polices, icônes exactes

Gestion des assets et icônes
- Copier tous les assets statiques (images/ICONS/SVGs) dans frontend/public/etc/designs/... et préserver les chemins relatifs originaux.
- Si des icônes sont chargés via sprites ou fonts, inclure les mêmes fichiers.

Data layer et API
- Backend Express exposera APIs REST: /api/articles, /api/tags, /api/search, /api/menu, /api/langs
- Le frontend initial peut server-render (SSR) ou hydrater des pages statiques; pour éviter changement visuel initial, vous pouvez servir la page HTML statique (copie exacte) pendant la migration et progressivement hydrater en React.
- Modèles Mongo (exemples): Article { title, slug, content, date, section }, Tag { name, slug }

Sécurité & SEO
- Conserver les balises meta, canonical, hreflang identiques.
- Reproduire les attributs title/alt sur images.
- Implémenter helmet sur Express pour en-têtes sécurisés.

Visual QA (garantir pixel-perfect)
1. Capturer screenshots de la page actuelle (desktop/tablette/mobile) — référence master.
2. Après chaque composant migré, prendre screenshots et faire diff visuel (outil suggéré: Playwright + pixelmatch, ou Percy/Chromatic)
3. Automated visual regression: définir seuil 0% pour éléments critiques (header/footer/home hero)
4. Tests manuels: vérifier responsive breakpoints, interactions du menu, langage, recherche.

Progression incrémentale (workflow)
1. Branch: migration/react-express-mongo
2. Commit initial: scaffold frontend + backend + copie publique du site (public/www...)
3. Implementer Header component reproduisant HTML exact + importer CSS global
4. Visual QA: comparer
5. Répéter pour Footer, SearchBar, Teasers, etc.
6. Switch to API-driven content: remplacer fragments statiques par fetchs API progressivement.
7. Remove static files only after full verification

Rollback & backup
- Garder copie exacte du site static en production ou servi depuis un bucket séparé, prêt à être basculé.
- Tags Git et backups d’artefacts pour rollback rapide.

Redirects & SEO handling des pages supprimées
- Pour les pages effectivement supprimées (ex: fr/vatican.html) : ajouter redirections 301 vers la page la plus pertinente ou maintenir un contenu équivalent.

Tests et CI
- Linting: ESLint + Prettier
- Tests unitaires: Jest + React Testing Library
- Tests d’intégration: Supertest pour Express
- Visual regression: Playwright + pixelmatch ou Percy
- CI: GitHub Actions — build frontend, run tests, build backend container

Monitoring & Observabilité
- Logs applicatifs: Winston / Morgan (Express)
- Erreurs: Sentry
- Performance: Lighthouse CI

Déploiement
- Frontend: Netlify/Vercel or static host
- Backend: Fly / Heroku / DigitalOcean; Mongo: Atlas ou serveur managed
- Setup variables d’env (connexion Mongo, secrets) dans CI/CD

Temps estimé (approximatif, équipe 1-2 devs)
- Audit & backup: 1–2 jours
- Scaffold projet & copier assets: 1–2 jours
- Header + Footer + CSS import + QA: 3–5 jours
- Page d’accueil complète (HTML exact + teasers) + visual regression stable: 7–14 jours
- APIs & integration backend basique: 3–7 jours
- Total initial (MVP, page d’accueil identique et backend minimal): ~2–4 semaines

Checklist utilisateur (actionnable)
- [ ] Valider backup complet du site (je peux générer la liste des fichiers à sauvegarder)
- [ ] Choix exact du framework frontend (CRA / Vite / Next.js)
- [ ] Décider SSR (SEO) ou SPA (speed)
- [ ] Mise en place repo & branch de migration
- [ ] Définir tests visuels automatisés
- [ ] Plan de déploiement & rollback

Fichiers créés / livrables
- Repo scaffold (frontend + backend)
- Copy of public HTML/CSS/JS assets
- Visual regression pipeline
- Documentation & checklist (ce fichier)

Prochaine étape que je peux faire pour vous
- Générer automatiquement le scaffold (frontend + backend minimal) et copier la page d’accueil statique dans frontend/public afin que vous puissiez commencer les composants.
- Ou, si vous préférez, je crée uniquement la checklist d’actions détaillées par jour et les scripts de sauvegarde.

---

Si vous voulez que j’écrive ce plan dans un autre format (TXT, JSON or TODO list) ou que je crée le scaffold maintenant, dites « fais le scaffold » ou « crée la checklist ».
