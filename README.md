# Usman's Recipe Finder

A static, mobile-friendly website for finding recipes from the ingredients you have. It runs entirely in the browser and is ready for GitHub Pages. No account, database, API key, or build step is required.

## Features

- Enter or paste ingredients and save a pantry on your device.
- Filter the catalog by meal type and cuisine, or search by recipe name and ingredient.
- Sort the recipes with the most pantry matches first and show missing key ingredients.
- Open ingredients, steps, nutrition, and the creator's original source from each card.
- Nutrition labels preserve creator-provided values when available and mark estimates.

The catalog currently contains **55 completed recipe cards** from the source-verified working PDF. The 47 remaining saved links are not presented as complete recipes until their ingredients and methods are verified.

## Run locally

From this directory, run `python3 -m http.server 8000` and open `http://localhost:8000`. Opening `index.html` directly from a file URL may block the JSON request.

## Publish with GitHub Pages

1. Create a GitHub repository and upload the contents of this folder to its root.
2. In **Settings → Pages**, choose **Deploy from a branch**, select the default branch, and select **/(root)**.
3. GitHub will provide a link of the form `https://USERNAME.github.io/REPOSITORY/`.

The site uses relative paths, so it also works under a project subpath. If you update the recipe data, edit `recipes.json` and commit the file.

## Matching notes

Pantry matching is based on recognized ingredient names, not quantities or substitutions. The full ingredient list is always shown in the recipe detail. A high match score does not guarantee you have every required item or enough of it; check the full recipe before cooking. Culture labels follow the working collection and often say “inspired” to avoid presenting fusion recipes as traditional versions.
