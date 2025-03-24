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
      const listElement = document.createElement('ul');

      directories.forEach(dir => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `./${dir.name}/`;
        link.textContent = dir.name;
        listItem.appendChild(link);
        listElement.appendChild(listItem);
      });

      verseListContainer.appendChild(listElement);
    })
    .catch(err => console.error('Error fetching repository contents:', err));
});
