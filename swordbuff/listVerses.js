document.addEventListener('DOMContentLoaded', () => {
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
      const jsFiles = data.filter(
        item => item.type === 'file' && item.name.endsWith('.js')
      );

      const verseListContainer = document.getElementById('verse-list');

      jsFiles.forEach(file => {
        const fileName = file.name.replace(/\.js$/, '');

        // Smart name formatting
        const match = fileName.match(/^([a-z]+)(\d+)?$/i);
        let displayName = fileName;

        if (match) {
          let [_, rawBook, digits] = match;
          let book =
            rawBook.charAt(0).toUpperCase() + rawBook.slice(1).toLowerCase();

          if (digits && digits.length > 2) {
            const chapter = digits.slice(0, digits.length - 2);
            const verse = digits.slice(-2);
            displayName = `${book} ${chapter}:${verse}`;
          } else if (digits) {
            displayName = `${book} ${parseInt(digits)}`;
          } else {
            displayName = book;
          }
        }

        const button = document.createElement('button');
        button.classList.add('blue-button');
        button.textContent = displayName;
        button.addEventListener('click', () => {
          window.location.href = `index.html?verse=${fileName}`;
        });

        verseListContainer.appendChild(button);
      });
    })
    .catch(err => console.error('Error fetching repository contents:', err));
});
