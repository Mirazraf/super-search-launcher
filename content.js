// content.js

let searchBarContainer = null;
let currentTheme = 'light'; // Default theme

// Function to apply the theme (light/dark) to the search bar
function applyThemeToSearchBar(theme) {
  if (searchBarContainer) {
    if (theme === 'dark') {
      searchBarContainer.classList.add('ssl-dark-mode');
    } else {
      searchBarContainer.classList.remove('ssl-dark-mode');
    }
  }
}

// Function to perform the search
function performSearch() {
  const searchInput = searchBarContainer.querySelector('#ssl-search-input');
  const engineSelect = searchBarContainer.querySelector('#ssl-engine-select');
  const query = searchInput.value.trim();
  if (!query) return;

  const engine = engineSelect.value;
  let url = '';

  switch (engine) {
    case 'google':
      url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      break;
    case 'youtube':
      url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      break;
    case 'stackoverflow':
      url = `https://stackoverflow.com/search?q=${encodeURIComponent(query)}`;
      break;
    case 'wikipedia':
      url = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
      break;
  }

  if (url) {
    window.open(url, '_blank'); // Open in a new tab
    hideSearchBar(); // Hide the bar after searching
  }
}

// Hide and remove the search bar from DOM
function hideSearchBar() {
  if (searchBarContainer) {
    document.removeEventListener('keydown', handleEscKey, true);
    document.removeEventListener('mousedown', handleClickOutside, true);
    searchBarContainer.remove();
    searchBarContainer = null;
  }
}

// Handle Esc key to hide the search bar
function handleEscKey(event) {
  if (event.key === 'Escape') {
    hideSearchBar();
  }
}

// Handle clicks outside the search bar to hide it
function handleClickOutside(event) {
  if (searchBarContainer && !searchBarContainer.contains(event.target)) {
    hideSearchBar();
  }
}

// Function to create and inject the floating search bar
function showSearchBar() {
  if (searchBarContainer) {
    // If already present (shouldn't be), remove and recreate for safety
    hideSearchBar();
  }

  searchBarContainer = document.createElement('div');
  searchBarContainer.id = 'super-search-launcher-container';
  searchBarContainer.style.all = 'initial';
  searchBarContainer.style.fontFamily = 'Inter, sans-serif';

  searchBarContainer.innerHTML = `
    <style>
      #super-search-launcher-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2147483647;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: 90%;
        max-width: 500px;
        font-family: 'Inter', sans-serif;
      }
      #super-search-launcher-container.ssl-dark-mode {
        background-color: #2c2c2c;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        color: #e0e0e0;
      }
      #super-search-launcher-container .ssl-search-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #super-search-launcher-container .ssl-search-header h3 {
        all: initial;
        font-family: 'Inter', sans-serif;
        font-size: 1.2em;
        font-weight: bold;
        color: #333;
      }
      #super-search-launcher-container.ssl-dark-mode .ssl-search-header h3 {
        color: #e0e0e0;
      }
      #super-search-launcher-container .ssl-search-controls {
        display: flex;
        gap: 10px;
        width: 100%;
      }
      #super-search-launcher-container .ssl-engine-select {
        all: initial;
        flex-shrink: 0;
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
        font-size: 0.9em;
        cursor: pointer;
        outline: none;
        font-family: 'Inter', sans-serif;
        color: #333;
      }
      #super-search-launcher-container.ssl-dark-mode .ssl-engine-select {
        background-color: #3a3a3a;
        border-color: #555;
        color: #e0e0e0;
      }
      #super-search-launcher-container .ssl-engine-select:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
      }
      #super-search-launcher-container .ssl-search-input {
        all: initial;
        flex-grow: 1;
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 0.9em;
        outline: none;
        font-family: 'Inter', sans-serif;
        color: #333;
        background-color: #ffffff;
      }
      #super-search-launcher-container.ssl-dark-mode .ssl-search-input {
        background-color: #3a3a3a;
        border-color: #555;
        color: #e0e0e0;
      }
      #super-search-launcher-container .ssl-search-input::placeholder {
        color: #999;
      }
      #super-search-launcher-container.ssl-dark-mode .ssl-search-input::placeholder {
        color: #bbb;
      }
      #super-search-launcher-container .ssl-search-input:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
      }
      @media (max-width: 600px) {
        #super-search-launcher-container {
          width: 95%;
          padding: 15px;
        }
        #super-search-launcher-container .ssl-search-controls {
          flex-direction: column;
        }
      }
    </style>
    <div class="ssl-search-header">
      <h3>Super Search</h3>
    </div>
    <div class="ssl-search-controls">
      <select class="ssl-engine-select" id="ssl-engine-select">
        <option value="google">Google</option>
        <option value="youtube">YouTube</option>
        <option value="stackoverflow">Stack Overflow</option>
        <option value="wikipedia">Wikipedia</option>
      </select>
      <input type="text" class="ssl-search-input" id="ssl-search-input" placeholder="Type your search query...">
    </div>
  `;

  document.body.appendChild(searchBarContainer);

  // Set theme
  chrome.storage.sync.get('theme', (data) => {
    currentTheme = data.theme || 'light';
    applyThemeToSearchBar(currentTheme);
  });

  // Add search event
  const searchInput = searchBarContainer.querySelector('#ssl-search-input');
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      performSearch();
    }
  });

  // Always focus input
  searchInput.focus();

  // Add listeners for ESC and click outside
  setTimeout(() => {
    document.addEventListener('keydown', handleEscKey, true);
    document.addEventListener('mousedown', handleClickOutside, true);
  }, 50);
}

// Toggle function for background script to call
window.toggleSuperSearchBar = () => {
  if (searchBarContainer) {
    hideSearchBar();
  } else {
    showSearchBar();
  }
};

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleSearchBar") {
    window.toggleSuperSearchBar();
  } else if (request.action === "applyTheme") {
    currentTheme = request.theme;
    applyThemeToSearchBar(currentTheme);
  }
});