const params = new URLSearchParams(window.location.search);
const verseParam = params.get('verse');

// Settings controls
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const settingsCloseButton = document.getElementById('settings-close');

const wordBankToggle = document.getElementById('word-bank-toggle');
const finishWordsToggle = document.getElementById('finish-words-toggle');
const skipGreenToggle = document.getElementById('skip-green-toggle');

const skipStrengthToggle = document.getElementById('skip-strength-toggle');
const skipStrengthValue = document.getElementById('skip-strength-value');

/*
 * Settings storage
 */

function getSetInitialWordBankStatus() {
  const storedState = localStorage.getItem('bankToggleIsChecked');

  if (storedState != null) {
    wordBankToggle.checked = storedState === 'true';
  }
}

function getSetInitialSkipGreenStatus() {
  const storedState = localStorage.getItem('skipGreenToggleIsChecked');

  if (storedState != null) {
    skipGreenToggle.checked = storedState === 'true';
  }
}

function setSkipGreenStoredState() {
  localStorage.setItem(
    'skipGreenToggleIsChecked',
    skipGreenToggle.checked.toString()
  );
}

function setWordBankStoredState() {
  localStorage.setItem(
    'bankToggleIsChecked',
    wordBankToggle.checked.toString()
  );
}

function getSetInitialFinishWordsStatus() {
  const storedState = localStorage.getItem('finishToggleIsChecked');

  if (storedState != null) {
    finishWordsToggle.checked = storedState === 'true';
  }
}

function setFinishWordsState() {
  localStorage.setItem(
    'finishToggleIsChecked',
    finishWordsToggle.checked.toString()
  );
}

function getSetInitialSkipStrengthStatus() {
  const storedToggle = localStorage.getItem('skipStrengthToggleIsChecked');
  const storedValue = localStorage.getItem('skipStrengthValue');

  if (storedToggle !== null) {
    skipStrengthToggle.checked = storedToggle === 'true';
  }

  if (storedValue !== null) {
    skipStrengthValue.value = storedValue;
  } else {
    skipStrengthValue.value = '3';
  }
}

function setSkipStrengthStoredState() {
  localStorage.setItem(
    'skipStrengthToggleIsChecked',
    skipStrengthToggle.checked.toString()
  );
}

function setSkipStrengthValueStoredState() {
  let value = Number.parseInt(skipStrengthValue.value, 10);

  if (Number.isNaN(value) || value < 0) {
    value = 3;
  }

  skipStrengthValue.value = value;

  localStorage.setItem('skipStrengthValue', value.toString());
}

function selectSkipStrengthValue() {
  skipStrengthValue.select();
}

/*
 * Settings modal
 */

function openSettingsModal() {
  settingsModal.classList.remove('hidden');
  document.body.classList.add('modal-open');

  settingsCloseButton.focus();
}

function closeSettingsModal() {
  settingsModal.classList.add('hidden');
  document.body.classList.remove('modal-open');

  settingsButton.focus();
}

function initSettingsModal() {
  // Only initialize when the settings UI exists on this page.
  if (!settingsButton || !settingsModal || !settingsCloseButton) {
    return;
  }

  settingsButton.addEventListener('click', openSettingsModal);

  settingsCloseButton.addEventListener('click', closeSettingsModal);

  // Clicking the dark area outside the settings box closes it.
  settingsModal.addEventListener('click', event => {
    if (event.target === settingsModal) {
      closeSettingsModal();
    }
  });

  // Escape closes the settings modal.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !settingsModal.classList.contains('hidden')) {
      closeSettingsModal();
    }
  });
}

/*
 * Initialize settings
 */

function initSettings() {
  if (wordBankToggle) {
    getSetInitialWordBankStatus();
    wordBankToggle.addEventListener('change', setWordBankStoredState);
  }

  if (finishWordsToggle) {
    getSetInitialFinishWordsStatus();
    finishWordsToggle.addEventListener('change', setFinishWordsState);
  }

  if (skipGreenToggle) {
    getSetInitialSkipGreenStatus();
    skipGreenToggle.addEventListener('change', setSkipGreenStoredState);
  }

  if (skipStrengthToggle && skipStrengthValue) {
    getSetInitialSkipStrengthStatus();

    skipStrengthToggle.addEventListener('change', setSkipStrengthStoredState);

    skipStrengthValue.addEventListener(
      'change',
      setSkipStrengthValueStoredState
    );

    skipStrengthValue.addEventListener('focus', selectSkipStrengthValue);
  }

  initSettingsModal();
}

initSettings();

/*
 * Load verse functionality only when a verse was selected.
 */

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

      return import('./scriptBuff.js?v=1.3');
    })
    .catch(err => {
      console.error('Error loading verse module:', err);
    });
}
