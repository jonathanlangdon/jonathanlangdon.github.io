async function fetchGitHubRepos() {
  try {
    const response = await fetch(
      'https://api.github.com/users/jonathanlangdon/repos'
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    throw error;
  }
}

fetchGitHubRepos()
  .then(repo => {
    challengeCount = repo.find(r => r.name === 'chatGPT_challenges').size;
    document.getElementById(
      'chatGPTRepoCount'
    ).innerText = `Repository of ${challengeCount} challenges`;
  })
  .catch(error => {
    document.getElementById(
      'chatGPTRepoCount'
    ).innerText = `Repository of ChatGPT challenges`;
    console.log('Error fetching GitHub data');
  });
