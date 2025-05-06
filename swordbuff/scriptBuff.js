const progressBar = document.getElementById('progress-bar');
const checkArea = document.getElementById('check-button-container');
const inputBox = document.getElementById('keyboard-input');
const wordBankContainer = document.getElementById('word-bank');
const answersContainer = document.getElementById('drop-line');
const checkResultsContainer = document.getElementById('feedback');
const newButton = document.createElement('button');
const wordBankToggle = document.getElementById('word-bank-toggle');

let verses = [];
let numVerses = 0;
let verseIndex = 0;
let wordButtonsEnabled = true;
let currentVerse;
let verseString;
let numIncorrect = 0;
let correctVerseArray = [];

function shuffleArray(array) {
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

function createWordBankButtons(wordArray) {
  const fragment = document.createDocumentFragment();
  const uniqueWords = new Set(wordArray);
  uniqueWords.forEach(word => {
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
    const chosenButton = e.target;
    let numCorrectButtons = answersContainer.children.length;
    const indexToCheck = numCorrectButtons;
    const isCorrect =
      correctVerseArray[indexToCheck] === chosenButton.textContent;

    if (isCorrect) {
      // give instant feedback for correct button
      chosenButton.classList.add('instant-green');
      void chosenButton.offsetWidth;
      chosenButton.classList.remove('instant-green');

      const copiedButton = chosenButton.cloneNode(true);
      copiedButton.classList.add('correct');
      answersContainer.appendChild(copiedButton);
      Array.from(wordBankContainer.children).forEach(button => {
        button.classList.remove('incorrect');
        button.classList.add('word-button');
      });
      numCorrectButtons = answersContainer.children.length;
    } else {
      numIncorrect += 1;
      chosenButton.classList.add('incorrect');
      chosenButton.classList.remove('word-button');
    }
    if (numCorrectButtons === correctVerseArray.length) celebrateDone();
    updateResetButton();
  }
}

function celebrateDone() {
  resetWordsInContainer(wordBankContainer);
  wordBankContainer.classList.add('celebrate');
  setTimeout(() => {
    wordBankContainer.classList.remove('celebrate');
  }, 5000);
  const percentageCorrect = getPercentageCorrect();
  const encouragements =
    percentageCorrect >= 60
      ? ['Awesome!', "You're incredible!", 'Great job!', 'Well done!']
      : [
          "You'll get it next time!",
          'Keep trying!',
          "Don't give up!",
          'Keep persevering!'
        ];

  const randomMsg =
    encouragements[Math.floor(Math.random() * encouragements.length)];

  wordBankContainer.innerHTML = `<span class="encouragement">${randomMsg}</span>`;
  wordButtonsEnabled = false;
  checkResultsContainer.innerHTML = getResultText(percentageCorrect);
}

function resetWordsInContainer(containerName) {
  while (containerName.firstChild) {
    containerName.removeChild(containerName.firstChild);
  }
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
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();

    let keyboardWord = inputBox.value.replace(/[^\w\s]/gi, '').toLowerCase();
    inputBox.value = '';
    let bankWordButtons = Array.from(
      wordBankContainer.querySelectorAll('button')
    );

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
  correctVerseArray = verseString.split(' ');
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

function getPercentageCorrect() {
  let numCorrect = 0;
  const totalWords = correctVerseArray.length;
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
  let memoryStrength;
  if (verseData) {
    if (!verseData.memoryStrength) {
      verseData.memoryStrength = verseData.repetitions;
    } // convert to memoryStrength if need be
    memoryStrength = verseData.memoryStrength ? verseData.memoryStrength : 0;
  } else {
    memoryStrength = 0;
  }
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
  let memoryStrength;
  if (verseData) {
    if (!verseData.memoryStrength) {
      verseData.memoryStrength = verseData.repetitions;
    } // convert to memoryStrength if need be
    memoryStrength = verseData.memoryStrength ? verseData.memoryStrength : 0;
  } else {
    memoryStrength = 0;
  }
  return `${percentageCorrect}% and a memory strength of ${memoryStrength}<br>Lets practice ${dueDate}`;
}

function showCorrectAnswer() {
  wordButtonsEnabled = false;
  const percentageCorrect = getPercentageCorrect();
  if (answersContainer.children.length > 0) {
    storeResults(percentageCorrect);
    checkResultsContainer.innerHTML = getResultText(percentageCorrect);
  } else {
    storeResults(0);
  }
  resetWordsInContainer(wordBankContainer);
  correctVerseArray.forEach(word => {
    const button = createButtonForWord(word);
    button.classList.add('correct');
    wordBankContainer.appendChild(button);
  });
  updateResetButton();
}

function getStoredRecord(storageKey) {
  let record = localStorage.getItem(storageKey);
  return record ? JSON.parse(record) : {};
}

function getPerfectInterval(memoryStrength) {
  if (memoryStrength < 0) return 0;
  if (memoryStrength === 0 || memoryStrength === 1) return 1;
  let interval =
    getPerfectInterval(memoryStrength - 2) +
    getPerfectInterval(memoryStrength - 3) +
    getPerfectInterval(memoryStrength - 4);
  interval = interval > 180 ? 180 : interval;
  return interval;
}

function getAdjustedInterval(memoryStrength, percent) {
  if (percent < 60) return 0;
  const curInterval = getPerfectInterval(memoryStrength);
  const lastInterval = getPerfectInterval(memoryStrength - 1);
  const m = curInterval - lastInterval;
  return Math.round(m * ((percent - 60) / 40) + lastInterval);
}

function updateTrainingRecord(record, percent) {
  // convert repetitions to memoryStrength
  if (record.memoryStrength === undefined || record.memoryStrength === null) {
    record.memoryStrength = record.repetitions || 0;
  }
  let interval = 1; // default to tomorrow for interval
  if (percent < 60) {
    record.memoryStrength -= record.memoryStrength > 0 ? 1 : 0;
  } else {
    record.memoryStrength += 1;
    interval = getAdjustedInterval(record.memoryStrength, percent);
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
  let todayStr = toLocalISODateString(today);

  let allVerseData = getStoredRecord(storageKey);
  let record = allVerseData[verseIndexKey] || {
    memoryStrength: 0,
    dueDate: todayStr,
    percentRight: 0
  };

  let dueDate = new Date(record.dueDate + 'T00:00:00');
  today = new Date(todayStr + 'T00:00:00');

  const isDueForReview = dueDate <= today;
  if (!isDueForReview && percent >= 60) {
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
  let RandomizedVerseArray = shuffleArray(verseString.split(' '));
  createWordBankButtons(RandomizedVerseArray);
  const nextButton = document.getElementById('next-button');
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
      (event.key === 'r' || event.key === 'R')
    ) {
      event.preventDefault();
      resetVerseContainers();
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

function getSetInitialWordBankStatus() {
  const storedState = localStorage.getItem('bankToggleIsChecked');
  if (storedState != null) {
    wordBankToggle.checked = storedState === 'true';
  }
  toggleWordBank();
}

function initEventListeners() {
  document.addEventListener('keydown', focusKeyboard);
  inputBox.addEventListener('keydown', keyboardMoveWords);
  wordBankContainer.addEventListener('click', moveCorrectWords);
  wordBankToggle.addEventListener('change', toggleWordBank);

  document.addEventListener('click', event => {
    if (event.target && event.target.id === 'prev-button') goToPrevVerse();
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
