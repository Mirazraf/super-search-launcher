// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('popup-search-input');
    const engineSelect = document.getElementById('popup-engine-select');
    const searchButton = document.getElementById('popup-search-button');
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const popupContainer = document.querySelector('.ssl-popup-container');

    // Function to apply the theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            popupContainer.classList.add('ssl-dark-mode');
            // Change icon to sun for dark mode
            themeIcon.src = "https://img.icons8.com/ios-filled/24/ffffff/sun.png"; // White sun icon
            themeIcon.alt = "Sun icon for dark mode";
        } else {
            popupContainer.classList.remove('ssl-dark-mode');
            // Change icon to moon for light mode
            themeIcon.src = "https://img.icons8.com/ios-filled/24/000000/moon-symbol.png"; // Black moon icon
            themeIcon.alt = "Moon icon for light mode";
        }
    }

    // Load saved theme from storage
    chrome.storage.sync.get('theme', (data) => {
        const savedTheme = data.theme || 'light'; // Default to light if not found
        applyTheme(savedTheme);
    });

    // Handle theme toggle
    themeToggleButton.addEventListener('click', () => {
        chrome.storage.sync.get('theme', (data) => {
            const currentTheme = data.theme || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            // Save new theme to storage
            chrome.storage.sync.set({ theme: newTheme }, () => {
                applyTheme(newTheme); // Apply to popup immediately
                // Send message to background script to update all content scripts
                chrome.runtime.sendMessage({ action: "updateTheme", theme: newTheme });
            });
        });
    });

    // Function to perform the search
    const performSearch = () => {
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
            chrome.tabs.create({ url: url }); // Open in a new tab
            window.close(); // Close the popup after search
        }
    };

    // Add event listener for search button click
    searchButton.addEventListener('click', performSearch);

    // Add event listener for Enter key on the input field
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
});
