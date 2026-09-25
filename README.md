# Usman's Recipe Finder

A static, mobile-friendly website for finding recipes from the ingredients you have. It runs entirely in the browser and is ready for GitHub Pages. No account, database, API key, or build step is required.

## Features

- Enter or paste ingredients and save a pantry on your device.
- Filter the catalog by meal type and cuisine, or search by recipe name and ingredient.
- Sort the recipes with the most pantry matches first and show missing key ingredients.
- Open ingredients, steps, nutrition, and source or creator attribution from each card.
- Nutrition labels preserve creator-provided values when available and mark estimates.

The catalog contains **70 completed recipe cards**: 55 from the original working collection and 15 adapted from the user-supplied *Usman's Recipe Book (jalalsamfit)* PDF. The 47 remaining saved links are not presented as complete recipes until their ingredients and methods are verified.

The 15 added cards attribute Jalal and identify the page in the supplied PDF. The PDF repeats the same 545-calorie, 57g protein, 46g carbs, 13g fat banner on most recipe pages. Each card now uses Jalal's recipe-specific, per-serving figures found in matching posts or cookbooks, with a link to a matching recipe source and the serving count. These are creator-reported values, which vary with ingredient brands and portions. One milk range on the Alfredo Chicken Fried Rice page is unreadable at the upper end, and one chicken quantity is printed as “12/3 lb”; those ambiguities are called out in the ingredient lists.

## Run locally

From this directory, run `python3 -m http.server 8000` and open `http://localhost:8000`. Opening `index.html` directly from a file URL may block the JSON request.

## Publish with GitHub Pages

1. Create a GitHub repository and upload the contents of this folder to its root.
2. In **Settings → Pages**, choose **Deploy from a branch**, select the default branch, and select **/(root)**.
3. GitHub will provide a link of the form `https://USERNAME.github.io/REPOSITORY/`.

The site uses relative paths, so it also works under a project subpath. If you update the recipe data, edit `recipes.json` and commit the file. The site runs without a build step or the source PDFs.

## Matching notes

Pantry matching is based on recognized ingredient names, not quantities or substitutions. The full ingredient list is always shown in the recipe detail. A high match score does not guarantee you have every required item or enough of it; check the full recipe before cooking. Culture labels follow the working collection and often say “inspired” to avoid presenting fusion recipes as traditional versions.
