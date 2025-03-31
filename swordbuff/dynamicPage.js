const params = new URLSearchParams(window.location.search);
const verseParam = params.get('verse');
const wordBankToggle = document.getElementById('word-bank-toggle');
const autoGradeToggle = document.getElementById('auto-grade-toggle');

function getSetInitialWordBankStatus() {
  const storedState = localStorage.getItem('bankToggleIsChecked');
  if (storedState != null) {
    wordBankToggle.checked = storedState === 'true';
  }
}

function getSetInitialAutoGradeStatus() {
  const storedState = localStorage.getItem('autoGrade');
  if (storedState != null) {
    autoGradeToggle.checked = storedState === 'true';
  }
}

function setWordBankStoredState() {
  localStorage.setItem('bankToggleIsChecked', wordBankToggle.checked);
}

function setAutoGradeStoredState() {
  localStorage.setItem('autoGrade', autoGradeToggle.checked);
}

if (verseParam) {
  document.getElementById('progress-bar').style.display = 'block';
  document.getElementById('word-bank').style.display = 'block';
  document.getElementById('footer').style.display = 'block';
  document.getElementById('user-select').style.display = 'none';
  document.getElementById('verse-list').style.display = 'none';

  const verseFile = `./verses/${verseParam}.js?v=1.0`;
  import(verseFile)
    .then(module => {
      window.data = module.data;
      import('./scriptBuff.js?v=1.1');
    })
    .catch(err => {
      console.error('Error loading verse module:', err);
    });
}

function init() {
  getSetInitialWordBankStatus();
  getSetInitialAutoGradeStatus();
  wordBankToggle.addEventListener('change', setWordBankStoredState);
  autoGradeToggle.addEventListener('change', setAutoGradeStoredState);
}

init();
