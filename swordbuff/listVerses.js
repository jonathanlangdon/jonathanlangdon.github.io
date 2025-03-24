document.addEventListener('DOMContentLoaded', () => {
  const apiUrl =
    'https://api.github.com/repos/jonathanlangdon/jonathanlangdon.github.io/contents/swordbuff?ref=main';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('GitHub API request failed: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const directories = data.filter(item => item.type === 'dir');
      const verseListContainer = document.getElementById('verse-list');

      directories.forEach(dir => {
        if (dir.name == 'graphics') return;
        const button = document.createElement('button');
        button.classList.add('blue-button');
        button.textContent = dir.name;
        button.addEventListener('click', () => {
          window.location.href = `../${dir.name}/`;
        });
        verseListContainer.appendChild(button);
      });
    })
    .catch(err => console.error('Error fetching repository contents:', err));
});
