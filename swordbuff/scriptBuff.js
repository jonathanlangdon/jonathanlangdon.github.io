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
let translation = '';
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

function moveWordsUp(e) {
  if (e.target.classList.contains('word-button') && wordButtonsEnabled) {
    answersContainer.appendChild(e.target);
    if (autoGrade) checkUserInput();
    updateResetButton();
  }
}

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
  let dueDate = verseData ? new Date(verseData.dueDate) : new Date();
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  let colorClass = 'score-green';
  if (dueDate < today) colorClass = 'score-red';
  else if (dueDate.getTime() === today.getTime()) colorClass = 'score-yellow';

  const circle = `<span class="score-circle ${colorClass}">${percent}</span>`;
  verseContainer.innerHTML = `${data.book} ${currentVerse.chapter}:${currentVerse.verse} ${data.translation} ${circle}`;
}

function goToPrevVerse() {
  if (verseIndex === 0) {
    return;
  } else {
    verseIndex -= 1;
    progressBar.value -= 1;
  }
  verseString = verses[verseIndex].text;
  putVerseInHeader(verseIndex);
  verseString = verseString.replace(/^\d+:\s*/, '');
  originalVerseArray = verseString.split(' ');
  resetVerseContainers();
}

function goToNextVerse() {
  addDoneButtonIfEnd();
  if (verseIndex === verses.length - 1) {
    progressBar.value += 1;
  } else {
    verseString = verses[(verseIndex += 1)].text;
    putVerseInHeader(verseIndex);
    verseString = verseString.replace(/^\d+:\s*/, '');
    originalVerseArray = verseString.split(' ');
    progressBar.value += 1;
    resetVerseContainers();
  }
}

function addDoneButtonIfEnd() {
  if (verseIndex == numVerses - 1) {
    document.getElementById('next-button').remove();
    newButton.textContent = 'DONE';
    newButton.id = 'done';
    document.getElementById('move-buttons').appendChild(newButton);
    newButton.addEventListener('click', () => {
      const baseUrl = window.location.origin + window.location.pathname;
      window.location.href = baseUrl;
    });
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

function getResultText(percentageCorrect) {
  const params = new URLSearchParams(window.location.search);
  const storageKey = params.get('verse'); // e.g., "psalm23"
  const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const verseData = storedData[verseIndex.toString()];
  const dueDate = verseData
    ? new Date(verseData.dueDate).toLocaleDateString()
    : 'tomorrow';
  const goodRecall = verseData ? verseData.repetitions : 0;
  return `${percentageCorrect}% correct with a run of ${goodRecall} previous recall${
    goodRecall == 1 ? '' : 's'
  }<br>Lets practice ${dueDate}`;
}

function showCorrectAnswer() {
  const selectedWords = getSelectedWords(answersContainer);
  const correctVerse = getCorrectVerseWords(verseString);
  wordButtonsEnabled = false;
  resetWordsInContainer(wordBankContainer);
  createWordButtons(originalVerseArray);
  let correctButtons = [...wordBankContainer.children];
  correctButtons.forEach(x => x.classList.add('correct'));
  const percentageCorrect = getPercentageCorrect(correctVerse);
  if (answersContainer.children.length > 0) {
    checkResultsContainer.innerHTML = getResultText(percentageCorrect);
    storeResults(percentageCorrect);
  } else {
    storeResults(0);
  }
  updateResetButton();
}
function getStoredRecord(storageKey) {
  let record = localStorage.getItem(storageKey);
  return record ? JSON.parse(record) : {};
}

function updateSM2(record, quality) {
  if (quality < 1) {
    record.repetitions = 0;
    record.interval = 1;
  } else {
    record.repetitions++;
    if (record.repetitions < 3) {
      record.interval = 1;
    } else {
      record.interval = Math.round(record.interval * record.ef);
    }
  }

  record.ef = record.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (record.ef < 1.3) record.ef = 1.3;

  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + record.interval);
  nextDue.setHours(0, 0, 0, 0);
  record.dueDate = nextDue.toISOString();

  return record;
}

function storeResults(percentageCorrect) {
  const params = new URLSearchParams(window.location.search);
  const storageKey = params.get('verse'); // e.g., "psalm23"
  const verseIndexKey = verseIndex.toString(); // e.g., "0", "1", etc.
  let tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);

  let allVerseData = getStoredRecord(storageKey);
  let record = allVerseData[verseIndexKey] || {
    repetitions: 0,
    interval: 0,
    ef: 2.5,
    dueDate: tomorrow.toISOString(),
    percentRight: 0
  };

  let today = new Date();
  today.setHours(0, 0, 0, 0);
  const isDueForReview = record => new Date(record.dueDate) <= today;

  if (!isDueForReview(record)) {
    record.percentRight = percentageCorrect;
  } else {
    const quality =
      percentageCorrect < 60
        ? 0
        : Math.round(((percentageCorrect - 60) / 40) * 6);

    record = updateSM2(record, quality);
    record.percentRight = percentageCorrect;
  }

  allVerseData[verseIndexKey] = record;
  localStorage.setItem(storageKey, JSON.stringify(allVerseData));
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
  autoGrade = autoGradeToggle.checked ? true : false;
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
}

function init() {
  data.verses.forEach(verseData => verses.push(verseData));
  currentVerse = verses[verseIndex];
  verseString = currentVerse.text.replace(/^\d+:\s*/, '');
  originalVerseArray = verseString.split(' ');
  numVerses = Object.keys(verses).length;
  progressBar.max = numVerses;

  document.addEventListener('keydown', focusKeyboard);
  inputBox.addEventListener('keydown', keyboardMoveWords);

  wordBankContainer.addEventListener('click', moveWordsUp);
  answersContainer.addEventListener('click', moveWordsDown);
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

  putVerseInHeader(verseIndex);
  resetVerseContainers();
  setIdealHeight();
  addShortcutListeners();
  getSetInitialWordBankStatus();
  getSetInitialAutoGradeStatus();
}

init();
