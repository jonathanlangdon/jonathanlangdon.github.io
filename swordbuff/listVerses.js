function loadVersesFor(selectedWho) {
  const params = new URLSearchParams(window.location.search);
  if (params.has('verse')) return;

  function parseLocalDate(str) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

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

              // 👉 Extract number of verses from the JS file text
              let totalVerses = 0;
              try {
                const versesArrayMatch = text.match(
                  /verses\s*:\s*\[((?:.|\n)*?)\]/m
                );
                if (versesArrayMatch) {
                  const itemsText = versesArrayMatch[1];

                  // Count how many `{` or `[` start individual entries
                  const count = (itemsText.match(/{/g) || []).length;
                  totalVerses = count;
                }
              } catch (e) {
                console.warn(
                  'Could not extract verse count from file:',
                  file.name,
                  e
                );
              }

              // 👉 Add LocalStorage read and average calculation
              const record = JSON.parse(localStorage.getItem(fileName) || '{}');
              const values = Object.values(record);

              let averagePercent = 0;
              let earliestDueDate = null;

              if (values.length > 0) {
                const sum = values.reduce(
                  (acc, item) => acc + (item.percentRight || 0),
                  0
                );
                averagePercent = Math.round(sum / values.length);

                earliestDueDate = values
                  .map(v => v.dueDate && parseLocalDate(v.dueDate))
                  .filter(Boolean)
                  .sort((a, b) => a - b)[0];
              }

              // Determine circle color
              let today = new Date();
              today.setHours(0, 0, 0, 0);
              let circleColor = 'score-yellow';
              if (averagePercent >= 60 && earliestDueDate) {
                earliestDueDate.setHours(0, 0, 0, 0);
                if (earliestDueDate < today) circleColor = 'score-red';
                else if (values.length < totalVerses)
                  circleColor = 'score-yellow';
                else if (earliestDueDate > today) circleColor = 'score-green';
              }

              // Circle element
              const circle = `<span class="score-circle ${circleColor}">${averagePercent}</span>`;

              // Build button
              const button = document.createElement('button');
              button.classList.add('list-button');
              button.innerHTML = `${smartName} ${circle}`;
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
  const match = name.match(/^(\d+)([a-z]+)(\d+)$/i);
  if (match) {
    let number = match[1]; // Chapter number
    let book = match[2]; // Book name
    let chapter = match[3]; // Chapter number (after the book)

    book = book.charAt(0).toUpperCase() + book.slice(1).toLowerCase(); // Capitalize book name

    return `${number} ${book} ${chapter}`; // Return in the desired format
  }

  const matchFull = name.match(/^([a-z]+)([\d:.-]+)$/i); // Handle other formats like eph2:8-9
  if (matchFull) {
    let book = matchFull[1];
    let rest = matchFull[2];
    book = book.charAt(0).toUpperCase() + book.slice(1).toLowerCase();
    return `${book} ${rest}`;
  }

  return name;
}

document.addEventListener('DOMContentLoaded', () => {
  const storedWho = localStorage.getItem('who') || 'Evelyn';
  const toggleButtons = document.querySelectorAll(
    '#user-select .toggle-button'
  );

  toggleButtons.forEach(btn => {
    if (btn.getAttribute('data-value') === storedWho) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  loadVersesFor(storedWho);
});

document.querySelectorAll('#user-select .toggle-button').forEach(button => {
  button.addEventListener('click', function () {
    document
      .querySelectorAll('#user-select .toggle-button')
      .forEach(btn => btn.classList.remove('active'));

    this.classList.add('active');
    const selectedOption = this.getAttribute('data-value');
    console.log('Selected option:', selectedOption);
    localStorage.setItem('who', selectedOption);

    loadVersesFor(selectedOption); // Reload the list
  });
});
