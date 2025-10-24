# Cahier de Charges - Plateforme CMS Paroisses Vatican News

**Version:** 1.0  
**Date:** 2025  
**Statut:** En cours de définition

---

## 1. Contexte et Objectifs

### 1.1 Contexte
Vatican News souhaite étendre sa plateforme numérique en permettant aux archidiocèses et paroisses de gérer leurs propres contenus de manière autonome. L'archidiocèse aura un rôle de supervision et de création de pages pour les paroisses affiliées.

### 1.2 Objectifs Principaux
- Permettre à l'archidiocèse de créer et superviser les pages des paroisses
- Permettre à chaque paroisse de gérer son propre contenu (articles, événements, etc.)
- Centraliser les contenus paroissiaux tout en maintenant une autonomie locale
- Offrir une expérience utilisateur cohérente avec le site Vatican News
- Faciliter l'engagement des fidèles avec la paroisse

---

## 2. Architecture Générale

### 2.1 Hiérarchie des Rôles

```
Vatican News (Administrateur Principal)
    ↓
Archidiocèse (Admin Principal)
    ├── Supervision des paroisses
    ├── Création des pages paroisses
    ├── Approbation des contenus (optionnel)
    └── Gestion des catégories globales
        ↓
    Paroisse 1 (Admin Paroisse)
    ├── Gestion du contenu
    ├── Articles
    ├── Événements
    └── Pages publiques
        ↓
    Paroisse 2 (Admin Paroisse)
    │   ...
    │
    Fidèles / Visiteurs (Publique en lecture seule)
    └── Accès aux pages paroisses
```

### 2.2 Structure des Entités

**Archidiocèse:**
- Un seul par région/diocèse
- Supervise plusieurs paroisses
- Accès complet aux admin panels

**Paroisse:**
- Affiliée à une archidiocèse
- Dispose de son propre admin panel
- Gère son contenu indépendamment

**Catégories:**
- Définissables par paroisse
- Types: Images, Vidéos, Articles, Audios, etc.
- Personnalisables par chaque paroisse

---

## 3. Fonctionnalités - Panel Admin Principal (Archidiocèse)

### 3.1 Gestion des Paroisses

#### 3.1.1 Créer une Paroisse
- Formulaire avec champs:
  - Nom de la paroisse
  - Adresse complète
  - Numéro de téléphone
  - Email de contact
  - Logo/Image de couverture
  - Description (biographie)
  - Horaires de messes (hebdomadaire)
  - Localisation GPS (latitude/longitude)
  
- Actions post-création:
  - Génération d'un sous-domaine ou URL dédiée (ex: `/paroisses/nom-paroisse`)
  - Création automatique d'un compte admin paroisse (invitation par email)
  - Affectation des permissions

#### 3.1.2 Lister/Modifier/Supprimer les Paroisses
- Vue tabellaire avec:
  - Nom, adresse, statut actif/inactif
  - Dernière mise à jour
  - Nombre d'articles publiés
  - Actions: Modifier, Voir, Supprimer, Accéder à l'admin paroisse (mode switch)
  - Filtres: par statut, date, recherche par nom

#### 3.1.3 Superviser les Contenus Paroissiaux
- Vue globale des articles/événements de toutes les paroisses
- Possibilité de masquer/modérer le contenu
- Fonction d'approbation (optionnel - selon politique de validation)
- Logs d'activité des admins paroisses

### 3.2 Gestion des Catégories Globales

#### 3.2.1 Créer une Catégorie
- Formulaire:
  - Nom de la catégorie (ex: "Méditations", "Événements", "Communiqués")
  - Description
  - Type de contenu associé (Images, Vidéos, Articles, Audios, Texte)
  - Icône/couleur de représentation
  - Portée: Globale (tous les paroisses) ou Paroisse spécifique
  
#### 3.2.2 Modifier/Supprimer des Catégories
- Édition avec historique des modifications
- Avertissement si suppression affecte des contenus existants
- Option de fusion avec une autre catégorie

### 3.3 Gestion des Articles (Niveau Archidiocèse)

- Créer des articles archidiocésains (articles de l'archidiocèse lui-même)
- Mêmes fonctionnalités que les paroisses (voir section 4.2)
- Affichage prioritaire sur le site

### 3.4 Utilisateurs et Permissions

- Créer/Gérer les comptes admin paroisses
- Assigner les rôles: Admin Paroisse, Contributeur Paroisse
- Réinitialiser les mots de passe
- Désactiver des comptes
- Journal d'accès (logs)

### 3.5 Paramètres Généraux

- Configuration du site:
  - Langue par défaut
  - Fuseau horaire
  - Règles de validation de contenu
  - Email de notification des modérateurs
- Gestion des domaines/URLs personnalisées pour les paroisses
- Configuration des intégrations (Facebook, YouTube, etc.)

---

## 4. Fonctionnalités - Panel Admin Paroisse

### 4.1 Tableau de Bord (Dashboard)

Vue d'ensemble avec:
- Informations de la paroisse (logo, nom, horaires de messes)
- Statistiques:
  - Nombre d'articles publiés
  - Nombre de visiteurs uniques
  - Dernier article publié
  - Événements à venir
- Raccourcis vers actions fréquentes
- Calendrier des événements du mois
- Fil d'actualité des derniers changements

### 4.2 Gestion des Catégories (Paroisse)

#### 4.2.1 Créer/Modifier une Catégorie
- Même fonctionnalité que l'archidiocèse
- Limité aux catégories de la paroisse
- Possibilité d'utiliser les catégories globales

#### 4.2.2 Supprimer une Catégorie
- Protection: impossible si contenu associé
- Option: fusionner avec une autre catégorie

### 4.3 Gestion des Articles

#### 4.3.1 Créer un Article
Formulaire complet avec:
- **Champs texte:**
  - Titre
  - Sous-titre/Description courte
  - Corps du texte (éditeur riche WYSIWYG)
  
- **Média et Contenu Enrichi:**
  - Image de couverture (upload)
  - Galerie d'images (multiple upload)
  - Intégration vidéos YouTube (URL ou embed code)
  - Intégration audios (upload fichier MP3/WAV + player intégré)
  - Intégration de liens externes (titre + URL)
  - Citation ou bloc de citation
  
- **Métadonnées:**
  - Tags/Mots-clés (multi-select, créer sur le vol)
  - Catégorie(s) (multi-select)
  - Auteur
  - Date de publication (ou programmée)
  - Visibilité: Publié, Brouillon, Programmé, Archivé
  
- **Avancé:**
  - SEO: Slug custom, Meta description, Meta keywords
  - Partage: Activer/désactiver partage sur réseaux sociaux
  - Commentaires: Activer/désactiver les commentaires
  - Relatifs: Articles connexes (suggestions automatiques)

#### 4.3.2 Lister/Modifier/Supprimer les Articles
- Vue tabellaire:
  - Titre, auteur, date de publication, statut, nombre de vues
  - Filtres: par statut, catégorie, date, auteur
  - Tri: date descendante par défaut
  - Actions: Éditer, Voir sur le site, Supprimer, Dupliquer, Partager
  
- Édition en ligne:
  - Conservation automatique (auto-save)
  - Historique des versions avec rollback
  - Notification de mise à jour archidiocèse

### 4.4 Gestion des Événements/Programmes

#### 4.4.1 Créer un Événement
- Formulaire:
  - Titre
  - Description
  - Date et heure (début/fin)
  - Lieu (adresse complète)
  - Organisateur
  - Image de couverture
  - Lien inscriptions (optionnel)
  - Catégorie (ex: "Messe", "Retraite", "Formation")
  - Récurrence (une fois, hebdomadaire, mensuel, etc.)

#### 4.4.2 Calendrier des Événements
- Vue calendrier mensuelle
- Drag-and-drop pour modifier les dates
- Color coding par catégorie
- Filtres par type
- Export (Google Calendar, iCal, PDF)

### 4.5 Gestion des Groupes/Mouvements

#### 4.5.1 Créer un Groupe
- Formulaire:
  - Nom du groupe
  - Description
  - Responsable(s)
  - Logo/Image
  - Horaires de réunion
  - Nombre de membres
  - Catégorie (Jeunesse, Chaîté, Formation, etc.)
  - Documents/ressources associés

#### 4.5.2 Lister/Modifier les Groupes
- Vue avec informations principales
- Édition des détails
- Activation/désactivation du groupe

### 4.6 Gestion des Demandes de Messe

#### 4.6.1 Configurer le Formulaire de Demande
- Champs du formulaire:
  - Nom du demandeur
  - Email
  - Téléphone
  - Intention de la messe (text area)
  - Date souhaitée
  - Type de messe (funéraire, action de grâces, intention spéciale, etc.)
  - Notes additionnelles

#### 4.6.2 Traiter les Demandes
- Liste des demandes reçues avec:
  - Statut: Nouvelle, En cours, Complétée, Refusée
  - Actions: Accepter, Rejeter, Archiver
  - Envoi de notifications au demandeur
  - Historique des demandes

### 4.7 Gestion des Dons

#### 4.7.1 Configuration des Dons
- Montants prédéfinis (optionnel)
- Montant personnalisé (optionnel)
- Mentions légales/politique de confidentialité
- Email de confirmation

#### 4.7.2 Intégration de Paiement
- Intégration Stripe, PayPal, ou autre (à définir)
- Gestion sécurisée des transactions
- Reçus de don automatisés
- Rapports mensuels/annuels des dons

#### 4.7.3 Lister les Dons
- Vue anonymisée (respect confidentialité)
- Filtres par date, montant
- Statistiques: total du mois, moyenne, tendances

### 4.8 Méditations

#### 4.8.1 Créer une Méditation
- Formulaire:
  - Titre
  - Lecture biblique (référence + extrait)
  - Texte de méditation (éditeur riche)
  - Auteur
  - Date de publication
  - Audio optionnel (enregistrement de la méditation)
  - Image d'illustration
  - Tags

#### 4.8.2 Lister/Modifier les Méditations
- Vue calendrier ou liste
- Édition rapide
- Duplication (pour créer une routine quotidienne/hebdomadaire)

### 4.9 Communiqués

#### 4.9.1 Créer un Communiqué
- Formulaire simplifié:
  - Titre
  - Contenu (éditeur riche)
  - Date de publication
  - Statut: Brouillon, Publié, Archivé
  - Destinataire (tous, contributeurs, comité, etc.)

#### 4.9.2 Lister/Modifier les Communiqués
- Liste antéchronologique
- Actions: Éditer, Supprimer, Archiver

### 4.10 Gestion du Profil Paroisse

#### 4.10.1 Informations Paroisse
- Logo
- Bannière/Image de couverture
- Nom complet
- Adresse, coordonnées GPS
- Numéros de téléphone
- Email principal
- Site web (optionnel)
- Réseaux sociaux (Facebook, Instagram, YouTube, etc.)

#### 4.10.2 Horaires de Messes
- Formulaire tabulaire:
  - Jour de la semaine
  - Heure(s) de messes
  - Type (messe en français, latin, enfants, etc.)
  - Lieu (église principale ou chapelle)
  - Notes (ex: "vacances", "spécial")

#### 4.10.3 Personnel Paroisse
- Liste des prêtres/diacres
- Coordonnées
- Responsabilités
- Photo (optionnel)

### 4.11 Gestion des Utilisateurs de la Paroisse

- Lister les collaborateurs (contributeurs, modérateurs)
- Assigner les rôles: Administrateur, Rédacteur, Modérateur
- Permissions granulaires (qui peut créer/modifier/publier)
- Réinitialiser les mots de passe
- Désactiver des comptes
- Historique d'activité par utilisateur

### 4.12 Paramètres et Intégrations

- Langue préférée de la paroisse
- Fuseau horaire
- Règles de validation de contenu
- Intégrations:
  - Google Analytics
  - Facebook Pixel
  - Flux RSS custom
  - Email newsletter (optionnel)
- Backup et restauration (accessible archidiocèse)

---

## 5. Structure des Pages Publiques - Paroisse

### 5.1 Page d'Accueil de la Paroisse

Sections (dans l'ordre):
1. **En-tête (Hero Section)**
   - Image/vidéo de couverture
   - Logo de la paroisse
   - Nom et baseline
   - Boutons d'appel à l'action: "Horaires de messes", "Nous contacter"

2. **Horaires de Messes (Section Interactive)**
   - Horaires de la semaine en cours
   - Bouton "Voir tout le calendrier"
   - Indication du lieu

3. **Nouveaux Articles (Latest News)**
   - Affichage des 6 derniers articles
   - Format: Carte avec image, titre, extrait, date, lien "Lire la suite"
   - Filtrage par catégorie
   - "Voir tous les articles"

4. **Événements à Venir**
   - Affichage des 3-4 prochains événements
   - Format: Carte avec date, titre, lieu
   - "Voir le calendrier complet"

5. **Groupes/Mouvements**
   - Affichage des groupes actifs
   - Format: Carte avec logo, nom, description courte, membres
   - Lien vers détails du groupe

6. **Méditations**
   - Affichage de la méditation du jour ou récente
   - Format: Titre, extrait, auteur
   - Player audio intégré
   - Lien "Toutes les méditations"

7. **Communiqués/Actualités Importantes**
   - Banneau ou section collapsible
   - Derniers communiqués
   - Format: Liste ou carrousel

8. **Appels à l'Action (CTA Section)**
   - Boutons côte à côte:
     - "Demander une messe"
     - "Faire un don"
     - "S'inscrire à la newsletter"
   - Design attrayant, cohérent avec Vatican News

9. **Pied de page (Footer)**
   - Coordonnées paroisse
   - Horaires d'ouverture du secrétariat
   - Liens réseaux sociaux
   - Flux RSS
   - Mentions légales, politique de confidentialité

### 5.2 Page Articles/Actualités

- Liste paginée des articles
- Barre de recherche
- Filtres: par catégorie, date, auteur
- Tri: date (défaut), popularité, titre
- Affichage: Thumbnail + titre + extrait + date

### 5.3 Page Article Individuelle

- Titre et sous-titre
- Image de couverture (full width)
- Métadonnées: Auteur, date, catégories, temps de lecture
- Corps du texte avec:
  - Mise en forme riche (gras, italique, listes, etc.)
  - Images intégrées
  - Vidéos YouTube (responsive)
  - Audios avec player
  - Liens clickables
  - Citations formatées
  
- Barre latérale ou section:
  - Articles connexes/similaires
  - Partage réseaux sociaux
  - Commentaires (si activés)
  
- Breadcrumbs de navigation

### 5.4 Page Événements/Calendrier

- Calendrier interactif (vue mois)
- Click sur date = détails
- Liste événements à côté du calendrier
- Filtres par type
- Affichage carte/liste toggle
- Détails événement:
  - Titre, description
  - Date/heure, lieu avec GPS
  - Organisateur
  - Lien inscriptions
  - Partage

### 5.5 Page Groupes/Mouvements

- Liste tous les groupes
- Cartes avec:
  - Logo/image
  - Nom
  - Description courte
  - Responsable
  - Horaires
  - Nombre de membres
  - Bouton "En savoir plus"
  
- Page détail groupe:
  - Informations complètes
  - Historique/description
  - Membres (liste optionnelle)
  - Calendrier de réunions
  - Ressources/documents

### 5.6 Page Méditations

- Affichage méditation du jour en évidence
- Galerie/liste des méditations récentes
- Filtres: par date, auteur
- Affichage:
  - Titre
  - Lecture biblique
  - Texte
  - Player audio
  - Auteur et date

### 5.7 Page Demande de Messe

- Formulaire centré
- Champs obligatoires bien indiqués
- Texte d'aide ("Qu'est-ce qu'une messe d'intention ?")
- Message de confirmation après envoi
- Possibilité de contacter par téléphone (affichage numéro)

### 5.8 Page Dons

- Présentation du projet/besoin
- Options de montants prédéfinis
- Montant personnalisé
- Bouton paiement sécurisé
- Logos des moyens de paiement
- Message post-don avec reçu
- Transparence: mention destination des dons

### 5.9 Page À Propos / Qui Sommes-Nous

- Historique de la paroisse
- Équipe pastorale (photos, noms, rôles)
- Mission et valeurs
- Localisation et accès

---

## 6. Caractéristiques Transversales

### 6.1 Responsive Design
- Design mobile-first
- Breakpoints: 320px, 768px, 1024px, 1440px
- Tous les contenus accessibles sur mobile

### 6.2 Accessibilité
- Respect WCAG 2.1 AA
- Contraste suffisant des couleurs
- Alt text sur toutes les images
- Navigation au clavier
- Lecteur d'écran compatible

### 6.3 Performance
- Optimisation images (lazy loading, WebP)
- Compression CSS/JS
- Caching stratégique
- Time to interactive < 3s
- Pagination pour les longues listes

### 6.4 SEO
- Métadonnées (title, description, keywords)
- Sitemap XML
- Robots.txt
- URLs amicales (slugs)
- Structure hSchema / JSON-LD
- Open Graph pour réseaux sociaux

### 6.5 Sécurité
- HTTPS obligatoire
- Protection CSRF
- Validation serveur tous les inputs
- Sanitization du contenu utilisateur
- Rate limiting sur formulaires
- Backup réguliers (archidiocèse)

### 6.6 Analytics et Monitoring
- Suivi des pages visitées
- Suivi des articles les plus lus
- Suivi conversions (dons, demandes messe)
- Rapports mensuels archidiocèse
- Alertes erreurs/bugs

---

## 7. Flux de Travail Contenu

### 7.1 Création Article (Exemple)

1. Admin paroisse crée article en brouillon
2. Auto-save à chaque changement
3. Prévisualisation avant publication
4. Publication (immédiate ou programmée)
5. Notification archidiocèse (optionnel)
6. Archidiocèse peut masquer si problème
7. Admin reçoit notification masquage
8. Modification et republication

### 7.2 Approbation (Optionnel)

Si politique de modération activée:
1. Admin paroisse crée/modifie contenu
2. Contenu en attente d'approbation (statut = Pending)
3. Archidiocèse reçoit notification
4. Archidiocèse approuve ou rejette avec commentaires
5. Admin paroisse reçoit notification
6. Si approuvé: publié automatiquement
7. Si rejeté: retour à brouillon avec raison

---

## 8. Considérations Techniques

### 8.1 Stack Recommandé

**Frontend:**
- React (ou Vue.js)
- TypeScript pour typage fort
- Tailwind CSS pour styles
- Rich Text Editor: TipTap ou Draft.js
- Calendrier: React Calendar ou FullCalendar
- Charts: Recharts ou Chart.js

**Backend:**
- Node.js + Express (ou Python FastAPI)
- Base de données: PostgreSQL
- Stockage fichiers: AWS S3, Cloudinary ou similaire
- Authentification: JWT + sessions sécurisées
- Queue jobs: Bull (Node) ou Celery (Python) pour emails asynchrones

**Intégrations:**
- Stripe / PayPal pour paiements
- SendGrid / Mailgun pour emails
- Sentry pour monitoring erreurs
- Google Maps API pour géolocalisation

### 8.2 Architecture Recommandée

**Monorepo possible:**
```
project/
├── apps/
│   ├── admin-archdiocese/    (React)
│   ├── admin-paroisse/       (React)
│   └── website-public/       (React/Next.js)
├── packages/
│   ├── api/                  (Express/FastAPI)
│   ├── shared/               (Types TypeScript, Utils)
│   └── database/             (Migrations, Seeds)
└── docs/
    └── schema.sql
```

### 8.3 Base de Données (Schéma Simplifié)

Entités principales:
- `users` (id, email, password, role, archdiocese_id)
- `archdioceses` (id, name, address, phone, email)
- `parishes` (id, name, address, phone, email, archdiocese_id)
- `categories` (id, name, type, parish_id ou NULL pour global)
- `articles` (id, title, content, author_id, parish_id, category_id, created_at, published_at, status)
- `articles_tags` (article_id, tag_id)
- `events` (id, title, description, date_start, date_end, parish_id)
- `groups` (id, name, description, parish_id, leader_id)
- `mass_requests` (id, name, email, intention, date_requested, parish_id, status)
- `donations` (id, amount, donor_email, parish_id, date, transaction_id, status)
- `meditations` (id, title, content, biblical_reference, audio_url, parish_id)
- `media` (id, type, url, parish_id, article_id ou autre)

### 8.4 Authentification & Autorisation

- JWT pour API
- Sessions sécurisées (HttpOnly cookies)
- Middleware d'authentification
- Guards d'autorisation par rôle:
  - Admin Archdiocese: accès complet
  - Admin Paroisse: accès sa paroisse uniquement
  - Contributeur: création articles uniquement
  - Visiteur: lecture seule

### 8.5 Email Workflow

- Confirmation création compte
- Notification article approuvé/rejeté
- Reçu don
- Confirmation demande messe
- Rappel messe planifiée (jour avant)
- Newsletter optionnelle

### 8.6 Déploiement

- Docker + Docker Compose local
- CI/CD: GitHub Actions / GitLab CI
- Staging environment de test
- Versioning API
- Zero-downtime deployment

---

## 9. Suggestions d'Améliorations

### 9.1 Phase 1 (MVP)
- Panel admin archdiocèse: créer/modifier paroisses
- Panel admin paroisse: gérer articles, événements, horaires
- Pages publiques: accueil, articles, événements
- Formulaires: demande messe et dons basiques

### 9.2 Phase 2
- Système de commentaires modérés
- Newsletter abonnés
- Intégration réseaux sociaux automatisée
- Méditations quotidiennes
- Analytics avancées

### 9.3 Phase 3
- Mobile app native (iOS/Android)
- Notifications push
- Groupes privés (accès restreint)
- E-learning / catéchèse
- Intégration livestream messes
- Gestion bénévoles/équipes

### 9.4 Améliorations UX/Design

**Pour l'Admin:**
- Dark mode optionnel
- Dashboard personnalisable (widgets)
- Undo/Redo global
- Clavier raccourcis
- Aide contextuelle (tooltips)

**Pour le Public:**
- Recherche globale + filters avancés
- Favoris/sauvegarde articles
- Partage vers Pocket, Instapaper
- Notification changements paroisses (optins)
- Widget intégrable pour externes

### 9.5 Intégrations Futures

- Calendrier Google / Outlook (sync)
- Agenda paroissial parstagé publiquement
- DirectIntégration Live (messes transmises)
- API publique (pour externes)
- Webhooks (pour partenaires)
- Zapier / Make.com (automations)

---

## 10. Plan de Mise en Place

### Phase 0: Préparation (2-3 semaines)
- [ ] Validation cahier de charges avec stakeholders
- [ ] Design system / Maquettes
- [ ] Configuration infrastructure (serveurs, BD, stockage)
- [ ] Mise en place CI/CD
- [ ] Définition API endpoints

### Phase 1: MVP (4-6 semaines)
- [ ] Backend API (CRUD entités principales)
- [ ] Admin archdiocèse (paroisse, catégories)
- [ ] Admin paroisse (articles, événements)
- [ ] Pages publiques basiques
- [ ] Formulaires dons/messes
- [ ] Tests unitaires & intégration
- [ ] Documentation API

### Phase 2: Améliorations (2-3 semaines)
- [ ] Système approuvation contenu
- [ ] Méditations
- [ ] Groupes/mouvements
- [ ] Commentaires
- [ ] Analytics dashboard
- [ ] Optimisations performance

### Phase 3: Déploiement & Formation (2 semaines)
- [ ] Déploiement production
- [ ] Formation utilisateurs (archdiocèse + paroisses)
- [ ] Support post-lancement
- [ ] Migration données (si besoin)
- [ ] Monitoring et alertes

---

## 11. Ressources Requises

### 11.1 Équipe
- 1 Product Manager
- 2 Full Stack Developers
- 1 Designer UI/UX
- 1 QA Engineer
- 1 DevOps Engineer (part-time)

### 11.2 Coûts Estimés (à affiner)
- Infrastructure hosting: 100-200$/mois
- Fichiers (S3 / CDN): 50-100$/mois
- Paiements (Stripe): 2.9% + $0.30 / transaction
- Monitoring (Sentry): 29$/mois
- Emails (SendGrid): 10-20$/mois
- Domaines/SSL: 10-20$/mois

### 11.3 Risques et Mitigation

| Risque | Probabilité | Impact | Mitigation |
|--------|-----------|--------|-----------|
| Adoption faible paroisses | Moyen | Élevé | Formation complète, UX simple |
| Fuite données sensibles | Faible | Élevé | Audit sécurité, chiffrement |
| Surcharge serveurs | Moyen | Moyen | Load testing, auto-scaling |
| Churn contenu modéré | Moyen | Moyen | Support utilisateur actif |
| Délai Phase 1 | Moyen | Moyen | Agile, sprints 2 semaines |

---

## 12. Métriques de Succès

- **Adoption:** X paroisses inscrites en 3 mois
- **Contenu:** Y articles publiés / mois / paroisse
- **Engagement:** Z visiteurs uniques / mois
- **Dons:** Augmentation revenus dons de 15%
- **Demandes messes:** Digitalisation 80% des demandes
- **Uptime:** 99.5% disponibilité
- **Satisfaction:** Score NPS > 8/10

---

## Annexes

### A. Glossaire
- **Paroisse:** Communauté religieuse locale dirigée par un prêtre
- **Archdiocèse:** Division administrative église (supervise paroisses)
- **CMS:** Content Management System (gestion contenus)
- **WYSIWYG:** What You See Is What You Get (éditeur riche)
- **SEO:** Search Engine Optimization (optimisation moteurs recherche)

### B. Références
- Design Vatican News: https://www.vaticannews.va/
- Inspiration CMS: WordPress, Contentful, Webflow
- Accessibilité: https://www.w3.org/WAI/WCAG21/quickref/

### C. Historique des versions
| Version | Date | Auteur | Changements |
|---------|------|--------|------------|
| 1.0 | 2025 | [Auteur] | Création initiale |

---

**Document confidentiel - Propriété de Vatican News**
