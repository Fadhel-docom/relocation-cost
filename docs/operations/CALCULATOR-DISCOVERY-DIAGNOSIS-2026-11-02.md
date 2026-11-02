# Diagnostic read-only: découverte de /calculator/ (Google « URL is unknown », Bing fiche vide)
**Date:** 2026-11-02 (UTC) · **Auteur:** Claude (premier) · **Portée:** lecture seule. Aucune modification du site, aucune demande d'indexation, aucun envoi d'URL, aucun réglage de compte.

## Verdict
**Cause établie: aucune. Aucun défaut de dépôt prouvé, donc aucune PR de correction.** Les preuves pointent vers un retard ou une limite côté Google/Bing, pas vers le code. Le même état apparaît sur des pages qui ne partagent pas le problème supposé.

## Preuves (toutes lues le 2026-11-02)

### Code (main = 668216b ; Build et Verify réussis sur ce commit)
- `/calculator/` utilise le gabarit `Layout.astro` sans `noindex` (seuls 404 et `/contact/` sans e-mail peuvent l'avoir).
- Canonical = chemin seul + `Astro.site`, donc `https://relocation-cost-psi.vercel.app/calculator/`.
- `robots.txt`: `Allow: /` + ligne `Sitemap:` vers sitemap-index.xml. Aucun en-tête personnalisé dans `vercel.json` (seulement `trailingSlash` et la redirection `/sitemap.xml` → `/sitemap-index.xml`).
- `tools/verify-seo.mjs` exige `/calculator/` dans l'ensemble des 21 URL statiques du sitemap **et** que chaque canonical construit soit présent dans le sitemap; le CI est vert, donc `/calculator/` est dans sitemap-0.xml à chaque build.
- Lien interne: l'en-tête de chaque page contient `<a href="/calculator/">Calculator</a>` (lien nu, sans paramètres), plus 23 autres liens `href="/calculator/` dans `src`.

### Google Search Console (lecture API)
- Sitemaps listés: seulement 2 entrées, `sitemap-index.xml` (téléchargé 2026-11-01 03:00 UTC) et `sitemap-0.xml` (téléchargé 2026-11-01 15:14 UTC); chacune 115 soumises, 0 erreur, 0 avertissement, `isPending=false`. Le compteur « indexed = 0 » est déjà jugé non fiable (jour 29/10).
- URL Inspection: `/calculator/` = « URL is unknown to Google » (NEUTRAL, tout « unspecified »).
- **Contrôles:** `/guides/diy-vs-movers/` = aussi « URL is unknown to Google » (alors que le rapport du 09/10 la listait « Détectée, non indexée »); `/moving-cost/ca-to-tx/` = indexée (PASS, dernière exploration 2026-10-19) avec **`referringUrls = [/calculator/]`**: Google a donc vu `/calculator/` comme page d'origine d'un lien, ce qui contredit « inconnue » comme preuve de non-découverte.
- **Lecture prudente:** « unknown » dans l'API d'inspection décrit l'état dans l'index de Google pour cette URL, pas un échec d'exploration; avec ~22 pages indexées sur 112, plusieurs pages saines portent le même état.

### Bing Webmaster (lecture API)
- `/calculator/`: `http_status 0`, `document_size 0`, dates `0001-01-01`, 0 ancre, 0 enfant.
- **Contrôles:** `/moving-cost/ca-to-tx/` renvoie exactement la même fiche vide; la page d'accueil, explorée le 2026-10-03, renvoie quand même `http_status 0` et `document_size 0` (seules les dates sont renseignées). Une fiche à zéros n'est donc pas une preuve d'erreur HTTP et ne distingue pas `/calculator/` des autres pages.
- Statistiques d'exploration (lecture de ChatGPT, non relues): 41 pages dans l'index au 2026-10-29.

## Non vérifié (limites)
- **Production en direct:** mon proxy refuse `relocation-cost-psi.vercel.app` (403 sur CONNECT). Je n'ai donc ni les en-têtes réels (statut, `X-Robots-Tag`, redirections), ni le XML servi, ni le HTML rendu. Les affirmations sur la production viennent du code, du CI (Verify live site, verify-seo) et de GSC/Bing.
- **Les quatre anciens « flux vides »** signalés par ChatGPT: l'API GSC ne liste que les 2 sitemaps ci-dessus; aucune entrée par chemin de page n'y figure. Si elles existent, elles sont dans l'interface (Sitemaps / flux) et non visibles par mes outils. À vérifier par le propriétaire (capture) ou par ChatGPT si son accès les expose. Rien n'a été supprimé ni renvoyé.
- Cause réelle du « unknown »: non établie. Hypothèse consistante avec les données: site neuf (~4 semaines), très peu de liens externes, seulement une partie des URL conservée dans l'index.

## Décision
- Pas de PR, pas de changement de code, pas de demande d'indexation répétée. Porte de mesure GSC du 2026-11-05 inchangée.
- Seule action utile aux données (sans code): relire l'inspection de `/calculator/` après le 05/11; si elle passe à « Détectée / Explorée », le sujet est clos.
