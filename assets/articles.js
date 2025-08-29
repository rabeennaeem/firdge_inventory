// Global variable to store articles
let articles = [];

// DOM elements
const articlesGrid = document.getElementById('articles-grid');
const articleModal = document.getElementById('article-modal');
const closeArticleModalBtn = document.getElementById('close-article-modal');
const articleModalTitle = document.getElementById('article-modal-title');
const articleModalImage = document.getElementById('article-modal-image');
const articleModalAuthor = document.getElementById('article-modal-author');
const articleModalDate = document.getElementById('article-modal-date');
const articleModalReadTime = document.getElementById('article-modal-read-time');
const articleModalCategory = document.getElementById('article-modal-category');
const articleModalContent = document.getElementById('article-modal-content');
const articleSearch = document.getElementById('article-search');
const searchArticleBtn = document.getElementById('search-article-btn');
const articleSort = document.getElementById('article-sort');
const articlesCount = document.getElementById('articles-count');

// Load articles from JSON file
fetch('assets/articles.json')
  .then(response => response.json())
  .then(data => {
    articles = data.articles;
    // Initial display of all articles
    displayArticles(articles);
  })
  .catch(error => {
    console.error('Error loading articles:', error);
    articlesGrid.innerHTML = '<p class="no-articles">Error loading articles. Please try again later.</p>';
  });

// Function to display articles
function displayArticles(articlesToShow) {
  articlesGrid.innerHTML = '';
  articlesCount.textContent = articlesToShow.length;
  
  if (articlesToShow.length === 0) {
    articlesGrid.innerHTML = '<p class="no-articles">No articles found matching your criteria.</p>';
    return;
  }
  
  // Sort articles if needed
  if (articleSort.value === 'oldest') {
    articlesToShow.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
  } else if (articleSort.value === 'newest') {
    articlesToShow.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  } else if (articleSort.value === 'readTime') {
    articlesToShow.sort((a, b) => {
      const aTime = parseInt(a.readTime);
      const bTime = parseInt(b.readTime);
      return bTime - aTime;
    });
  }
  
  articlesToShow.forEach(article => {
    const articleCard = document.createElement('div');
    articleCard.className = 'article-card';
    articleCard.innerHTML = `
      <div class="article-image">
        <img src="${article.image}" alt="${article.title}">
      </div>
      <div class="article-content">
        <span class="article-category">${article.category}</span>
        <h3>${article.title}</h3>
        <p class="article-desc">${article.description}</p>
        <div class="article-meta">
          <span class="article-author">By ${article.author}</span>
          <span class="article-date">${article.publishDate}</span>
          <span class="article-read-time">${article.readTime}</span>
        </div>
        <button class="read-article-btn" data-id="${article.id}">Read Article</button>
      </div>
    `;
    articlesGrid.appendChild(articleCard);
  });
  
  // Add event listeners to the new buttons
  document.querySelectorAll('.read-article-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const articleId = parseInt(btn.getAttribute('data-id'));
      showArticleDetails(articleId);
    });
  });
}

// Function to show article details in modal
function showArticleDetails(articleId) {
  const article = articles.find(a => a.id === articleId);
  if (!article) return;
  
  articleModalTitle.textContent = article.title;
  articleModalImage.src = article.image;
  articleModalImage.alt = article.title;
  articleModalAuthor.textContent = `By ${article.author}`;
  articleModalDate.textContent = article.publishDate;
  articleModalReadTime.textContent = article.readTime;
  articleModalCategory.textContent = article.category;
  
  // Clear previous content
  articleModalContent.innerHTML = article.content;
  
  // Show modal
  articleModal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Function to filter articles based on search and categories
function filterArticles() {
  const searchTerm = articleSearch.value.toLowerCase().trim();
  const selectedCategories = getSelectedCategories();
  
  let filteredArticles = articles;
  
  // Filter by search term
  if (searchTerm) {
    filteredArticles = filteredArticles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.description.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.author.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by categories if not "all"
  if (!selectedCategories.includes('all') && selectedCategories.length > 0) {
    filteredArticles = filteredArticles.filter(article => 
      selectedCategories.includes(article.category)
    );
  }
  
  displayArticles(filteredArticles);
}

// Function to get selected categories
function getSelectedCategories() {
  const selectedCategories = [];
  document.querySelectorAll('.filter-item input:checked').forEach(checkbox => {
    selectedCategories.push(checkbox.value);
  });
  return selectedCategories;
}

// Event listeners
closeArticleModalBtn.addEventListener('click', () => {
  articleModal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Re-enable scrolling
});

window.addEventListener('click', (event) => {
  if (event.target === articleModal) {
    articleModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }
});

articleSort.addEventListener('change', () => {
  filterArticles();
});

searchArticleBtn.addEventListener('click', filterArticles);

articleSearch.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    filterArticles();
  }
});

// Add event listeners to all category checkboxes
document.querySelectorAll('.filter-item input').forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    // If "All Categories" is checked, uncheck others
    if (checkbox.value === 'all' && checkbox.checked) {
      document.querySelectorAll('.filter-item input:not([value="all"])').forEach(otherCheckbox => {
        otherCheckbox.checked = false;
      });
    }
    // If any other category is checked, uncheck "All Categories"
    else if (checkbox.checked) {
      document.querySelector('.filter-item input[value="all"]').checked = false;
    }
    // If no categories are selected, check "All Categories"
    else if (getSelectedCategories().length === 0) {
      document.querySelector('.filter-item input[value="all"]').checked = true;
    }
    
    filterArticles();
  });
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