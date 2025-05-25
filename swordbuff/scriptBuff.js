const progressBar = document.getElementById('progress-bar');
const inputBox = document.getElementById('keyboard-input');
const wordBankContainer = document.getElementById('word-bank');
const answersContainer = document.getElementById('drop-line');
const checkResultsContainer = document.getElementById('feedback');
const newButton = document.createElement('button');
const wordBankToggle = document.getElementById('word-bank-toggle');
const finishWordsToggle = document.getElementById('finish-words-toggle');

let verses = [];
let verseIndex = 0;
let wordButtonsEnabled = true;
let verseString;
let numIncorrect = 0;
let correctVerseArray = [];
let hasStartedVerse = false;

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
    if (!wordBankToggle.checked) {
      e.target.classList.remove('hidden');
    }
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
        if (!wordBankToggle.checked) {
          button.classList.add('hidden');
        }
      });
      numCorrectButtons = answersContainer.children.length;
      if (finishWordsToggle.checked) {
        if (isWordUsedUp(chosenButton.textContent)) {
          chosenButton.classList.add('finished-word');
          chosenButton.classList.remove('word-button');
        }
      }
      answersContainer.scrollTop = answersContainer.scrollHeight;
    } else {
      numIncorrect += 1;
      chosenButton.classList.add('incorrect');
      chosenButton.classList.remove('word-button');
    }
    if (numCorrectButtons === correctVerseArray.length) {
      celebrateDone();
      const percentageCorrect = getPercentageCorrect();
      if (answersContainer.children.length > 0) {
        storeResults(percentageCorrect);
      } else {
        storeResults(0);
      }
      checkResultsContainer.innerHTML = getResultText(percentageCorrect);
    }
    hasStartedVerse = true;
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
  const answerOuterContainer = document.getElementById('drop-area');
  const headerHeight = document.querySelector('header').offsetHeight;
  const footerHeight = document.getElementById('footer').offsetHeight;
  const windowHeight = window.innerHeight;
  const setWordBankHeight =
    (windowHeight - headerHeight - footerHeight - 85) / 2;
  if (window.innerWidth > 800) {
    wordBankContainer.style.height = '200px';
    answerOuterContainer.style.height = '250px';
  } else {
    wordBankContainer.style.height = `${setWordBankHeight}px`;
    answerOuterContainer.style.height = `${setWordBankHeight}px`;
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
  let currentVerse = verses[verseIndex];

  const params = new URLSearchParams(window.location.search);
  const storageKey = params.get('verse'); // e.g., "psalm23"
  const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const verseData = storedData[verseIndex.toString()];

  let percent = verseData ? verseData.percentRight : 0;

  let now = new Date();
  let todayStr = toLocalISODateString(now);
  let yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  let yesterdayStr = toLocalISODateString(yesterday);

  let dueDateStr = verseData ? verseData.dueDate : todayStr;
  let dueDate = new Date(dueDateStr + 'T00:00:00');
  let today = new Date(todayStr + 'T00:00:00');
  yesterday = new Date(yesterdayStr + 'T00:00:00');
  console.log(
    `verseHeader: ${storageKey} has dueDate of ${dueDate} and today is ${today}`
  );
  let colorClass = 'score-yellow';
  if (dueDate < yesterday) colorClass = 'score-red';
  else if (percent < 60) colorClass = 'score-yellow';
  else if (dueDate === today || dueDate === yesterday)
    colorClass = 'score-yellow';
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
  if (verseIndex === verses.length - 1) progressBar.value -= 1;
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
  console.log(
    `initial stats: ${storageKey}... today is ${todayStr}, tomorrow is ${tomorrowStr}, dueDate is ${dueDate}`
  );
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
  return `Current Memory Strength: ${memoryStrength}<br>Next refresh Date: ${dueDate}`;
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
  console.log(
    `getResultText: today is ${todayStr}, tomorrow: ${tomorrowStr}, dueDate: ${dueDate}`
  );
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

function getStorageKey() {
  const params = new URLSearchParams(window.location.search);
  return params.get('verse'); // e.g., "psalm23"
}

function getAllVerseData() {
  let storageKey = getStorageKey();
  return getStoredRecord(storageKey);
}

function getRecordForCurrentVerse() {
  const verseIndexKey = verseIndex.toString(); // e.g., "0", "1", etc.
  let today = new Date();
  let todayStr = toLocalISODateString(today);
  let allVerseData = getAllVerseData();
  let record = allVerseData[verseIndexKey] || {
    memoryStrength: 0,
    dueDate: todayStr,
    percentRight: 0
  };
  return record;
}

function showCorrectVerse() {
  wordButtonsEnabled = false;
  let record = getRecordForCurrentVerse();
  let memoryStrength = record.memoryStrength ? record.memoryStrength : 0;
  if (memoryStrength > 2) {
    storeResults(0); //sets tomorrow as dueDate due to failure in knowing verse (also decreases memoryStrength)
  }
  resetWordsInContainer(wordBankContainer);
  correctVerseArray.forEach(word => {
    const button = createButtonForWord(word);
    button.classList.add('correct');
    wordBankContainer.appendChild(button);
  });
  hasStartedVerse = true;
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
    // interval will be tomorrow by default
  } else {
    record.memoryStrength += 1;
    interval = getAdjustedInterval(record.memoryStrength, percent);
  }
  const nextDue = new Date(); // default nextDue is today
  nextDue.setDate(nextDue.getDate() + interval);
  record.dueDate = toLocalISODateString(nextDue);
  console.log(`updateTrainingRecord: setting dueDate to ${record.dueDate}`);
  record.percentRight = percent;
  return record;
}

function storeResults(percent) {
  let record = getRecordForCurrentVerse();
  let dueDate = new Date(record.dueDate + 'T00:00:00');
  let today = new Date();
  let todayStr = toLocalISODateString(today);
  let allVerseData = getAllVerseData();
  let storageKey = getStorageKey();
  const verseIndexKey = verseIndex.toString(); // e.g., "0", "1", etc.
  const isDueForReview = dueDate <= today;
  today = new Date(todayStr + 'T00:00:00');
  console.log(
    `determining dueForReview: today: ${today}, dueDate: ${dueDate}, thus, ${isDueForReview} that its due`
  );
  if (!isDueForReview && percent >= 60) {
    record.percentRight = percent;
  } else {
    record = updateTrainingRecord(record, percent); // also updates memoryStrength
  }
  if (record.memoryStrength === 0 && percent < 60) {
    // do not update record if trying for first time and fails
  } else {
    allVerseData[verseIndexKey] = record;
    localStorage.setItem(storageKey, JSON.stringify(allVerseData));
  }
  putVerseInHeader(verseIndex);
}

function resetVerseContainers() {
  wordButtonsEnabled = true;
  hasStartedVerse = false;
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
  if (hasStartedVerse) {
    resetButton.textContent = 'RESET';
    resetButton.className = 'red-button';
    resetButton.onclick = resetVerseContainers;
  } else {
    resetButton.textContent = 'SHOW VERSE';
    resetButton.className = 'blue-button';
    resetButton.onclick = showCorrectVerse;
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

function isWordUsedUp(wordBeingChecked) {
  let wordUsedCount = 0;
  let numWordMatchesInVerse = 0;
  Array.from(answersContainer.children).forEach(answerWord => {
    if (answerWord.textContent === wordBeingChecked) wordUsedCount += 1;
  });
  const correctVerseWords = verseString.split(' ');
  correctVerseWords.forEach(verseWord => {
    if (verseWord === wordBeingChecked) numWordMatchesInVerse += 1;
  });
  return wordUsedCount === numWordMatchesInVerse ? true : false;
}

function toggleFinishWords() {
  Array.from(wordBankContainer.children).forEach(button => {
    if (finishWordsToggle.checked && isWordUsedUp(button.textContent)) {
      button.classList.add('finished-word');
      button.classList.remove('word-button');
    } else {
      button.classList.remove('finished-word');
      button.classList.add('word-button');
    }
  });
}

function initEventListeners() {
  document.addEventListener('keydown', focusKeyboard);
  inputBox.addEventListener('keydown', keyboardMoveWords);
  wordBankContainer.addEventListener('click', moveCorrectWords);
  wordBankToggle.addEventListener('change', toggleWordBank);
  finishWordsToggle.addEventListener('change', toggleFinishWords);

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
  progressBar.max = Object.keys(verses).length; // number of verses
  initEventListeners();
  resetVerseContainers();
  setIdealHeight();
  addShortcutListeners();
  getSetInitialWordBankStatus();
}

// only auto‐run in the real browser (not during testing)
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
