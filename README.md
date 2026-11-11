# Quiz Communication organisationnelle — Vercel + Supabase

## Contenu
- `index.html` : page du quiz
- `style.css` : design responsive pour téléphone et ordinateur
- `app.js` : chronomètre, navigation et interface
- `api/answer.js` : correction côté serveur et attribution du bonus
- `api/leaderboard.js` : classement général
- `supabase.sql` : tables et fonction SQL nécessaires

## 1. Créer la base Supabase
1. Crée un projet sur https://supabase.com/.
2. Ouvre **SQL Editor**, colle tout le contenu de `supabase.sql`, puis clique sur **Run**.
3. Dans **Project Settings > API**, copie le **Project URL** et la clé **service_role** (secret). Ne partage jamais cette clé et ne la mets jamais dans `app.js` ou dans un fichier HTML.

## 2. Déployer sur Vercel
1. Mets tous les fichiers de ce dossier dans un dépôt GitHub.
2. Dans Vercel, clique sur **Add New > Project** et importe le dépôt.
3. Dans **Settings > Environment Variables**, ajoute :
   - `SUPABASE_URL` = Project URL de Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` = clé `service_role` (secret)
4. Redéploie le projet après avoir ajouté les variables.

Aucun framework ou commande de build n'est nécessaire.

## 3. QR code
Après le déploiement, copie l'adresse publique Vercel (ex. `https://ton-quiz.vercel.app`) et transforme cette adresse en QR code. Les étudiants scannent le code et ouvrent le quiz dans leur navigateur.

## Règles de notation
- 1 point par bonne réponse (maximum 10).
- +1 point bonus au premier participant dont la bonne réponse est enregistrée sur chaque question (maximum 10 bonus).
- Note affichée sur 20.
- Le classement est partagé entre tous les participants.

## Limite importante sur la rapidité
Le bonus est attribué au premier enregistrement correct reçu par le serveur pour chaque question. Le chronomètre de 10 secondes est géré dans le navigateur : pour un concours à enjeux élevés, il faudrait ajouter une heure de départ contrôlée par le serveur et une synchronisation de début de question. Le navigateur ne peut pas garantir à lui seul qu'un étudiant n'a pas modifié son horloge ou son code.

## Test local
Pour tester les pages seules, ouvre `index.html`, mais l'enregistrement et le classement nécessitent les fonctions API déployées sur Vercel et la base Supabase configurée.
