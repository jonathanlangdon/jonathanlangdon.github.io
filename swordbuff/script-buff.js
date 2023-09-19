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

// Initially I setup website with a MySQL server to test it out... but for the purposes of demonstration, I'm replacing the SQL database with a simple object

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

let verses = []
data.verses.forEach(function (verseData) {
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
})
const numVerses = Object.keys(verses).length
let verseIndex = 0
let currentVerse = verses[0]
let verseString = currentVerse.text
verseString = verseString.replace(/^\d+:\s*/, '')
const progressBar = document.getElementById('progress-bar')
const wordBankContainer = document.getElementById('word-bank')
const dropAreaContainer = document.getElementById('drop-area')
const dropLineContainer = document.getElementById('drop-line')
const buttonLabels = []
let wordButtonsEnabled = true
const resetButton = document.querySelector('#reset')
const checkArea = document.querySelector('#check-button-container')
const checkResultsContainer = document.querySelector('#check-results')
const newButton = document.createElement('button')
let verseContainer = document.getElementById('verse')
let verseArray = shuffle(verseString.split(' '))
let originalVerseArray = verseString.split(' ')

progressBar.max = numVerses
verseContainer.textContent =
  currentVerse.book +
  ' ' +
  currentVerse.chapter +
  ':' +
  currentVerse.verse_start

function createWordButtons(whichArray) {
  const fragment = document.createDocumentFragment()
  whichArray.forEach(word => {
    const button = document.createElement('button')
    button.textContent = word
    button.id = `button-${buttonLabels.length}`
    button.classList.add('word-button')
    button.dataset.word = word
    buttonLabels.push(word)
    wordBankContainer.appendChild(button)
    fragment.appendChild(button)
  })
  wordBankContainer.appendChild(fragment)
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

function listenKeyboard() {
  document.addEventListener('DOMContentLoaded', function () {
    const inputBox = document.getElementById('keyboard-input')
    const wordBankContainer = document.getElementById('word-bank')
    document.addEventListener('keydown', function () {
      inputBox.focus()
    })
    inputBox.addEventListener('keydown', function (event) {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        useKeyboardInput()
      }
    })

    function useKeyboardInput() {
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
}

listenKeyboard()

function resetWordsInContainer(containerName) {
  while (containerName.firstChild) {
    containerName.removeChild(containerName.firstChild)
  }
}

function checkUserInput() {
  const selectedWordsButtons = Array.from(
    dropLineContainer.querySelectorAll('button')
  )
  const selectedWords = selectedWordsButtons.map(button =>
    button.dataset.word.replace(/[^\w\s]/gi, '').toLowerCase()
  )
  const correctVerseArray = verseString
    .replace(/[^\w\s]/gi, '')
    .toLowerCase()
    .split(' ')
  selectedWordsButtons.forEach((button, i) => {
    const selectedWord = selectedWords[i]
    const correctVerseWord = correctVerseArray[i]
    if (selectedWord === correctVerseWord) {
      button.classList.add('correct')
      button.classList.remove('incorrect')
    } else {
      button.classList.add('incorrect')
      button.classList.remove('correct')
    }
  })
  resetWordsInContainer(wordBankContainer)
  createWordButtons(originalVerseArray)
  const wordsGood = selectedWords.reduce(
    (acc, word, i) => acc + (correctVerseArray[i] === word ? 1 : 0),
    0
  )
  const totalWords = verseArray.length
  const percentageCorrect = Math.round((wordsGood / totalWords) * 100)
  let resultText
  if (percentageCorrect >= 60) {
    resultText = `Great work! You got ${percentageCorrect}% correct!`
  } else {
    resultText = `Good effort! You got ${percentageCorrect}% correct. Want to try it again?`
  }
  checkResultsContainer.textContent = resultText
}

createWordButtons(verseArray)

const headerHeight = document.querySelector('header').offsetHeight
const footerHeight = document.getElementById('footer').offsetHeight
const windowHeight = window.innerHeight
const setWordBankHeight = (windowHeight - headerHeight - footerHeight - 36) / 2
if (parseInt(wordBankContainer.style.height) < 236) {
  wordBankContainer.style.height = `${setWordBankHeight}px`
  dropAreaContainer.style.height = `${setWordBankHeight}px`
} else {
  wordBankContainer.style.height = '236px'
  dropAreaContainer.style.height = '236px'
}

resetButton.addEventListener('click', () => {
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
  const inputBox = document.createElement('input')
  inputBox.type = 'text'
  inputBox.id = 'keyboard-input'
  inputBox.placeholder = 'Keyboard Input'
  checkResultsContainer.appendChild(inputBox)
  listenKeyboard()
})

document.addEventListener('click', event => {
  if (event.target && event.target.id === 'check') {
    wordButtonsEnabled = false
    checkUserInput()
    const checkButton = document.querySelector('#check')
    checkButton.remove()
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
  } else if (event.target && event.target.id === 'next-button') {
    verseString = verses[(verseIndex += 1)].text
    verseContainer.textContent =
      verses[verseIndex].book +
      ' ' +
      verses[verseIndex].chapter +
      ':' +
      verses[verseIndex].verse_start
    verseString = verseString.replace(/^\d+:\s*/, '')
    wordButtonsEnabled = true
    resetWordsInContainer(wordBankContainer)
    resetWordsInContainer(dropLineContainer)
    resetWordsInContainer(checkResultsContainer)
    verseArray = shuffle(verseString.split(' '))
    originalVerseArray = verseString.split(' ')
    createWordButtons(verseArray)
    const nextButton = document.querySelector('#next-button')
    nextButton.remove()
    newButton.textContent = 'CHECK'
    newButton.id = 'check'
    checkArea.appendChild(newButton)
    const inputBox = document.createElement('input')
    inputBox.type = 'text'
    inputBox.id = 'keyboard-input'
    inputBox.placeholder = 'Keyboard Input'
    checkResultsContainer.appendChild(inputBox)
    progressBar.value += 1
    listenKeyboard()
  }
})
// })
