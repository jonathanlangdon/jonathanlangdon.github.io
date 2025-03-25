document.addEventListener('DOMContentLoaded', () => {
  // Check if the URL contains the "verse" parameter
  const params = new URLSearchParams(window.location.search);
  if (params.has('verse')) {
    // If we're in a dynamic page (e.g., index.html?verse=luke12), don't run the code below
    return;
  }

  // API URL for the "verses" folder in your repository
  const apiUrl =
    'https://api.github.com/repos/jonathanlangdon/jonathanlangdon.github.io/contents/swordbuff/verses?ref=main';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('GitHub API request failed: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Filter for .js files only (files where type is 'file' and name ends with '.js')
      const jsFiles = data.filter(
        item => item.type === 'file' && item.name.endsWith('.js')
      );
      const verseListContainer = document.getElementById('verse-list');

      jsFiles.forEach(file => {
        // Remove the .js extension for display
        const fileName = file.name.replace(/\.js$/, '');
        // Format the name smartly, e.g., "deut3" -> "Deut 3", "eph2:8-9" -> "Eph 2:8-9"
        const smartName = formatVerseName(fileName);
        const button = document.createElement('button');
        button.classList.add('blue-button');
        button.textContent = smartName;
        button.addEventListener('click', () => {
          // Redirect to index.html with a query parameter that indicates which verse to load
          window.location.href = `index.html?verse=${fileName}`;
        });
        verseListContainer.appendChild(button);
      });
    })
    .catch(err => console.error('Error fetching repository contents:', err));

  // Helper function to convert file names to smart display names.
  function formatVerseName(name) {
    // Pattern: one or more letters followed by one or more digits and allowed punctuation (:, -, .)
    const match = name.match(/^([a-z]+)([\d:.-]+)$/i);
    if (match) {
      let book = match[1];
      let rest = match[2];
      // Capitalize the book abbreviation
      book = book.charAt(0).toUpperCase() + book.slice(1).toLowerCase();
      return `${book} ${rest}`;
    }
    return name;
  }
});
