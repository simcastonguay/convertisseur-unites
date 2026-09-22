# Remise — Laboratoire 2

- Compte GitHub de l'étudiant : **simcastonguay**.
- Dépôt public : https://github.com/simcastonguay/convertisseur-unites
- Travail individuel, avec l'assistance de Codex.

## Application

**Unité** est un convertisseur de longueurs et de volumes. Le frontend utilise React et Material UI ; le backend Node.js valide les demandes et effectue les calculs. Le gallon américain et le gallon impérial sont distingués explicitement.

## Les deux commits

1. `feat: creer le convertisseur Node React et Material UI` — première version fonctionnelle, commit `ca36762645d98d95aacc89a32cb10ac3ab4a878e`.
2. `feat: ajouter le bouton pour inverser les unites` — amélioration de l'étape 7, contenant aussi ce document.

Le tag `lab2-final` identifie la version de remise. Les deux commits sont consultables avec `git log --oneline lab2-final`.

## Modification de l'étape 7

Ajout d'un bouton entre les sélecteurs « De » et « Vers ». Il échange les unités sans modifier la valeur saisie. Il efface le résultat précédent pour éviter d'afficher un calcul qui ne correspond plus aux unités choisies. Le bouton est utilisable au clavier et porte un libellé accessible ; il reste disponible sur petit écran.

## Exécution

Node.js 22.12+ requis. Après clonage :

```sh
npm ci
npm run dev
```

Ouvrir http://127.0.0.1:5173. Sur le poste Windows du laboratoire, `./demarrer.ps1` sélectionne une version compatible de Node, notamment celle fournie avec Codex.

```sh
npm test
npm run build
npm start
```

La version compilée est accessible à http://127.0.0.1:3001.

## Vérifications

- Tests automatiques : conversions de référence, aller-retour de toutes les paires compatibles, zéro, décimales, valeurs négatives, validation et erreurs HTTP.
- Navigateur : 10 pieds donnent 3,048 m ; 1,5 L donne 1 500 mL ; une saisie vide est refusée.
- Compilation de production effectuée.
- Après modification : inversion de mètres vers pieds vérifiée (1 m = 3,280839895 pi), conservation de la valeur et effacement du résultat précédent vérifiés ; affichage à 390 pixels sans débordement horizontal.
- Les cinq tests automatiques passent également après l'ajout du bouton.

## Utilisation de Codex

L'application a été construite avec l'agent dans l'application Codex. Codex CLI `0.155.0-alpha.16` est installé et connecté au compte ChatGPT. Le terminal a été ouvert dans le dossier du projet, puis `/model` a été utilisé pour sélectionner `gpt-6-astra` avec le niveau de raisonnement `low` pour cette session. La création du code a eu lieu dans l'application Codex ; l'ouverture et la sélection du modèle ont été vérifiées séparément dans la CLI.

Pour refaire l'exercice : ouvrir un terminal dans le dossier, lancer `codex`, puis `/model`. Pour reprendre une session existante, utiliser `codex resume` ou `/resume` dans Codex. `/quit` ferme la CLI.

Références officielles : [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) et [commandes interactives](https://learn.chatgpt.com/docs/developer-commands?surface=cli).
