document.querySelectorAll('#user-select .toggle-button').forEach(button => {
  button.addEventListener('click', function () {
    // Remove active class from all buttons
    document
      .querySelectorAll('#user-select .toggle-button')
      .forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    this.classList.add('active');
    // Optionally, do something with the selected value
    const selectedOption = this.getAttribute('data-value');
    console.log('Selected option:', selectedOption);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Get the active selection from the toggle button group.
  const selectedWho =
    document
      .querySelector('#user-select .toggle-button.active')
      ?.getAttribute('data-value') || 'Evelyn';

  // Only run this code if not in a dynamic page
  const params = new URLSearchParams(window.location.search);
  if (params.has('verse')) return;

  // API URL for the verses folder in your repository
  const apiUrl =
    'https://api.github.com/repos/jonathanlangdon/jonathanlangdon.github.io/contents/swordbuff/verses?ref=main';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok)
        throw new Error('GitHub API request failed: ' + response.statusText);
      return response.json();
    })
    .then(data => {
      // Filter for .js files only
      const jsFiles = data.filter(
        item => item.type === 'file' && item.name.endsWith('.js')
      );
      const verseListContainer = document.getElementById('verse-list');

      jsFiles.forEach(file => {
        // Dynamically import the module using its download_url
        import(file.download_url)
          .then(module => {
            const verseData = module.data;
            // Only list if the verse's "who" matches the selected option
            if (verseData.who === selectedWho) {
              // Remove the .js extension for display
              const fileName = file.name.replace(/\.js$/, '');
              const smartName = formatVerseName(fileName);
              const button = document.createElement('button');
              button.classList.add('blue-button');
              button.textContent = smartName;
              button.addEventListener('click', () => {
                window.location.href = `index.html?verse=${fileName}`;
              });
              verseListContainer.appendChild(button);
            }
          })
          .catch(err =>
            console.error('Error loading verse file:', file.name, err)
          );
      });
    })
    .catch(err => console.error('Error fetching repository contents:', err));

  // Helper function to smart-format file names for display.
  function formatVerseName(name) {
    const match = name.match(/^([a-z]+)([\d:.-]+)$/i);
    if (match) {
      let book = match[1];
      let rest = match[2];
      book = book.charAt(0).toUpperCase() + book.slice(1).toLowerCase();
      return `${book} ${rest}`;
    }
    return name;
  }
});
