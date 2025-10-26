Plan d'implémentation — actions en cours et suite (conservant design identique)

Etat actuel (résumé)
- Scaffold frontend React (Vite) créé dans frontend/
- Backend Express minimal créé dans backend/ avec endpoint /api/theme
- theme/config.json et scripts/backup_frontend.sh ajoutés
- Composants Header et Footer React initialisés (conservent classes et assets originaux)

Objectif immédiat
- Assurer que la page d'accueil React rend exactement comme l'original (pixel-perfect).

Étapes détaillées (ordre d'exécution)
1. Backup frontend (priorité avant toute modif)
   - Exécuter: ./scripts/backup_frontend.sh
   - Valider archive dans backups/
2. Build preview React (local)
   - npm install dans frontend/ puis npm run build
   - Servir dist/ ou utiliser le backend pour servir static files
3. Visual QA (en cours)
   - Capturer screenshots de la page d'accueil originale (desktop/tablet/mobile)
   - Capturer screenshots de la page d'accueil React scaffold
   - Exécuter comparaison pixelmatch / Playwright visual diff
   - Corriger écarts CSS/DOM sans renommer les classes existantes
4. Migrer le contenu HTML de fr.html dans composants réutilisables
   - Teaser, TeaserList, Card, PodcastCard, LanguageBar, SearchBar
   - Pour chaque composant: rendre la même structure DOM et importer CSS global
5. Mettre en place tests de régression visuelle automatisés
   - Playwright + pixelmatch ou Percy (config CI)
6. Backend: MongoDB + endpoints
   - Définir modèles Mongo: Article, Tag, Page
   - Créer endpoints: /api/articles, /api/search, /api/menu
7. Remplacement progressif des fragments statiques par fetchs API
8. Déploiement preview + redirects
   - Mettre en place redirections 301 pour URLs supprimées ou remappées

Tâches courantes (checklist rapide)
- [ ] Backup complet (./scripts/backup_frontend.sh)
- [x] Scaffold frontend + backend
- [x] Header, Footer React
- [ ] Build frontend (npm install && npm run build)
- [ ] Visual QA (in_progress)
- [ ] Migrate homepage content into React components
- [ ] Setup visual regression CI
- [ ] Implement MongoDB and API endpoints
- [ ] Deploy preview and verify redirects

Dépendances & outils recommandés
- React (Vite) pour dev rapide ou Next.js pour SSR (SEO) si souhaité
- Express + Mongoose pour backend MongoDB
- Playwright + pixelmatch / Percy pour visual regression
- Netlify / Vercel / DigitalOcean pour déploiement
- Sentry pour monitoring

Prochaine action (immédiate)
- Terminer Visual QA: je vais générer screenshots du scaffold React (si vous autorisez) et préparer le script de comparaison.

Actions réalisées par l'équipe/assistant (journal des opérations)
- Ajout d'un dossier "theme" contenant :
  - theme/config.json (manifest du menu et options de thème)
  - theme/README.md (instructions)
- Ajout d'un script de backup frontend : scripts/backup_frontend.sh
- Création du scaffold frontend (React + Vite) dans frontend/ :
  - frontend/package.json
  - frontend/index.html (importe CSS original pour conserver design)
  - frontend/src/ (App.jsx, main.jsx, styles/global.css)
  - frontend/src/components/Header/Header.jsx (lit /api/theme et theme/config.json)
  - frontend/src/components/Footer/Footer.jsx
- Création du backend Express minimal dans backend/ :
  - backend/package.json
  - backend/src/app.js (sert /api/theme et sert certains assets)
- Ajout d'un script pour capturer des screenshots automatiquement : tools/capture_screenshots.js
- Ajout d'un workflow GitHub Actions .github/workflows/capture-screenshots.yml qui :
  - installe Playwright, capture desktop + mobile screenshots de la page (BASE_URL + PAGE_PATH)
  - commit/ pousse les images dans migration_plan/screenshots quand il y a des modifications
- Captures manuelles réalisées (attachées à la conversation) :
  - migration_plan/screenshots/screenshot_home_desktop.png (documenté)
  - migration_plan/screenshots/screenshot_home_mobile.png (documenté)

Où trouver chaque artefact
- Config & thème: theme/config.json, theme/README.md
- Backup script: scripts/backup_frontend.sh
- Frontend scaffold: frontend/
- Backend scaffold: backend/
- Screenshots + documentation: migration_plan/screenshots/ README.md
- Playwright script: tools/capture_screenshots.js
- GitHub workflow: .github/workflows/capture-screenshots.yml

Comment reproduire localement (récapitulatif pas-à-pas)
1) Sauvegarde du frontend (important)
   - sh ./scripts/backup_frontend.sh www.vaticannews.va backups
2) Lancer le frontend en local
   - cd frontend
   - npm install
   - npm run dev (ou npm run build && npm run preview)
3) Lancer le backend local (optionnel pour /api/theme)
   - cd backend
   - npm install
   - npm run dev
4) Capturer screenshots localement (si vous ne voulez pas utiliser GitHub Actions)
   - npm i -D playwright
   - npx playwright install --with-deps
   - node tools/capture_screenshots.js (assurez-vous d'avoir BASE_URL et PAGE_PATH si nécessaire)
5) Pour exécuter via CI (GitHub Actions)
   - Aller sur Actions > Capture screenshots > Run workflow
   - Entrer BASE_URL et PAGE_PATH si vous souhaitez override

Étapes à suivre par la suite (prioritaires)
- (A) Finaliser la migration de la page d'accueil : convertir chaque bloc (teaser, cards) en composants React en respectant la structure DOM et en important le CSS original.
- (B) Mettre en place visual regression (Playwright comparant screenshots actuelles vs nouvelles) et automatiser fail on diff above threshold.
- (C) Implémenter MongoDB + endpoints (backend/src) et remplacer le contenu statique par fetchs API étape par étape.
- (D) Planifier la bascule finale (redirects, SEO, monitoring)

Notes importantes pour l'équipe
- Toujours préserver les classes CSS et variables (ne pas renommer). Toute modification CSS doit être minimale et documentée.
- Conserver les media queries et breakpoints intacts pour préserver le rendu responsive.
- Les auteurs successifs peuvent retrouver les artefacts et scripts aux chemins listés ci-dessus.

Prochaine étape immédiate automatique (si vous confirmez)
- Activer le workflow GitHub Actions pour capturer périodiquement les screenshots et committer les changements.

---

Si vous voulez, je peux maintenant :
- activer et lancer le workflow (vous devrez déclencher manuellement depuis Actions ou me dire d'ajouter schedule),
- ou continuer à convertir la page d'accueil (commencer la migration des teasers en composants React).
