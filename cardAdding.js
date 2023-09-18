// Section Card Content
const TrainingCards = [
  {
    imgLink: 'training/index.html',
    imgSource: 'images/freecodecamp.png',
    altText: 'FreeCodeCamp Logo',
    cardTitle: 'Free Code Camp',
    cardText: 'HTML, CSS, JS, Python',
    buttonLink: 'training/index.html',
    cardButton: 'Completed Courses'
  },
  {
    imgLink: 'training/index.html',
    imgSource: 'images/georgiatech.png',
    altText: 'Georgia Tech and EdX Logo',
    cardTitle: '0',
    cardText:
      "Learned OOP principles in Python & Java through GeorgiaTech's comprehensive MOOC courses on EdX",
    buttonLink: 'training/index.html',
    cardButton: 'Completed Courses'
  },
  {
    imgLink: 'https://www.codewars.com/users/jonathanlangdon',
    imgSource: 'images/codewars.png',
    altText: 'Codewars Logo',
    cardTitle: '0',
    cardText: 'Over 200 challenges done in JS, Python and Java',
    buttonLink: 'https://www.codewars.com/users/jonathanlangdon',
    cardButton: 'Honor & Rank'
  },
  {
    imgLink: 'training/index.html',
    imgSource: 'images/sololearn.png',
    altText: 'SoloLearn Logo',
    cardTitle: '0',
    cardText: 'Completed 11 introductory programming courses',
    buttonLink: 'training/index.html',
    cardButton: 'Completed Courses'
  },
  {
    imgLink: 'training/index.html',
    imgSource: 'images/mimo.png',
    altText: 'Mimo Logo',
    cardTitle: '0',
    cardText: 'Completed 5 introductory courses in HTML, JS, SQL and Python',
    buttonLink: 'training/index.html',
    cardButton: 'Completed Courses'
  },
  {
    imgLink: 'training/index.html',
    imgSource: 'images/udemy.png',
    altText: 'Udemy Logo',
    cardTitle: '0',
    cardText: 'Completed 5 courses about GitHub, SEO, JS and more',
    buttonLink: 'training/index.html',
    cardButton: 'Completed Courses'
  }
]

const ToolCards = [
  {
    imgLink: 'tools/index.html',
    imgSource: 'images/vscode.png',
    altText: 'Visual Studio Code Logo',
    cardTitle: 'Visual Studio Code',
    cardText: 'My favorite code editor',
    buttonLink: 'tools/index.html',
    cardButton: 'And other software'
  },
  {
    imgLink: 'https://github.com/jonathanlangdon',
    imgSource: 'images/github.png',
    altText: 'GitHub Logo',
    cardTitle: '0',
    cardText: 'Version control and collaboration',
    buttonLink: 'https://github.com/jonathanlangdon',
    cardButton: 'My Profile'
  },
  {
    imgLink: 'tools/index.html',
    imgSource: 'images/os.png',
    altText: 'Windows, Apple and Linux logos',
    cardTitle: 'Operating System',
    cardText: 'What Operating System do I prefer?',
    buttonLink: 'tools/index.html',
    cardButton: 'Operating Systems'
  }
]
const GoalCards = [
  {
    imgLink: 'goals/index.html',
    imgSource: 'images/learning.jpg',
    altText: 'Image of lines of code',
    cardTitle: 'Learning Goals',
    cardText:
      "I have more to learn and I have some things in mind for what's next. Always more to learn!",
    buttonLink: 'goals/index.html',
    cardButton: 'Further Training'
  },
  {
    imgLink: 'goals/index.html',
    imgSource: 'images/professional.png',
    altText: 'image of someone typing code',
    cardTitle: 'Professional Goals',
    cardText:
      "I'm yearning for something new and excited about a career in software/web development. ",
    buttonLink: 'goals/index.html',
    cardButton: 'Career Goals'
  },

  {
    imgLink: 'goals/index.html',
    imgSource: 'images/personal.jpg',
    altText: 'image of a family at beach',
    cardTitle: 'Personal Goals',
    cardText:
      "I want to live life to the fullest and make the most of my time. What I'm looking forward to!",
    buttonLink: 'goals/index.html',
    cardButton: 'Life outside of work'
  }
]
const ProjectCards = [
  {
    imgLink: 'projects/index.html',
    imgSource: 'images/fomcore.jpg',
    altText: 'space invaders fork image',
    cardTitle: 'Fomcore Invaders',
    cardText: 'Using classes & objects',
    buttonLink: 'projects/index.html',
    cardButton: 'A Python Game'
  },
  {
    imgLink: 'projects/index.html',
    imgSource: 'images/snowday.jpg',
    altText: 'App screenshot of snow day calculator',
    cardTitle: 'Snow Day Calculator',
    cardText: "GoogleMap and Weather.gov API's",
    buttonLink: 'projects/index.html',
    cardButton: 'Will we have school?'
  },
  {
    imgLink: 'projects/index.html',
    imgSource: 'images/swordbuff.jpg',
    altText: 'App screenshot of a duolingo like app',
    cardTitle: 'Memorization App',
    cardText: 'A duolingo-like memorization app ',
    buttonLink: 'projects/index.html',
    cardButton: 'A JS heavy app'
  }
]

// Function to create a card
const createCard = cardInfo => {
  const colDiv = document.createElement('div')
  colDiv.className = 'col-md-4 my-3'

  const cardDiv = document.createElement('div')
  cardDiv.className = 'card bg-dark text-white'

  const anchorImg = document.createElement('a')
  anchorImg.href = cardInfo.imgLink
  if (cardInfo.imgLink.includes('https')) {
    anchorImg.target = '_blank'
  }

  const cardImage = document.createElement('img')
  cardImage.className = 'card-img-top w-100 mx-auto'
  cardImage.src = cardInfo.imgSource
  cardImage.alt = cardInfo.altText

  const cardBodyDiv = document.createElement('div')
  cardBodyDiv.className = 'card-body mx-auto'

  const cardTitle = document.createElement('h5')
  cardTitle.className = 'card-title text-center'
  cardTitle.innerText = cardInfo.cardTitle

  const cardText = document.createElement('p')
  cardText.className = 'card-text text-center'
  cardText.innerText = cardInfo.cardText

  const buttonDiv = document.createElement('div')
  buttonDiv.className = 'col-12 text-center'

  const cardButton = document.createElement('a')
  cardButton.className = 'btn btn-primary'
  cardButton.href = cardInfo.buttonLink
  if (cardInfo.buttonLink.includes('https')) {
    cardButton.target = '_blank'
  }
  cardButton.innerText = cardInfo.cardButton

  // Assembling the card
  anchorImg.appendChild(cardImage)
  buttonDiv.appendChild(cardButton)
  if (cardInfo.cardTitle !== '0') {
    cardBodyDiv.appendChild(cardTitle)
  }
  cardBodyDiv.appendChild(cardText)
  cardBodyDiv.appendChild(buttonDiv)
  cardDiv.appendChild(anchorImg)
  cardDiv.appendChild(cardBodyDiv)
  colDiv.appendChild(cardDiv)

  return colDiv
}

const CardSections = [
  [TrainingCards, 'training-cards'],
  [ToolCards, 'tool-cards'],
  [GoalCards, 'goal-cards'],
  [ProjectCards, 'project-cards']
]

// Add each card section to DOM
CardSections.forEach(([cards, containerId]) => {
  const sectionContainer = document.getElementById(containerId)

  cards.forEach(cardInfo => {
    const card = createCard(cardInfo)
    sectionContainer.appendChild(card)
  })
})
