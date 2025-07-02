// background.js

// Listen for commands from the manifest (e.g., Alt+S)
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-search-bar") {
    // Get the currently active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        // Send a message to the content script in the active tab
        // to toggle the visibility of the search bar.
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleSearchBar" });
      }
    });
  }
});

// Listen for messages from the popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateTheme") {
    // When the theme is updated from the popup,
    // send a message to all content scripts to update their theme.
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        // Ensure the tab has a URL (e.g., not a special Chrome page)
        if (tab.url && !tab.url.startsWith("chrome://")) {
          chrome.tabs.sendMessage(tab.id, {
            action: "applyTheme",
            theme: request.theme,
          });
        }
      });
    });
  }
});
