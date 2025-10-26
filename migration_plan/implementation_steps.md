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

Si vous autorisez, je lance maintenant :
- npm install && npm run build dans frontend (générer dist)
- Capturer screenshots de la page d'accueil scaffold

Dites "OK build" pour que je lance le build et capture/sortie des screenshots, ou "non" pour d'abord exécuter la sauvegarde manuelle.
