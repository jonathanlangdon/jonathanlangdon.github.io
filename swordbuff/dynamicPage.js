const params = new URLSearchParams(window.location.search);
const verseParam = params.get('verse');

if (verseParam) {
  document.getElementById('progress-bar').style.display = 'block';
  document.getElementById('word-bank').style.display = 'block';
  document.getElementById('footer').style.display = 'block';
  document.getElementById('verse-list').style.display = 'none';

  const verseFile = `./verses/${verseParam}.js?v=1.0`;
  import(verseFile)
    .then(module => {
      window.data = module.data;
      import('./scriptBuff.js?v=1.0');
    })
    .catch(err => {
      console.error('Error loading verse module:', err);
    });
}
