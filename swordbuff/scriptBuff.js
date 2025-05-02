const progressBar = document.getElementById('progress-bar');
const checkArea = document.getElementById('check-button-container');
const inputBox = document.getElementById('keyboard-input');
const wordBankContainer = document.getElementById('word-bank');
const answersContainer = document.getElementById('drop-line');
const checkResultsContainer = document.getElementById('feedback');
const newButton = document.createElement('button');
const wordBankToggle = document.getElementById('word-bank-toggle');
const autoGradeToggle = document.getElementById('auto-grade-toggle');

let verses = [];
let numVerses = 0;
let verseIndex = 0;
let wordButtonsEnabled = true;
let currentVerse;
let verseString;
let originalVerseArray;
let numIncorrect = 0;
let autoGrade = true;

function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function createWordButtons(whichArray) {
  const fragment = document.createDocumentFragment();
  whichArray.forEach(word => {
    const button = createButtonForWord(word);
    fragment.appendChild(button);
  });
  wordBankContainer.appendChild(fragment);
}

function createButtonForWord(word) {
  const button = document.createElement('button');
  button.textContent = word;
  button.id = `button-${word}`;
  button.classList.add('word-button');
  button.dataset.word = word;
  return button;
}

function moveCorrectWords(e) {
  if (e.target.classList.contains('word-button') && wordButtonsEnabled) {
    answersContainer.appendChild(e.target);
    if (autoGrade) checkUserInput();
    updateResetButton();
  }
  if (e.target.classList.contains('correct'))
    e.target.classList.remove('word-button');
}

// remove this
function moveWordsDown(e) {
  if (e.target.classList.contains('word-button') && wordButtonsEnabled) {
    e.target.classList.remove('incorrect');
    e.target.classList.remove('correct');
    wordBankContainer.appendChild(e.target);
    updateResetButton();
  }
}

function resetWordsInContainer(containerName) {
  while (containerName.firstChild) {
    containerName.removeChild(containerName.firstChild);
  }
}

function getSelectedWords(answersContainer) {
  const dropLineButtons = answersContainer.querySelectorAll('button');
  const selectedWordsButtons = Array.from(dropLineButtons);
  return selectedWordsButtons.map(button =>
    button.dataset.word.replace(/[^\w\s]/gi, '').toLowerCase()
  );
}

function getCorrectVerseWords(verseString) {
  return verseString
    .replace(/[^\w\s]/gi, '')
    .toLowerCase()
    .split(' ');
}

function toLocalISODateString(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    .toISOString()
    .split('T')[0];
}

function setIdealHeight() {
  const answerContainer = document.getElementById('drop-area');
  const headerHeight = document.querySelector('header').offsetHeight;
  const footerHeight = document.getElementById('footer').offsetHeight;
  const windowHeight = window.innerHeight;
  const setWordBankHeight =
    (windowHeight - headerHeight - footerHeight - 85) / 2;
  if (window.innerWidth > 800) {
    wordBankContainer.style.height = '200px';
    answerContainer.style.height = '250px';
  } else {
    wordBankContainer.style.height = `${setWordBankHeight}px`;
    answerContainer.style.height = `${setWordBankHeight}px`;
  }
}

function keyboardMoveWords(e) {
  if (
    (e.key === 'Backspace' || e.keyCode === 8) &&
    inputBox.value.trim() === ''
  ) {
    e.preventDefault();
    let dropLineButtons = answersContainer.querySelectorAll('button');
    if (dropLineButtons.length > 0) {
      const lastButton = dropLineButtons[dropLineButtons.length - 1];
      const syntheticEvent = { target: lastButton };
      moveWordsDown(syntheticEvent);
    }
  }

  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    if ((e.key === 'Enter') & (wordBankContainer.children.length == 0)) {
      checkUserInput();
    }

    let keyboardWord = inputBox.value.replace(/[^\w\s]/gi, '').toLowerCase();
    inputBox.value = '';
    let bankWordButtons = Array.from(
      wordBankContainer.querySelectorAll('button')
    );
    if (bankWordButtons.length === 0) checkUserInput();

    bankWordButtons.some(button => {
      let buttonWord = button.textContent
        .replace(/[^\w\s]/gi, '')
        .toLowerCase();
      if (keyboardWord === buttonWord) {
        button.click();
        return true; // Stop loop when the first match is found
      }
      return false; // Continue loop
    });
  }
}

function putVerseInHeader(verseIndex) {
  const verseContainer = document.getElementById('verse');
  currentVerse = verses[verseIndex];

  const params = new URLSearchParams(window.location.search);
  const storageKey = params.get('verse'); // e.g., "psalm23"
  const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const verseData = storedData[verseIndex.toString()];

  let percent = verseData ? verseData.percentRight : 0;

  let now = new Date();
  let todayStr = toLocalISODateString(now);

  let dueDateStr = verseData ? verseData.dueDate : todayStr;
  let dueDate = new Date(dueDateStr + 'T00:00:00');
  let today = new Date(todayStr + 'T00:00:00');

  let colorClass = 'score-yellow';
  if (dueDate < today) colorClass = 'score-red';
  else if (percent < 60) colorClass = 'score-yellow';
  else if (dueDate === today) colorClass = 'score-yellow';
  else if (dueDate > today) colorClass = 'score-green';

  const circle = `<span class="score-circle ${colorClass}">${percent}</span>`;
  verseContainer.innerHTML = `${data.book} ${currentVerse.chapter}:${currentVerse.verse} ${data.translation} ${circle}`;
}

function setupVerseWords(verseString) {
  putVerseInHeader(verseIndex);
  verseString = verseString.replace(/^\d+:\s*/, '');
  originalVerseArray = verseString.split(' ');
}

function addDoneButton() {
  document.getElementById('next-button').remove();
  newButton.textContent = 'DONE';
  newButton.id = 'done';
  document.getElementById('move-buttons').appendChild(newButton);
  newButton.addEventListener('click', () => {
    const baseUrl = window.location.origin + window.location.pathname;
    window.location.href = baseUrl;
  });
}

function removeDoneButton() {
  const doneButton = document.getElementById('done');
  if (doneButton) {
    doneButton.remove();
  }
}

function addNextButton() {
  const existingNext = document.getElementById('next-button');
  const moveButtons = document.getElementById('move-buttons');
  if (!existingNext) {
    const nextButton = document.createElement('button');
    nextButton.id = 'next-button';
    nextButton.textContent = 'NEXT';
    nextButton.classList = 'blue-button';
    moveButtons.appendChild(nextButton);
  }
}

function goToPrevVerse() {
  if (verseIndex === 0) {
    return;
  } else {
    verseIndex -= 1;
    progressBar.value -= 1;
  }
  removeDoneButton();
  addNextButton();
  verseString = verses[verseIndex].text;
  setupVerseWords(verseString);
  resetVerseContainers();
}

function goToNextVerse() {
  if (verseIndex === verses.length - 1) {
    addDoneButton();
    progressBar.value += 1;
  } else {
    verseString = verses[(verseIndex += 1)].text;
    setupVerseWords(verseString);
    progressBar.value += 1;
    resetVerseContainers();
  }
}

function checkUserInput() {
  const droplineButtons = answersContainer.querySelectorAll('button');
  const selectedWordsButtons = Array.from(droplineButtons);
  const selectedWords = getSelectedWords(answersContainer);
  const correctVerse = getCorrectVerseWords(verseString);
  compareWordsAndUpdateButtons(
    selectedWordsButtons,
    selectedWords,
    correctVerse
  );
  if (wordBankContainer.children.length == 0) showCorrectAnswer();
  updateResetButton();
}

function updateButtonClasses(button, isSelectedWordCorrect) {
  if (isSelectedWordCorrect) {
    button.classList.add('correct');
    button.classList.remove('incorrect');
  } else {
    button.classList.add('incorrect');
    button.classList.remove('correct');
    numIncorrect += 1;
  }
}

function compareWordsAndUpdateButtons(
  selectedWordsButtons,
  selectedWords,
  correctVerse
) {
  selectedWordsButtons.forEach((button, i) => {
    const isSelectedWordCorrect = selectedWords[i] === correctVerse[i];
    updateButtonClasses(button, isSelectedWordCorrect);
  });
}

function getPercentageCorrect(correctVerse) {
  let numCorrect = 0;
  const totalWords = correctVerse.length;
  if (numIncorrect < totalWords) numCorrect = totalWords - numIncorrect;
  return Math.round((numCorrect / totalWords) * 100);
}

function getInitialStats() {
  const params = new URLSearchParams(window.location.search);
  const storageKey = params.get('verse'); // e.g., "psalm23"
  const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const verseData = storedData[verseIndex.toString()];
  let today = new Date();
  let tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  let todayStr = toLocalISODateString(today);
  let tomorrowStr = toLocalISODateString(tomorrow);
  let dueDate = verseData ? verseData.dueDate : todayStr;
  if (dueDate === todayStr) dueDate = 'today';
  else if (dueDate === tomorrowStr) dueDate = 'tomorrow';
  const memoryStrength = verseData ? verseData.repetitions : 0;
  return `Current Memory Strength: ${memoryStrength}<br>Due Date: ${dueDate}`;
}

function getResultText(percentageCorrect) {
  const params = new URLSearchParams(window.location.search);
  const storageKey = params.get('verse'); // e.g., "psalm23"
  const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const verseData = storedData[verseIndex.toString()];
  let today = new Date();
  let tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  let todayStr = toLocalISODateString(today);
  let tomorrowStr = toLocalISODateString(tomorrow);
  let dueDate = verseData ? verseData.dueDate : todayStr;
  if (percentageCorrect < 60) dueDate = 'again!';
  else if (dueDate === todayStr) dueDate = 'again today';
  else if (dueDate === tomorrowStr) dueDate = 'again tomorrow';
  const memoryStrength = verseData ? verseData.repetitions : 0;
  return `${percentageCorrect}% and a memory strength of ${memoryStrength}<br>Lets practice ${dueDate}`;
}

// may not need after removing auto-check
function showCorrectWordBank() {
  resetWordsInContainer(wordBankContainer);
  createWordButtons(originalVerseArray);
  let correctButtons = [...wordBankContainer.children];
  correctButtons.forEach(x => x.classList.add('correct'));
}

function showCorrectAnswer() {
  const selectedWords = getSelectedWords(answersContainer);
  const correctVerse = getCorrectVerseWords(verseString);
  wordButtonsEnabled = false;
  if (numIncorrect !== 0) showCorrectWordBank();
  const percentageCorrect = getPercentageCorrect(correctVerse);
  if (answersContainer.children.length > 0) {
    storeResults(percentageCorrect);
    checkResultsContainer.innerHTML = getResultText(percentageCorrect);
  } else {
    storeResults(0);
  }
  updateResetButton();
}

function getStoredRecord(storageKey) {
  let record = localStorage.getItem(storageKey);
  return record ? JSON.parse(record) : {};
}

function getPerfectInterval(reps) {
  if (reps < -1) return 0;
  if (reps == 0 || reps == 1) return 1;
  let interval =
    getPerfectInterval(reps - 2) +
    getPerfectInterval(reps - 3) +
    getPerfectInterval(reps - 4);
  interval = interval > 180 ? 180 : interval;
  return interval;
}

function getAdjustedInterval(reps, percent) {
  if (percent < 60) return 0;
  const curInterval = getPerfectInterval(reps);
  const lastInterval = getPerfectInterval(reps - 1);
  const m = curInterval - lastInterval;
  return Math.round(m * ((percent - 60) / 40) + lastInterval);
}

function updateTrainingRecord(record, percent) {
  let interval = 1; // default to tomorrow for interval
  if (percent < 60) {
    record.repetitions -= 1;
    if (record.repetitions < 0) record.repetitions = 0;
    // TODO show freshness strength decrease modal
  } else {
    record.repetitions += 1;
    interval = getAdjustedInterval(record.repetitions, percent);
  }
  const nextDue = new Date(); // default nextDue is today
  nextDue.setDate(nextDue.getDate() + interval);
  record.dueDate = toLocalISODateString(nextDue);
  record.percentRight = percent;
  return record;
}

function storeResults(percent) {
  const params = new URLSearchParams(window.location.search);
  const storageKey = params.get('verse'); // e.g., "psalm23"
  const verseIndexKey = verseIndex.toString(); // e.g., "0", "1", etc.
  let today = new Date();

  let allVerseData = getStoredRecord(storageKey);
  let record = allVerseData[verseIndexKey] || {
    repetitions: 0,
    dueDate: toLocalISODateString(today),
    percentRight: 0
  };

  const isDueForReview = record => new Date(record.dueDate) <= today;

  if (!isDueForReview(record) && percent >= 60) {
    record.percentRight = percent;
  } else {
    record = updateTrainingRecord(record, percent);
    record.percentRight = percent;
  }

  allVerseData[verseIndexKey] = record;
  localStorage.setItem(storageKey, JSON.stringify(allVerseData));
  putVerseInHeader(verseIndex);
}

function resetVerseContainers() {
  wordButtonsEnabled = true;
  resetWordsInContainer(wordBankContainer);
  resetWordsInContainer(answersContainer);
  resetWordsInContainer(checkResultsContainer);
  let verseArray = shuffle(verseString.split(' '));
  createWordButtons(verseArray);
  const nextButton = document.getElementById('next-button');
  const checkButton = document.getElementById('check');
  if (!checkButton) {
    newButton.textContent = 'CHECK';
    newButton.id = 'check';
    checkArea.appendChild(newButton);
  }
  updateResetButton();
  toggleWordBank();
  checkResultsContainer.innerHTML = getInitialStats();
  numIncorrect = 0;
}

function updateResetButton() {
  const resetButton = document.getElementById('reset-show');
  if (
    answersContainer.children.length > 0 ||
    wordBankContainer.children[0].classList.contains('correct')
  ) {
    resetButton.textContent = 'RESET';
    resetButton.className = 'red-button';
    resetButton.onclick = resetVerseContainers;
  } else {
    resetButton.textContent = 'SHOW VERSE';
    resetButton.className = 'blue-button';
    resetButton.onclick = showCorrectAnswer;
  }
}

function addShortcutListeners() {
  document.addEventListener('keydown', function (event) {
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === 'c' || event.key === 'C')
    ) {
      event.preventDefault();
      checkUserInput();
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === 'r' || event.key === 'R')
    ) {
      event.preventDefault();
      resetVerseContainers();
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === 's' || event.key === 'S')
    ) {
      event.preventDefault();
      showCorrectAnswer();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowLeft') {
      event.preventDefault();
      document.getElementById('prev-button').click();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowRight') {
      event.preventDefault();
      document.getElementById('next-button').click();
    }
  });
}

function focusKeyboard() {
  inputBox.focus();
}

function toggleWordBank() {
  Array.from(wordBankContainer.children).forEach(button => {
    if (wordBankToggle.checked) {
      button.classList.remove('hidden');
    } else {
      button.classList.add('hidden');
    }
  });
}

function toggleAutoGrade() {
  autoGrade = autoGradeToggle.checked;

  const checkButton = document.getElementById('check');
  if (checkButton) {
    checkButton.style.display = autoGrade ? 'none' : '';
  }
}

function getSetInitialWordBankStatus() {
  const storedState = localStorage.getItem('bankToggleIsChecked');
  if (storedState != null) {
    wordBankToggle.checked = storedState === 'true';
  }
  toggleWordBank();
}

function getSetInitialAutoGradeStatus() {
  const storedState = localStorage.getItem('autoGrade');
  if (storedState != null) {
    wordBankToggle.checked = storedState === 'true';
  }
  autoGrade = autoGradeToggle.checked ? true : false;
  toggleAutoGrade();
}

function initEventListeners() {
  document.addEventListener('keydown', focusKeyboard);
  inputBox.addEventListener('keydown', keyboardMoveWords);
  wordBankContainer.addEventListener('click', moveCorrectWords);
  answersContainer.addEventListener('click', moveWordsDown); // remove
  wordBankToggle.addEventListener('change', toggleWordBank);
  autoGradeToggle.addEventListener('change', toggleAutoGrade);

  document.addEventListener('click', event => {
    if (event.target && event.target.id === 'check') checkUserInput();
    else if (event.target && event.target.id === 'prev-button') goToPrevVerse();
    else if (event.target && event.target.id === 'next-button') goToNextVerse();
  });

  document
    .getElementById('reset-show')
    .addEventListener('click', updateResetButton);
}

function init() {
  data.verses.forEach(verseData => verses.push(verseData));
  verseString = verses[verseIndex].text;
  setupVerseWords(verseString);
  numVerses = Object.keys(verses).length;
  progressBar.max = numVerses;
  initEventListeners();
  resetVerseContainers();
  setIdealHeight();
  addShortcutListeners();
  getSetInitialWordBankStatus();
  getSetInitialAutoGradeStatus();
}

// only auto‐run in the real browser where `data` is defined
if (
  typeof window !== 'undefined' &&
  typeof document !== 'undefined' &&
  typeof data !== 'undefined'
) {
  try {
    init();
  } catch (err) {
    console.error('Init error:', err);
  }
}

export { getPerfectInterval, getAdjustedInterval, getResultText };
