document.addEventListener('DOMContentLoaded', () => {
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
        const verseName = file.name.replace(/\.js$/, '');
        const button = document.createElement('button');
        button.classList.add('blue-button');
        button.textContent = verseName;
        button.addEventListener('click', () => {
          // Redirect to index.html with a query parameter that indicates which verse to load
          window.location.href = `index.html?verse=${verseName}`;
        });
        verseListContainer.appendChild(button);
      });
    })
    .catch(err => console.error('Error fetching repository contents:', err));
});
