Thème: objectifs et mode d’emploi

Objectif
- Fournir une configuration de "thème" centrale et un mécanisme de backup pour permettre la migration vers un frontend React tout en conservant exactement le design.
- Permettre de changer les liens (ex: basculer vers archidiocesedecotonou.com-style slugs) sans toucher aux classes CSS ni au DOM structurel.

Contenu de ce dossier
- config.json : manifest central du thème (menu, routes, icônes, options). À éditer pour changer les liens.
- README.md : (ce fichier) instructions d’utilisation.
- ../scripts/backup_frontend.sh : script pour sauvegarder le répertoire www.vaticannews.va

Principes d’utilisation
1. Backup: exécuter scripts/backup_frontend.sh avant toute modification.
2. Configuration menu/liens: modifier theme/config.json. Le frontend (React ou SSR) lira ce fichier et génèrera le menu en injectant les mêmes classes/attributs HTML existants pour garantir rendu identique.
3. Composants Frontend: créer des composants qui consomment theme/config.json et rendent la même structure DOM (mêmes classes, mêmes attributs aria, mêmes ordres d’éléments).
4. Routes/Redirects: backend Express devra exposer un endpoint /api/theme qui renvoie config.json. Lors du déploiement, mettez en place des redirections côté serveur pour les slugs modifiés.

Checklist minimale pour l’équipe
- [ ] Lancer backup
- [ ] Copier theme/config.json dans le frontend (public/ ou /src/config)
- [ ] Créer composant Header qui lit le config et génère <ul class="mainMenu"> avec les mêmes classes
- [ ] Tester visuel via pixeldiff

Remarques
- NE PAS renommer les classes CSS ou modifier les media queries; appliquez le config uniquement pour les href et labels.
- Pour le rendu pixel-perfect, conservez tous les fichiers CSS originaux dans public/etc/designs/... et les importer globalement.

Si vous voulez, je peux: (a) créer le composant React Header scaffold, (b) générer le endpoint Express /api/theme, (c) ajouter le script de backup. Dites ce que vous voulez que je crée maintenant.
