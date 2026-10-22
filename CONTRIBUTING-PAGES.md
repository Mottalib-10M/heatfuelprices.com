# Écrire ou étoffer une page de us-heating-oil-propane

Notice pour qui écrit les pages. À lire en entier avant d'écrire, avec `~/Documents/GitHub/RECETTE-SITE.md`.

**Le site** : le prix hebdomadaire du fioul domestique et du propane aux États-Unis, État par État, d'après l'enquête
fédérale de l'EIA (SHOPP, octobre à mars), avec le coût d'un remplissage, le budget d'un hiver, l'examen d'une offre à
prix fixe, les jours de cuve restants et le plafond de revenus LIHEAP. **Anglais américain seul**, sous `/en/`.
Éditeur : la société **Radif Partners** (jamais un nom de personne). Ni « EIA » ni « LIHEAP » dans le nom du site ni
dans le logo ; le site ne se présente jamais comme l'administration et n'est affilié à personne.

**La phrase de valeur ajoutée** (accueil, À propos, rapport SERP) : `VALUE` dans `src/content/home.ts`. Rapport SERP :
`~/Documents/GitHub/reports/us-heating-oil-propane-serp-2026-10-22.md`.

## Interdits

- Aucun lien vers un distributeur, un courtier, un site de devis ; aucun conseil personnalisé (« you should lock ») ;
  aucune prévision maison : la seule prévision publiée est celle de l'EIA (Winter Fuels Outlook), citée comme telle.
- Ne jamais lier ni copier un site du portefeuille (`~/Documents/GitHub/_trame/domaines-ovh.txt`).
- **Un chiffre incertain ne se publie pas.** Tout chiffre vient du kit (`K.…`, `src/lib/kit.ts`), jamais tapé à la main :
  les prix changent chaque mercredi. Les mots de sens (« above », « cheaper », « up ») se calculent avec `K.dir(...)`,
  les rangs avec `K.place`, `K.rankOf`, `K.ord`. Pas de « le plus cher » écrit en dur.
- Pas d'affirmation hors des données (géographie, habitudes locales, pratiques des distributeurs, causes d'un écart) sans
  source officielle liée par `h.ext(url, texte)` ou `h.src(clé, texte)`.
- Ni tiret cadratin ni demi-cadratin, ni les tournures listées dans `tests/pages.test.ts` (BANNED).

## D'où viennent les chiffres

| Donnée | Source | Fichier |
|---|---|---|
| Prix résidentiels et de gros hebdomadaires, fioul (21 États) et propane (38 États), moyennes PADD et U.S. | EIA, Heating Oil and Propane Update (SHOPP), 4 classeurs .xls | `src/data/eia.json` → `latest.json`, `series.json` |
| Prix régionaux de l'État de New York | NYSERDA, data.ny.gov (fioul et propane, par région) | `src/data/ny.json` |
| Prévision de l'hiver, gallons et dépense par foyer, degrés-jours, foyers chauffés | EIA, Winter Fuels Outlook, table WF01 (STEO d'octobre 2026) | `src/data/winter.json` |
| Degrés-jours normaux par mois (pondérés par la population) | NOAA CPC, normales 1981-2010 | `src/data/states.json` (`hdd`) |
| Logements par combustible principal | Census Bureau, ACS 2024, table B25040 | `states.json` (`acs`) |
| Plafond LIHEAP : max(150 % du seuil de pauvreté, 60 % du revenu médian de l'État) | 42 U.S.C. 8624(b)(2)(B) ; ASPE, poverty guidelines 2026 ; ACF, LIHEAP SMI FY2027 (Att. 4) | `params-2026.json`, `states.json` (`smi`), `liheap-other-states.json` |
| Pouvoir calorifique, rendements, remplissage du propane | EIA (Btu) ; ENERGY STAR (AFUE 87 % fioul, 90 % gaz) ; 29 CFR 1910.110 table H-27 | `params-2026.json` |

## Mettre les données à jour

    pip install xlrd
    python3 scripts/update-data.py              # relevé EIA + NYSERDA, puis latest.json et series.json
    python3 scripts/build-states.py             # seulement si data-src/ change (NOAA, ACS, SMI, WFO)

Le workflow `.github/workflows/deploy.yml` le fait seul le mercredi à 19:30 UTC et le jeudi à 13:30 UTC. Si une
source ne répond pas, l'ancien fichier est gardé (sortie 1) et la date du relevé reste affichée. Chaque année :
nouveau Winter Fuels Outlook (octobre), poverty guidelines (janvier), SMI LIHEAP (été), ACS (septembre).

## Les fichiers d'une page (une page = un fichier)

| Page | Fichier | Route |
|---|---|---|
| Sujet + calculateur | `src/content/guides/<id>.ts` (`defineGuide`) | `/en/<slug>/` |
| État avec fioul | `src/content/states/<slug>.ts` (`defineState`) | `/en/heating-oil-prices/<slug>/` |
| État propane seul | idem | `/en/propane-prices/<slug>/` |
| Accueil | `src/content/home.ts` | `/en/` |

Pages prévues : `src/lib/planned.ts`. Modèles (copier la structure, jamais les phrases) :
`src/content/guides/lock-in-or-wait.ts`, `src/content/states/connecticut.ts` (fioul) et `src/content/states/iowa.ts`
(propane surtout). Le gabarit affiche seul : H1, `intro`, l'outil de prix, le chapeau replié (`resume`), les courbes de
la saison, le corps (`body`), les tableaux des saisons, la FAQ, les pages liées, les sources.

### Champs

| Champ | Règle |
|---|---|
| `title` | 50 à 60 caractères, terme-clé en tête, « 2026 », unique ; jamais en tête une question ni « How » |
| `description` | 150 à 160 caractères, unique |
| `resume` | un seul paragraphe de 120 mots ou plus : la réponse directe, chiffrée |
| `body` | guides 380 mots de prose au moins (tableaux exclus), États 280 ; au moins un `h.mini(kind, { t, p, d, c })` |
| `faqs` | 3 à 8 questions (États : 3, avec le nom de l'État), réponses de 40 à 90 mots, question unique sur le site |
| `related` | 3 à 6 identifiants (`id` de guide ou `state:<slug>` d'un État du survey) |
| `sources` | clés de `params-2026.json > sources` (guides) |

Outils (`src/lib/tool-specs.ts`) : `price`, `fill`, `budget`, `lockin`, `days`, `liheap`, `compare`, `ny`, `history`,
`forecast`.

## Contrôler

    PAGE_FILES=<id>,state:<slug> npx vitest run tests/pages.test.ts
    python3 scripts/sim-pages.py --seuil 26       # aucune paire au-dessus de 26 %

Puis, une seule fois et jamais en parallèle : `npm run check` et les contrôles de la recette.
