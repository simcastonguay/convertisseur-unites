# Unité — Convertisseur du quotidien

Application du laboratoire 2 : backend Node.js, frontend React et composants Material UI. Créée avec l'assistance de Codex, dans le cadre d'un travail individuel.

## Prérequis et installation

- Node.js 22.12 ou plus récent (Node.js 24 recommandé), npm et Git.
- Aucun compte, aucune clé API et aucune base de données ne sont nécessaires.

Depuis le dossier du projet :

```sh
npm ci
npm run dev
```

Sur le poste Windows utilisé pour ce laboratoire, `node` pointe vers une ancienne version. Le lanceur `./demarrer.ps1` choisit automatiquement Node.js 22.12+ installé sur le système ou Node 24 fourni avec Codex, puis démarre l'application. Il accepte aussi `-Action test`, `-Action build`, `-Action start` et `-Action install`. Le dépôt reste utilisable sans Codex sur tout poste disposant de Node.js 22.12+.

Ouvrir http://127.0.0.1:5173. Le serveur API utilise le port 3001. `Ctrl+C` arrête les deux services.

Pour exécuter la version compilée :

```sh
npm run build
npm start
```

Ouvrir http://127.0.0.1:3001. Pour changer ce port en PowerShell : `$env:PORT = '3002'; npm start`.

## Fonctionnalités

- Longueurs : mètres, kilomètres, centimètres, pieds, pouces et milles.
- Volumes : litres, millilitres, gallons américains et gallons impériaux.
- Températures : Celsius, Fahrenheit et kelvins, avec prise en compte du décalage et rejet des valeurs sous le zéro absolu (laboratoire 3).
- Historique local des six dernières conversions réussies, conservé après rechargement, avec reprise et effacement. Si le navigateur bloque le stockage, l'historique reste utilisable en mémoire pour la session (laboratoire 3).
- Saisie décimale avec virgule ou point, résultat et facteur de conversion.
- Bouton « Inverser les unités » : échange les deux unités et efface le résultat précédent, tout en conservant la valeur saisie (amélioration du laboratoire 2, étape 7).
- Validation dans le navigateur et sur le serveur ; les erreurs sont affichées en français.
- Interface adaptée aux petits écrans ; navigation au clavier et résultat annoncé aux lecteurs d'écran.

Les valeurs négatives sont acceptées pour les calculs de différences. L'affichage est arrondi à 10 chiffres significatifs ; les calculs utilisent les nombres JavaScript en double précision. Le gallon américain vaut 3,785411784 L et le gallon impérial 4,54609 L.

## Architecture

- `server/conversions.js` : catalogue et calculs. Le calcul passe par l'unité de référence de la catégorie.
- `server/app.js` : API HTTP et service des fichiers compilés ; `server/index.js` : démarrage.
- `src/App.jsx` : interface React avec les composants Material UI.
- `src/History.jsx` et `src/history.js` : composant réutilisable et persistance de l'historique. Les données restent dans le navigateur ; elles ne sont pas enregistrées sur le serveur.
- `scripts/dev.js` : lancement du backend et de Vite avec une seule commande.
- `test/` : tests du calcul et de l'API avec le test runner de Node.js.

Routes : `GET /api/health`, `GET /api/units`, `POST /api/convert`.

Exemple de requête JSON : `{"value": 10, "from": "ft", "to": "m"}`. Le résultat attendu est `3.048`.

## Vérification

```sh
npm test
npm run build
```

Dans le navigateur : convertir 10 pieds en mètres (3,048 m), 1 gallon US en litres (3,785411784 L), 1,5 L en mL (1 500 mL), puis vérifier qu'un champ vide et du texte sont refusés. Changer une unité doit effacer l'ancien résultat.

## Git et utilisation de l'IA

Le laboratoire 2 sera identifié par le tag `lab2-final`. Les évolutions du laboratoire 3 seront faites dans des branches dédiées. Un seul auteur réel est utilisé ; aucune revue par un deuxième étudiant n'est revendiquée.

Codex aide à produire et vérifier le code. L'étudiant doit pouvoir expliquer la requête HTTP, la formule de conversion, le rôle des composants React et les commandes Git.
