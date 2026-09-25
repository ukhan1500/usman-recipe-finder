const $ = (selector) => document.querySelector(selector);
const el = (tag, cls, value) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (value !== undefined) node.textContent = value;
  return node;
};
const state = { recipes: [], pantry: [], vocabulary: new Set() };
const aliases = {
  'chicken breast': 'chicken', 'chicken thigh': 'chicken', 'ground chicken': 'chicken',
  'ground beef': 'beef', 'chuck roast': 'beef', 'salmon fillet': 'salmon',
  'egg': 'eggs', 'egg whites': 'eggs', 'potato': 'potatoes',
  'red onion': 'onion', 'white onion': 'onion', 'green onion': 'scallions',
  'spring onion': 'scallions', 'bell peppers': 'bell pepper', 'pepper': 'bell pepper',
  'chili': 'hot pepper', 'chilli': 'hot pepper', 'chiles': 'hot pepper',
  'tomatoes': 'tomato', 'garlic cloves': 'garlic', 'greek yogurt': 'yogurt',
  'greek yoghurt': 'yogurt', 'yoghurt': 'yogurt', 'noodles': 'pasta',
  'spaghetti': 'pasta', 'parmesan cheese': 'parmesan', 'mozzarella cheese': 'mozzarella',
  'pb2': 'peanut butter', 'cocoa': 'chocolate', 'cocoa powder': 'chocolate',
  'chocolate chips': 'chocolate', 'oat flour': 'oats', 'rolled oats': 'oats',
  'chicken broth': 'broth', 'stock': 'broth', 'tortillas': 'tortilla', 'wrap': 'tortilla',
  'lime juice': 'lime', 'lemon juice': 'lemon', 'soy': 'soy sauce'
};

function normalize(value) {
  const term = value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  return aliases[term] || term;
}
function savePantry() {
  try { localStorage.setItem('usman-recipe-pantry', JSON.stringify(state.pantry)); } catch (_) {}
}
function addIngredients(raw) {
  for (const entry of raw.split(/[,;\n]+/)) {
    const name = normalize(entry);
    if (name && !state.pantry.includes(name)) state.pantry.push(name);
  }
  savePantry(); renderChips(); renderRecipes();
}
function renderChips() {
  const host = $('#pantry-chips'); host.replaceChildren();
  state.pantry.forEach((name) => {
    const chip = el('span', 'chip'); chip.append(el('span', '', name));
    const remove = el('button', '', '×'); remove.type = 'button'; remove.setAttribute('aria-label', `Remove ${name}`);
    remove.addEventListener('click', () => {
      state.pantry = state.pantry.filter((entry) => entry !== name);
      savePantry(); renderChips(); renderRecipes();
    });
    chip.append(remove); host.append(chip);
  });
}
function hasIngredient(recipe, pantryTerm) {
  if (state.vocabulary.has(pantryTerm)) return recipe.pantry.includes(pantryTerm);
  return recipe.ingredients.some((line) => line.toLowerCase().includes(pantryTerm));
}
function score(recipe) {
  const matched = state.pantry.filter((term) => hasIngredient(recipe, term));
  const missing = recipe.pantry.filter((term) => !state.pantry.some((owned) => owned === term));
  return { matched, missing, ratio: matched.length / Math.max(recipe.pantry.length, 1) };
}
function makeCard(recipe, number) {
  const match = score(recipe);
  const card = el('article', 'recipe-card');
  const top = el('div', 'card-top'); top.append(el('span', 'card-num', String(number).padStart(2, '0')), el('span', 'card-meal', recipe.meal));
  card.append(top, el('h3', '', recipe.title), el('p', 'card-culture', recipe.culture));
  const summary = state.pantry.length
    ? `${match.matched.length} of ${recipe.pantry.length} key ingredients matched`
    : `${recipe.pantry.length} key ingredients`;
  card.append(el('p', 'match-summary', summary));
  const bar = el('div', 'match-bar'); const fill = el('span'); fill.style.width = `${state.pantry.length ? match.ratio * 100 : 0}%`; bar.append(fill); card.append(bar);
  const missing = state.pantry.length
    ? (match.missing.length ? `Still needed: ${match.missing.slice(0, 3).join(', ')}${match.missing.length > 3 ? ` +${match.missing.length - 3} more` : ''}` : 'All tracked ingredients matched — check amounts & seasonings.')
    : `Try adding ${recipe.pantry.slice(0, 3).join(', ')} to your pantry.`;
  card.append(el('p', 'missing', missing));
  const footer = el('div', 'card-footer');
  footer.append(el('span', 'kcal', `${recipe.nutrition.calories} cal · ${recipe.nutrition.scope}`));
  const open = el('button', '', 'View recipe ↗'); open.type = 'button'; open.setAttribute('aria-label', `View ${recipe.title}`);
  open.addEventListener('click', () => openRecipe(recipe)); footer.append(open); card.append(footer);
  return card;
}
function renderRecipes() {
  const meal = $('#meal-filter').value, culture = $('#culture-filter').value;
  const query = $('#recipe-search').value.trim().toLowerCase();
  const onlyMatches = $('#only-matches').checked;
  const matches = state.recipes.filter((recipe) =>
    (!meal || recipe.meal === meal) && (!culture || recipe.culture === culture) &&
    (!query || `${recipe.title} ${recipe.ingredients.join(' ')}`.toLowerCase().includes(query)) &&
    (!onlyMatches || (state.pantry.length && score(recipe).matched.length > 0)));
  if (state.pantry.length) matches.sort((a,b) => {
    const A=score(a), B=score(b);
    return B.matched.length - A.matched.length || B.ratio - A.ratio || a.title.localeCompare(b.title);
  });
  const grid = $('#recipe-grid'); grid.replaceChildren();
  const fragment = document.createDocumentFragment();
  matches.forEach((recipe, index) => fragment.append(makeCard(recipe, index + 1)));
  grid.append(fragment);
  $('#results-count').textContent = matches.length;
  $('#empty-state').hidden = matches.length !== 0;
}
function openRecipe(recipe) {
  const host = $('#dialog-content'); host.replaceChildren();
  const header = el('header', 'dialog-header');
  header.append(el('p', 'eyebrow', `${recipe.meal} / ${recipe.culture}`));
  const title = el('h2', '', recipe.title); title.id = 'dialog-title'; header.append(title);
  const nutrition = el('div', 'nutrition-row');
  for (const [label, value] of [['CALORIES', recipe.nutrition.calories], ['PROTEIN', `${recipe.nutrition.protein}g`], ['CARBS', `${recipe.nutrition.carbs}g`], ['FAT', `${recipe.nutrition.fat}g`]]) {
    const item = el('div'); item.append(el('strong', '', String(value)), el('span', '', label)); nutrition.append(item);
  }
  header.append(nutrition);
  header.append(el('p', 'nutrition-note', `${recipe.nutrition.scope} · ${recipe.nutrition.note}${recipe.nutrition.estimated ? ' · approximate' : ''}`));
  const body = el('div', 'dialog-body');
  body.append(el('h3', '', 'INGREDIENTS'));
  const ingredients = el('ul'); recipe.ingredients.forEach((part) => ingredients.append(el('li', '', part))); body.append(ingredients);
  body.append(el('h3', '', 'STEPS'));
  const steps = el('ol'); recipe.steps.forEach((step) => steps.append(el('li', '', step))); body.append(steps);
  const link = el('a', 'source-button', 'Open original source ↗'); link.href = recipe.source; link.target = '_blank'; link.rel = 'noopener noreferrer'; body.append(link);
  host.append(header, body); $('#recipe-dialog').showModal();
}
async function init() {
  try {
    const response = await fetch('recipes.json?v=2'); if (!response.ok) throw new Error('Recipe catalog could not be loaded');
    state.recipes = await response.json();
    state.vocabulary = new Set(state.recipes.flatMap((r) => r.pantry));
    $('#recipe-count').textContent = state.recipes.length;
    for (const [selector, values] of [
      ['#meal-filter', [...new Set(state.recipes.map((r) => r.meal))]],
      ['#culture-filter', [...new Set(state.recipes.map((r) => r.culture))].sort()]
    ]) {
      const select = $(selector);
      values.forEach((value) => { const option = el('option', '', value); option.value = value; select.append(option); });
    }
    const suggestions = [...new Set(state.recipes.flatMap((r) => r.pantry))].sort();
    suggestions.forEach((value) => { const option = el('option'); option.value = value; $('#ingredient-options').append(option); });
    try {
      const saved = JSON.parse(localStorage.getItem('usman-recipe-pantry') || '[]');
      if (Array.isArray(saved)) state.pantry = [...new Set(saved.filter((x) => typeof x === 'string').map(normalize))];
    } catch (_) {}
    renderChips(); renderRecipes();
  } catch (error) {
    $('#recipe-grid').replaceChildren(el('p', '', 'The recipe catalog could not load. Refresh the page or try again later.'));
    console.error(error);
  }
}
$('#add-ingredient').addEventListener('click', () => { addIngredients($('#ingredient-input').value); $('#ingredient-input').value = ''; $('#ingredient-input').focus(); });
$('#ingredient-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') { event.preventDefault(); $('#add-ingredient').click(); }
});
for (const selector of ['#meal-filter','#culture-filter','#only-matches']) $(selector).addEventListener('change', renderRecipes);
$('#recipe-search').addEventListener('input', renderRecipes);
$('#reset-filters').addEventListener('click', () => {
  $('#meal-filter').value=''; $('#culture-filter').value=''; $('#recipe-search').value=''; $('#only-matches').checked=false;
  renderRecipes();
});
$('#close-dialog').addEventListener('click', () => $('#recipe-dialog').close());
$('#recipe-dialog').addEventListener('click', (event) => { if (event.target === $('#recipe-dialog')) $('#recipe-dialog').close(); });
init();
