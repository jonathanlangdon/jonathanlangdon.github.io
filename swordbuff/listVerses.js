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
  const selectedWho =
    document
      .querySelector('#user-select .toggle-button.active')
      ?.getAttribute('data-value') || 'Evelyn';

  const params = new URLSearchParams(window.location.search);
  if (params.has('verse')) return;

  const apiUrl =
    'https://api.github.com/repos/jonathanlangdon/jonathanlangdon.github.io/contents/swordbuff/verses?ref=main';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok)
        throw new Error('GitHub API request failed: ' + response.statusText);
      return response.json();
    })
    .then(data => {
      const jsFiles = data.filter(
        item => item.type === 'file' && item.name.endsWith('.js')
      );
      const verseListContainer = document.getElementById('verse-list');

      jsFiles.forEach(file => {
        // Fetch the file content as text
        fetch(file.download_url)
          .then(response => response.text())
          .then(text => {
            // Use regex to extract the value for 'who'
            const match = text.match(/who\s*:\s*['"]([^'"]+)['"]/);
            if (match && match[1] === selectedWho) {
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
            console.error('Error loading file content:', file.name, err)
          );
      });
    })
    .catch(err => console.error('Error fetching repository contents:', err));

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
