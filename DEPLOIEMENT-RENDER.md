# Déploiement sur Render

Azure n'a pas pu être utilisé (problème de paiement, aucune VM disponible à petit prix). L'application est donc hébergée sur Render, un hébergement géré (PaaS) : il n'y a pas de VM Linux administrée par l'équipe, ni de NGINX ou de certificat Let's Encrypt configurés à la main. Render fournit le HTTPS, le certificat et la redirection HTTP vers HTTPS.

- URL : https://convertisseur-unites.onrender.com/
- Service : web service Node (Node.js 24), plan **Free**, configuré par `render.yaml` (Blueprint).
- Build : `npm ci --include=dev && npm run check` ; démarrage : `npm start` ; santé : `/api/health`.
- Variables : `NODE_VERSION=24`, `HOST=0.0.0.0` ; `PORT` est fourni par Render.
- Aucune base de données ni aucun secret applicatif.

## Pipeline GitHub Actions

Le déploiement automatique natif de Render est désactivé (`autoDeployTrigger: "off"`). C'est le workflow `.github/workflows/ci-cd.yml` qui déploie, seulement si les tests et la compilation réussissent.

Configuration unique :

1. Render : avatar → **Account Settings** → **API Keys** → **Create API Key** ; copier la clé.
2. Render : ouvrir le service ; son identifiant `srv-...` est dans l'URL du tableau de bord.
3. GitHub : dépôt → **Settings** → **Secrets and variables** → **Actions** → secrets `RENDER_API_KEY` (la clé) et `RENDER_SERVICE_ID` (l'identifiant `srv-...`).
4. Si le service n'a pas été créé par Blueprint, régler **Auto-Deploy** à **Off** dans les paramètres Render.

Le Deploy Hook de Render a d'abord été utilisé, mais il répondait « Internal Server Error » ; l'API Render déploie le commit exact du push et affiche sa réponse dans les journaux.

Le résultat de chaque déploiement est visible dans l'onglet **Actions** du dépôt : l'étape « Attendre la nouvelle version en ligne » compare le commit retourné par `/api/health` à celui du push.

## Limites du plan gratuit

Le service se met en veille après 15 minutes sans trafic ; son réveil prend environ une minute. Ouvrir l'application avant une démonstration. Sans moyen de paiement, un dépassement des quotas suspend le service au lieu d'être facturé.

Source : https://render.com/docs/free
