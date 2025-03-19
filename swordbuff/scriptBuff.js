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
  }
}

function moveWordsDown(e) {
  if (e.target.classList.contains('word-button') && wordButtonsEnabled) {
    wordBankContainer.appendChild(e.target);
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

function nextOrDone() {
  if (verseIndex < numVerses - 1) {
    newButton.textContent = 'NEXT';
    newButton.id = 'next-button';
    checkArea.appendChild(newButton);
  } else {
    newButton.textContent = 'DONE';
    newButton.id = 'done';
    checkArea.appendChild(newButton);
    newButton.addEventListener('click', () => {
      location.reload();
    });
  }
}

function keyboardMoveWords(e) {
  if (
    (e.key === 'Backspace' || e.keyCode === 8) &&
    inputBox.value.trim() === ''
  ) {
    e.preventDefault(); // Prevent default backspace behavior (navigating back)

    // Get all buttons inside the answers container
    let dropLineButtons = answersContainer.querySelectorAll('button');

    // If there's at least one button, move the last one back to word bank
    if (dropLineButtons.length > 0) {
      let lastButton = dropLineButtons[dropLineButtons.length - 1]; // Get last button
      wordBankContainer.appendChild(lastButton); // Move it back
    }
  }

  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
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
  verseContainer.innerText = currentVerse.book;
  // + ' ' +
  // currentVerse.chapter +
  // ':' +
  // currentVerse.verse_start;
}

function setupNewVerse() {
  verseString = verses[(verseIndex += 1)].text;
  putVerseInHeader(verseIndex);
  verseString = verseString.replace(/^\d+:\s*/, '');
  originalVerseArray = verseString.split(' ');
  progressBar.value += 1;
  resetVerseContainers();
}

function checkUserInput() {
  wordButtonsEnabled = false;
  const droplineButtons = answersContainer.querySelectorAll('button');
  const selectedWordsButtons = Array.from(droplineButtons);
  const selectedWords = getSelectedWords(answersContainer);
  const correctVerse = getCorrectVerseWords(verseString);
  compareWordsAndUpdateButtons(
    selectedWordsButtons,
    selectedWords,
    correctVerse
  );
  resetWordsInContainer(wordBankContainer);
  createWordButtons(originalVerseArray);
  let correctButtons = [...wordBankContainer.children];
  correctButtons.forEach(x => x.classList.add('correct'));
  const percentageCorrect = getPercentageCorrect(selectedWords, correctVerse);
  checkResultsContainer.textContent = getResultText(percentageCorrect);
  document.getElementById('check').remove();
  nextOrDone();
}

function resetVerseContainers() {
  wordButtonsEnabled = true;
  resetWordsInContainer(wordBankContainer);
  resetWordsInContainer(answersContainer);
  resetWordsInContainer(checkResultsContainer);
  let verseArray = shuffle(verseString.split(' '));
  createWordButtons(verseArray);
  const nextButton = document.getElementById('next-button');
  if (nextButton) {
    nextButton.remove();
  }
  const checkButton = document.getElementById('check');
  if (!checkButton) {
    newButton.textContent = 'CHECK';
    newButton.id = 'check';
    checkArea.appendChild(newButton);
  }
}

function focusKeyboard(e) {
  const active = document.activeElement.id;
  const enterKey = e.key === 'Enter' || e.keyCode === 13;

  if (!enterKey && active !== inputBox) {
    inputBox.focus();
  }
}

function init() {
  data.verses.forEach(verseData => versesIntoArray(verseData));
  currentVerse = verses[verseIndex];
  verseString = currentVerse.text.replace(/^\d+:\s*/, '');
  originalVerseArray = verseString.split(' ');
  numVerses = Object.keys(verses).length;
  progressBar.max = numVerses;

  wordBankContainer.addEventListener('click', moveWordsUp);
  answersContainer.addEventListener('click', moveWordsDown);

  const resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', resetVerseContainers);

  document.addEventListener('click', event => {
    if (event.target && event.target.id === 'check') checkUserInput();
    else if (event.target && event.target.id === 'next-button') setupNewVerse();
  });

  document.addEventListener('keydown', focusKeyboard);

  putVerseInHeader(verseIndex);
  resetVerseContainers();
  setIdealHeight();
  inputBox.addEventListener('keydown', keyboardMoveWords);
}

init();
