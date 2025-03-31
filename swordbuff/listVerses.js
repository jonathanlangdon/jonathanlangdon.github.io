function loadVersesFor(selectedWho) {
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
      verseListContainer.innerHTML = ''; // ✅ Clear previous buttons

      jsFiles.forEach(file => {
        const fileName = file.name.replace(/\.js$/, '');
        const fileUrl = `./verses/${file.name}`;

        fetch(fileUrl)
          .then(response => response.text())
          .then(text => {
            const match = text.match(/who\s*:\s*['"]([^'"]+)['"]/);
            if (match && match[1] === selectedWho) {
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
}

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

document.addEventListener('DOMContentLoaded', () => {
  const selectedWho =
    document
      .querySelector('#user-select .toggle-button.active')
      ?.getAttribute('data-value') || 'Evelyn';

  loadVersesFor(selectedWho);
});

document.querySelectorAll('#user-select .toggle-button').forEach(button => {
  button.addEventListener('click', function () {
    document
      .querySelectorAll('#user-select .toggle-button')
      .forEach(btn => btn.classList.remove('active'));

    this.classList.add('active');
    const selectedOption = this.getAttribute('data-value');
    console.log('Selected option:', selectedOption);

    loadVersesFor(selectedOption); // ✅ reload the list
  });
});
