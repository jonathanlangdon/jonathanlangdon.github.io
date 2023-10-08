// Initially this was set up on a website with a MySQL server... but for the purposes of demonstration, I'm replacing the SQL database with a simple object

// $.get('http://192.168.3.11:5000/random-verse', function (data) {

// The sample object to store your verses
const data = {
  verses: [
    {
      book: 'Matthew',
      chapter: 25,
      text: "His master replied, 'Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things. Come and share your master's happiness!'",
      verse_end: 21,
      verse_start: 21
    },
    {
      book: 'Psalm',
      chapter: 27,
      text: 'The Lord is my light and my salvation whom shall I fear? The Lord is the stronghold of my life, of whom shall I be afraid?',
      verse_end: 1,
      verse_start: 1
    },
    {
      book: '1 Timothy',
      chapter: 4,
      text: 'physical training is of some value, but godliness has value for all things, holding promise for both the present life and the life to come.',
      verse_end: 8,
      verse_start: 8
    },
    {
      book: 'Psalm',
      chapter: 63,
      text: '"1: O God, you are my God, earnestly I seek you; my soul thirsts for you, my body longs for you, in a dry and weary land where there is no water. 2: I have seen you in the sanctuary and beheld your power and your glory. 3: Because your love is better than life, my lips will glorify you. 4: I will praise you as long as I live, and in your name I will lift up my hands. 5: My soul will be satisfied as with the richest of foods; with singing lips my mouth will praise you. 6: On my bed I remember you; I think of you through the watches of the night. 7: Because you are my help, I sing in the shadow of your wings. 8: My soul clings to you; your right hand upholds me. 9: They who seek my life will be destroyed; they will go down to the depths of the earth. 10: They will be given over to the sword and become food for jackals. 11: But the king will rejoice in God; all who swear by God\'s name will praise him, while the mouths of liars will be silenced."',
      verse_end: 11,
      verse_start: 1
    }
  ]
}

// put verses into array ready for DOM

const progressBar = document.getElementById('progress-bar')
const wordBankContainer = document.getElementById('word-bank')
const dropAreaContainer = document.getElementById('drop-area')
const dropLineContainer = document.getElementById('drop-line')
const resetButton = document.querySelector('#reset')
const checkArea = document.querySelector('#check-button-container')
const checkResultsContainer = document.querySelector('#feedback')
const newButton = document.createElement('button')
let verses = []
let numVerses = 0
let verseIndex = 0
let currentVerse = verses[0]
data.verses.forEach(verseData => versesIntoArray(verseData))
let verseString = currentVerse.text.replace(/^\d+:\s*/, '')
let wordButtonsEnabled = true
let verseContainer = document.getElementById('verse')
let verseArray = shuffle(verseString.split(' '))
let originalVerseArray = verseString.split(' ')

function versesIntoArray(verseData) {
  const text = verseData.text
  const match = text.match(/(\d+):(.+?)(?=\s\d|"$)/g)
  if (match) {
    match.forEach(function (verseString) {
      const verseNum = parseInt(verseString.match(/\d+/)[0], 10)
      const verse = {
        book: verseData.book,
        chapter: verseData.chapter,
        text: verseString,
        verse_start: verseNum,
        verse_end: verseNum
      }
      verses.push(verse)
    })
  } else {
    verses.push(verseData)
  }
}

function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

function createWordButtons(whichArray) {
  const fragment = document.createDocumentFragment()

  whichArray.forEach(word => {
    const button = createButtonForWord(word)
    fragment.appendChild(button)
  })

  wordBankContainer.appendChild(fragment)
  addWordButtonListeners()
}

function createButtonForWord(word) {
  const button = document.createElement('button')
  button.textContent = word
  button.id = `button-${word}`
  button.classList.add('word-button')
  button.dataset.word = word
  return button
}

function addWordButtonListeners() {
  const wordButtons = document.querySelectorAll('.word-button')

  wordButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.parentNode === wordBankContainer && wordButtonsEnabled) {
        dropLineContainer.appendChild(button)
      } else if (
        button.parentNode === dropLineContainer &&
        wordButtonsEnabled
      ) {
        wordBankContainer.appendChild(button)
      }
    })
  })
}

function resetWordsInContainer(containerName) {
  while (containerName.firstChild) {
    containerName.removeChild(containerName.firstChild)
  }
}

function getSelectedWords(dropLineContainer) {
  const dropLineButtons = dropLineContainer.querySelectorAll('button')
  const selectedWordsButtons = Array.from(dropLineButtons)
  return selectedWordsButtons.map(button =>
    button.dataset.word.replace(/[^\w\s]/gi, '').toLowerCase()
  )
}

function getCorrectVerseWords(verseString) {
  return verseString
    .replace(/[^\w\s]/gi, '')
    .toLowerCase()
    .split(' ')
}

function updateButtonClasses(button, isSelectedWordCorrect) {
  if (isSelectedWordCorrect) {
    button.classList.add('correct')
    button.classList.remove('incorrect')
  } else {
    button.classList.add('incorrect')
    button.classList.remove('correct')
  }
}

function compareWordsAndUpdateButtons(
  selectedWordsButtons,
  selectedWords,
  correctVerse
) {
  selectedWordsButtons.forEach((button, i) => {
    const isSelectedWordCorrect = selectedWords[i] === correctVerse[i]
    updateButtonClasses(button, isSelectedWordCorrect)
  })
}

function getPercentageCorrect(selectedWords, correctVerse) {
  const wordsGood = selectedWords.reduce(
    (acc, word, i) => acc + (correctVerse[i] === word ? 1 : 0),
    0
  )
  const totalWords = correctVerse.length
  return Math.round((wordsGood / totalWords) * 100)
}

function getResultText(percentageCorrect) {
  if (percentageCorrect >= 60) {
    return `Great work! You got ${percentageCorrect}% correct!`
  }
  return `You got ${percentageCorrect}% correct. Want to try it again?`
}

function setIdealHeight() {
  const headerHeight = document.querySelector('header').offsetHeight
  const footerHeight = document.getElementById('footer').offsetHeight
  const windowHeight = window.innerHeight
  const setWordBankHeight =
    (windowHeight - headerHeight - footerHeight - 85) / 2
  if (window.innerWidth > 800) {
    wordBankContainer.style.height = '200px'
    dropAreaContainer.style.height = '200px'
  } else {
    wordBankContainer.style.height = `${setWordBankHeight}px`
    dropAreaContainer.style.height = `${setWordBankHeight}px`
  }
}

function nextOrDone() {
  if (verseIndex < numVerses - 1) {
    newButton.textContent = 'NEXT'
    newButton.id = 'next-button'
    checkArea.appendChild(newButton)
  } else {
    newButton.textContent = 'DONE'
    newButton.id = 'done'
    checkArea.appendChild(newButton)
    newButton.addEventListener('click', () => {
      location.reload()
    })
  }
}

function listenKeyboard() {
  document.addEventListener('DOMContentLoaded', function () {
    const inputBox = document.getElementById('keyboard-input')
    const wordBankContainer = document.getElementById('word-bank')
    inputBox.addEventListener('keydown', function (event) {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        let keyboardWord = inputBox.value.replace(/[^\w\s]/gi, '').toLowerCase()
        inputBox.value = ''
        let bankWordButtons = Array.from(
          wordBankContainer.querySelectorAll('button')
        )
        bankWordButtons.some(button => {
          let buttonWord = button.textContent
            .replace(/[^\w\s]/gi, '')
            .toLowerCase()
          if (keyboardWord === buttonWord) {
            button.click()
            return true // Stop the loop when the first match is found
          }
          return false // Continue the loop
        })
      }
    })
  })
}

function putVerseInHeader(verseIndex) {
  currentVerse = verses[verseIndex]
  verseContainer.innerText =
    currentVerse.book +
    ' ' +
    currentVerse.chapter +
    ':' +
    currentVerse.verse_start
}

function setupNewVerse() {
  verseString = verses[(verseIndex += 1)].text
  putVerseInHeader(verseIndex)
  verseString = verseString.replace(/^\d+:\s*/, '')
  originalVerseArray = verseString.split(' ')
  progressBar.value += 1
  resetVerseContainers()
}

function checkUserInput() {
  wordButtonsEnabled = false
  const droplineButtons = dropLineContainer.querySelectorAll('button')
  const selectedWordsButtons = Array.from(droplineButtons)
  const selectedWords = getSelectedWords(dropLineContainer)
  const correctVerse = getCorrectVerseWords(verseString)
  compareWordsAndUpdateButtons(
    selectedWordsButtons,
    selectedWords,
    correctVerse
  )
  resetWordsInContainer(wordBankContainer)
  createWordButtons(originalVerseArray)
  const percentageCorrect = getPercentageCorrect(selectedWords, correctVerse)
  checkResultsContainer.textContent = getResultText(percentageCorrect)
  const checkButton = document.querySelector('#check')
  checkButton.remove()
  nextOrDone()
}

function resetVerseContainers() {
  wordButtonsEnabled = true
  resetWordsInContainer(wordBankContainer)
  resetWordsInContainer(dropLineContainer)
  resetWordsInContainer(checkResultsContainer)
  verseArray = shuffle(verseString.split(' '))
  createWordButtons(verseArray)
  const nextButton = document.querySelector('#next-button')
  if (nextButton) {
    nextButton.remove()
  }
  const checkButton = document.querySelector('#check')
  if (!checkButton) {
    newButton.textContent = 'CHECK'
    newButton.id = 'check'
    checkArea.appendChild(newButton)
  }
}

function init() {
  resetButton.addEventListener('click', resetVerseContainers)

  // Handle check & next button events
  document.addEventListener('click', event => {
    if (event.target && event.target.id === 'check') checkUserInput()
    else if (event.target && event.target.id === 'next-button') setupNewVerse()
  })

  putVerseInHeader(verseIndex)
  createWordButtons(verseArray)
  numVerses = Object.keys(verses).length
  progressBar.max = numVerses
  setIdealHeight()
  listenKeyboard()
}

init()
