# Usman's Recipe Finder

A static, mobile-friendly website for finding recipes from the ingredients you have. It runs entirely in the browser and is ready for GitHub Pages. No account, database, API key, or build step is required.

## Features

- Enter or paste ingredients and save a pantry on your device.
- Filter the catalog by meal type and cuisine, or search by recipe name and ingredient.
- Sort the recipes with the most pantry matches first and show missing key ingredients.
- Open ingredients, steps, nutrition, and source or creator attribution from each card.
- Use the separate **Watch the original video** link to open a specific creator post.
- Nutrition labels preserve creator-provided values when available and mark estimates.

The catalog contains **70 completed recipe cards**: 55 from the original working collection and 15 adapted from the user-supplied *Usman's Recipe Book (jalalsamfit)* PDF. The 47 remaining saved links are not presented as complete recipes until their ingredients and methods are verified.

The 15 added cards attribute Jalal and identify the page in the supplied PDF. The PDF repeats the same 545-calorie, 57g protein, 46g carbs, 13g fat banner on most recipe pages. Each card now uses Jalal's recipe-specific, per-serving figures found in matching posts or cookbooks, with a link to a matching recipe source and the serving count. These are creator-reported values, which vary with ingredient brands and portions. One milk range on the Alfredo Chicken Fried Rice page is unreadable at the upper end, and one chicken quantity is printed as “12/3 lb”; those ambiguities are called out in the ingredient lists.

## Continue the recipe collection in a new chat

This README is the handoff for future updates. The user will provide the latest large recipe PDF and this site's URL, plus a new recipe link, image, or text. The user's standing goal is to **add each newly found recipe to both the PDF and the live website**. Treat the supplied PDF and the current live repository as the latest versions. Preserve existing recipes, visual style, working links, and nutrition notes.

For each new recipe:

1. Read the actual creator post/caption or user-supplied recipe. Record a usable ingredient list, quantities, and complete cooking steps. If essential details are missing, ask for the caption or screenshots; do not invent a creator recipe. Credit the creator and keep the specific post URL, including the exact case of its shortcode. Avoid generic Instagram `/reels/` links. Instagram can redirect to sign-in in some contexts; verify the post ID and content where possible. If its original video is only verifiable on another platform, label that platform.
2. Convert metric ingredient quantities and temperatures to practical US cups, tablespoons, teaspoons, ounces/pounds, and °F. Keep the cooking instructions clear and food-safe. Classify under the appropriate meal type and cuisine/culture, using “inspired” when the recipe is a fusion.
3. Include **calories, protein, carbs, fat, and serving size**. Prefer recipe-specific creator-reported numbers and identify them as such. If unavailable, estimate from ingredients and portions, mark the values “Estimated by Codex” (or “estimated”), and avoid false precision. Do not apply a generic nutrition banner to unrelated recipes.
4. Add a card to `recipes.json` using the existing schema (`id`, `title`, `meal`, `culture`, `ingredients`, `pantry`, `steps`, `nutrition`, `source`, `originalVideo`, `originalVideoPlatform`; add `credit`/`sourceLabel` when useful). `pantry` contains normalized ingredient keywords used by the finder. `nutrition` has `scope`, `calories`, `protein`, `carbs`, `fat`, `note`, and `estimated`. Keep source material separate from the dedicated video link if the written nutrition source differs. The site is static and reads `recipes.json` at runtime; bump the JSON cache query in `app.js` and the JS/CSS query in `index.html` when deploying an update.
5. Add the recipe to the latest PDF in a matching meal-type and culture subsection, with ingredients and steps both legible, the nutrition and estimate/creator note visible, and a distinct clickable **Original video** link to the exact post. Keep the clickable table of contents accurate. Render several pages, including the new page and its table-of-contents entry, and check PDF link annotations before delivering.
6. Publish the site update to this GitHub Pages repository and wait for its Pages deployment to succeed. Open the live page and inspect the new recipe and its video target. Save the revised PDF as the new version of the same user-facing file, then provide the live site URL and updated PDF.

There is no requirement to fill all 47 older saved links in one update. Add a saved link only after its recipe details can be verified. The existing 70 website cards and 89-page PDF came from different source collections, so compare them by title/source rather than assuming page numbers match website IDs.

## Run locally

From this directory, run `python3 -m http.server 8000` and open `http://localhost:8000`. Opening `index.html` directly from a file URL may block the JSON request.

## Publish with GitHub Pages

1. Create a GitHub repository and upload the contents of this folder to its root.
2. In **Settings → Pages**, choose **Deploy from a branch**, select the default branch, and select **/(root)**.
3. GitHub will provide a link of the form `https://USERNAME.github.io/REPOSITORY/`.

The site uses relative paths, so it also works under a project subpath. If you update the recipe data, edit `recipes.json` and commit the file. The site runs without a build step or the source PDFs.

## Matching notes

Pantry matching is based on recognized ingredient names, not quantities or substitutions. The full ingredient list is always shown in the recipe detail. A high match score does not guarantee you have every required item or enough of it; check the full recipe before cooking. Culture labels follow the working collection and often say “inspired” to avoid presenting fusion recipes as traditional versions.
