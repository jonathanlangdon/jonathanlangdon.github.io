const progressBar = document.getElementById('progress-bar');
const checkArea = document.getElementById('check-button-container');
const inputBox = document.getElementById('keyboard-input');
const wordBankContainer = document.getElementById('word-bank');
const answersContainer = document.getElementById('drop-line');
const checkResultsContainer = document.getElementById('feedback');
const newButton = document.createElement('button');

let verses = [];
let numVerses = 0;
let verseIndex = 0;
let wordButtonsEnabled = true;
let currentVerse;
let verseString;
let originalVerseArray;

function versesIntoArray(verseData) {
  const text = verseData.text;
  const match = text.match(/(\d+):(.+?)(?=\s\d|"$)/g);
  if (match) {
    match.forEach(function (verseString) {
      const verseNum = parseInt(verseString.match(/\d+/)[0], 10);
      const verse = {
        book: verseData.book,
        chapter: verseData.chapter,
        text: verseString,
        verse_start: verseNum,
        verse_end: verseNum
      };
      verses.push(verse);
    });
  } else {
    verses.push(verseData);
  }
}

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

function updateButtonClasses(button, isSelectedWordCorrect) {
  if (isSelectedWordCorrect) {
    button.classList.add('correct');
    button.classList.remove('incorrect');
  } else {
    button.classList.add('incorrect');
    button.classList.remove('correct');
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

function getPercentageCorrect(selectedWords, correctVerse) {
  const wordsGood = selectedWords.reduce(
    (acc, word, i) => acc + (correctVerse[i] === word ? 1 : 0),
    0
  );
  const totalWords = correctVerse.length;
  return Math.round((wordsGood / totalWords) * 100);
}

function getResultText(percentageCorrect) {
  if (percentageCorrect >= 60) {
    return `Great work! You got ${percentageCorrect}% correct!`;
  }
  return `You got ${percentageCorrect}% correct. Want to try it again?`;
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
  verseContainer.innerText =
    currentVerse.book +
    ' ' +
    currentVerse.chapter +
    ':' +
    currentVerse.verse_start;
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
      location.reload();
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

function showCorrectAnswer() {
  const selectedWords = getSelectedWords(answersContainer);
  const correctVerse = getCorrectVerseWords(verseString);
  wordButtonsEnabled = false;
  resetWordsInContainer(wordBankContainer);
  createWordButtons(originalVerseArray);
  let correctButtons = [...wordBankContainer.children];
  correctButtons.forEach(x => x.classList.add('correct'));
  if (answersContainer.children.length > 0) {
    const percentageCorrect = getPercentageCorrect(selectedWords, correctVerse);
    checkResultsContainer.textContent = getResultText(percentageCorrect);
  }
  updateResetButton();
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

function init() {
  data.verses.forEach(verseData => versesIntoArray(verseData));
  currentVerse = verses[verseIndex];
  verseString = currentVerse.text.replace(/^\d+:\s*/, '');
  originalVerseArray = verseString.split(' ');
  numVerses = Object.keys(verses).length;
  progressBar.max = numVerses;

  document.addEventListener('keydown', focusKeyboard);
  inputBox.addEventListener('keydown', keyboardMoveWords);

  wordBankContainer.addEventListener('click', moveWordsUp);
  answersContainer.addEventListener('click', moveWordsDown);

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
}

init();
