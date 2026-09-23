# Solution de remplacement : Render Free

Décision : remplacer Azure à la demande de l’équipe, à cause des restrictions rencontrées. Render est un hébergement géré : il ne remplit pas les exigences de VM Linux Azure, de configuration NGINX et de certificat Let's Encrypt administré par l’équipe. Faire accepter cette adaptation par l’enseignant. Ne pas revendiquer ces tâches comme réalisées.

## Déploiement

1. Publier les modifications de `server/index.js`, `server/app.js` et `render.yaml` dans le dépôt GitHub.
2. Se connecter à https://dashboard.render.com/ puis créer un Blueprint depuis ce dépôt, avec `render.yaml`.
3. Vérifier que le service utilise le plan **Free**. Ne pas ajouter de moyen de paiement ni sélectionner un plan payant.
4. Attendre la réussite des tests, de la compilation et du déploiement. Copier l’URL HTTPS fournie par Render dans la remise.
5. Vérifier les trois catégories de conversion, les erreurs de saisie et `/api/health`. Consulter les journaux HTTP.

Une seule application Node sert l’interface React compilée et l’API. Aucun service de base de données n’est nécessaire. `HOST=0.0.0.0` permet à Render de joindre le serveur; le port est fourni par la plateforme.

Le service se met en veille après 15 minutes sans trafic; son réveil prend environ une minute. Ouvrir l’application avant la démonstration. Sans moyen de paiement, les dépassements des quotas gratuits entraînent une suspension des services ou des builds plutôt qu’une facturation.

Le déploiement natif Render ne constitue pas, à lui seul, le pipeline GitHub Actions demandé dans les consignes. Ce point reste à configurer ou à faire accepter comme adaptation.

État : configuration locale préparée, déploiement en ligne non effectué.

Source : https://render.com/docs/free
