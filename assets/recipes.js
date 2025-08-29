// Global variable to store recipes
let recipes = [];

// DOM elements
const recipeGrid = document.getElementById('recipe-grid');
const findRecipesBtn = document.getElementById('find-recipes-btn');
const modal = document.getElementById('recipe-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const country = document.getElementById('country');
const cookTime = document.getElementById('cook-time');
const servings = document.getElementById('servings');
const modalIngredients = document.getElementById('modal-ingredients');
const modalInstructions = document.getElementById('modal-instructions');
const ingredientSearch = document.getElementById('ingredient-search');
const addIngredientBtn = document.getElementById('add-ingredient-btn');
const sortSelect = document.getElementById('sort-select');

let selectedIngredients = []; // Track selected ingredients

// Load recipes from JSON file
fetch('assets/recipes.json')
  .then(response => response.json())
  .then(data => {
    recipes = data.recipes;
    // Initial display of all recipes
    displayRecipes(recipes);
  })
  .catch(error => {
    console.error('Error loading recipes:', error);
    recipeGrid.innerHTML = '<p class="no-recipes">Error loading recipes. Please try again later.</p>';
  });

// Function to display recipes
function displayRecipes(recipesToShow) {
  recipeGrid.innerHTML = '';
  
  if (recipesToShow.length === 0) {
    recipeGrid.innerHTML = '<p class="no-recipes">No recipes found with your selected ingredients.</p>';
    return;
  }
  
  // Sort recipes if needed
  if (sortSelect.value === 'time') {
    recipesToShow.sort((a, b) => {
      const aTime = parseInt(a.cookTime);
      const bTime = parseInt(b.cookTime);
      return aTime - bTime;
    });
  }
  
  recipesToShow.forEach(recipe => {
    const matchPercentage = calculateMatchPercentage(recipe);
    
    const recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card';
    recipeCard.innerHTML = `
      <div class="recipe-image">
        <img src="${recipe.image}" alt="${recipe.name}">
      </div>
      <div class="recipe-content">
        <h3>${recipe.name}</h3>
        <p class="recipe-desc">${recipe.description}</p>
        <div class="recipe-meta">
          <span class="cooking-time">${recipe.cookTime}</span>
          <span class="matches">${matchPercentage}% match</span>
        </div>
        <button class="view-recipe-btn" data-id="${recipe.id}">Cook Now</button>
      </div>
    `;
    recipeGrid.appendChild(recipeCard);
  });
  
  // Add event listeners to the new buttons
  document.querySelectorAll('.view-recipe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const recipeId = parseInt(btn.getAttribute('data-id'));
      showRecipeDetails(recipeId);
    });
  });
}

// Function to calculate match percentage
function calculateMatchPercentage(recipe) {
  if (selectedIngredients.length === 0) return Math.floor(Math.random() * 41) + 60;
  
  const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
  let matchCount = 0;
  
  selectedIngredients.forEach(selectedIng => {
    if (recipeIngredients.some(recipeIng => 
      recipeIng.includes(selectedIng.toLowerCase()))) {
      matchCount++;
    }
  });
  
  const percentage = Math.floor((matchCount / selectedIngredients.length) * 100);
  return Math.min(percentage, 100); // Cap at 100%
}

// Function to show recipe details in modal
function showRecipeDetails(recipeId) {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return;
  
  modalTitle.textContent = recipe.name;
  modalImage.src = recipe.image;
  modalImage.alt = recipe.name;
  country.textContent = recipe.country;
  cookTime.textContent = recipe.cookTime;
  servings.textContent = recipe.servings;
  
  // Clear previous ingredients and instructions
  modalIngredients.innerHTML = '';
  modalInstructions.innerHTML = '';
  
  // Add ingredients
  recipe.ingredients.forEach(ingredient => {
    const li = document.createElement('li');
    li.textContent = ingredient;
    modalIngredients.appendChild(li);
  });
  
  // Add instructions
  recipe.instructions.forEach(instruction => {
    const li = document.createElement('li');
    li.textContent = instruction;
    modalInstructions.appendChild(li);
  });
  
  // Show modal
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Function to get selected ingredients
function getSelectedIngredients() {
  selectedIngredients = [];
  document.querySelectorAll('.ingredient-item input:checked').forEach(checkbox => {
    selectedIngredients.push(checkbox.value);
  });
  return selectedIngredients;
}

// Function to filter recipes based on selected ingredients
function filterRecipes() {
  const selected = getSelectedIngredients();
  
  if (selected.length === 0) {
    displayRecipes(recipes);
    return;
  }
  
  const filteredRecipes = recipes.filter(recipe => {
    const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
    
    // Check if ANY selected ingredient matches ANY recipe ingredient
    return selected.some(selectedIng => {
      return recipeIngredients.some(recipeIng => 
        recipeIng.includes(selectedIng.toLowerCase())
      );
    });
  });
  
  displayRecipes(filteredRecipes);
}

// Function to add a custom ingredient
function addCustomIngredient() {
  const customIngredient = ingredientSearch.value.trim();
  if (!customIngredient) return;
  
  // Create a new checkbox for the custom ingredient
  const otherCategory = document.querySelector('.category:last-child .ingredient-list');
  const newIngredient = document.createElement('label');
  newIngredient.className = 'ingredient-item';
  newIngredient.innerHTML = `
    <input type="checkbox" value="${customIngredient.toLowerCase()}"> ${customIngredient}
  `;
  otherCategory.appendChild(newIngredient);
  
  // Add event listener to the new checkbox
  newIngredient.querySelector('input').addEventListener('change', filterRecipes);
  
  // Clear the search input
  ingredientSearch.value = '';
}

// Event listeners
findRecipesBtn.addEventListener('click', filterRecipes);

closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Re-enable scrolling
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }
});

sortSelect.addEventListener('change', () => {
  filterRecipes();
});

addIngredientBtn.addEventListener('click', addCustomIngredient);

ingredientSearch.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addCustomIngredient();
  }
});

// Add event listeners to all checkboxes for real-time filtering
document.querySelectorAll('.ingredient-item input').forEach(checkbox => {
  checkbox.addEventListener('change', filterRecipes);
});

// Mobile menu functionality
const menuButton = document.querySelector('.menu-button');
const headRight = document.querySelector('.head-right');

if (menuButton && headRight) {
  menuButton.addEventListener('click', () => {
    headRight.classList.toggle('active');
    menuButton.textContent = headRight.classList.contains('active') ? '✕' : '☰';
  });
}