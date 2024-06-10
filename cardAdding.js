const languages = [
  {
    src: 'images/html-css.png',
    alt: 'HTML & CSS',
    id: 'htmlcss',
    desc: `<h5 class="text-white">Sources of Learning:</h5>
  <p class="text-white">- Free Code Camp<br>- SoloLearn<br>- Mimo<br>- Udemy</p>
  <h5 class="text-white">Used in:</h5>
  <p class="text-white">- This portfolio website<br>- Snow Day Calculator<br>- Memorization App</p>
  <h5 class="text-white">Planned Further Learning:</h5>
  <p class="text-white">- More Free Code Camp<br>- The Odin’s Project</p>
  `
  },
  {
    src: 'images/js.png',
    alt: 'JavaScript',
    id: 'javascript',
    desc: `<h5 class="text-white">Sources of Learning:</h5>
<p class="text-white">- Free Code Camp<br>- SoloLearn<br>- Mimo<br>- Codewars<br>- Udemy</p>
<h5 class="text-white">Used in:</h5>
<p class="text-white">- This portfolio website<br>- Snow Day Calculator<br>- Memorization App</p>
<h5 class="text-white">Planned Further Learning:</h5>
<p class="text-white">- More Free Code Camp<br>- The Odin’s Project<br>- More CodeWars challenges<br>- frameworks on Udemy</p>
`
  },
  {
    src: 'images/csharp.png',
    alt: 'CSharp',
    id: 'CSharp',
    desc: `<h5 class="text-white">Learned through:</h5>
<p class="text-white">- Udemy<br>- SoloLearn<br>- WGU<br>- Codewars</p>
<h5 class="text-white">Planned Further Learning:</h5>
<p class="text-white">-  Udemy Courses<br>- freeCodeCamp<br>- CodeWars</p>
`
  },
  {
    src: 'images/py.png',
    alt: 'Python',
    id: 'python',
    desc: `<h5 class="text-white">Sources of Learning:</h5>
<p class="text-white">- Free Code Camp<br>- Georgia Tech’s EdX Course<br>- CodeWars</p>
<h5 class="text-white">Used in:</h5>
<p class="text-white">-  Fomcore Invaders</p>
<h5 class="text-white">Planned Further Learning:</h5>
<p class="text-white">-  Free Code Camp<br>- more exercises on EdX<br>- CodeWars</p>
`
  },
  {
    src: 'images/java.png',
    alt: 'Java',
    id: 'java',
    desc: `<h5 class="text-white">Sources of Learning:</h5>
<p class="text-white">- WGU<br>- Georgia Tech's EdX Course<br>- SoloLearn Courses</p>
<h5 class="text-white">Used in:</h5>
<p class="text-white">- In-class projects on Georgia Tech’s MOOC</p>
<h5 class="text-white">Planned Further Learning:</h5>
<p class="text-white">- CodeWars</p>
`
  },
  {
    src: 'images/sql.png',
    alt: 'SQL',
    id: 'SQL',
    desc: `<h5 class="text-white">Sources of Learning:</h5>
<p class="text-white">- WGU<br>- Mimo<br>- SoloLearn</p>
<h5 class="text-white">Used in:</h5>
<p class="text-white">- Memorization App</p>
<h5 class="text-white">Planned Further Learning:</h5>
<p class="text-white">- Udemy Courses<br>- freeCodeCamp<br>- CodeWars</p>
`
  }
];

// Add the images of Languages I know
function createColumn(language) {
  const col = document.createElement('div');
  col.className = 'col-md-4 col-sm-6 lang-logo';

  const img = document.createElement('img');
  img.src = language.src;
  img.alt = language.alt;
  img.className = 'img-fluid mx-auto';

  const figcaption = document.createElement('figcaption');
  figcaption.className = 'figure-caption text-center';

  const p = createDescriptionParagraph(language, figcaption);

  figcaption.appendChild(p);
  col.appendChild(img);
  col.appendChild(figcaption);

  return col;
}

function createDescriptionParagraph(language, figcaption) {
  const p = document.createElement('p');
  p.id = language.id;
  p.className =
    'text-decoration-underline text-white fst-italic lang-description pointer';
  p.textContent = 'More about this';

  p.isExpanded = false;

  p.onclick = function () {
    const description = document.querySelector(`#${language.id}-description`);

    if (!p.isExpanded) {
      const newDiv = document.createElement('div');
      newDiv.id = `${language.id}-description`;
      newDiv.innerHTML = language.desc;
      figcaption.insertBefore(newDiv, p);
      p.innerText = 'Hide this';
    } else {
      description.remove();
      p.innerText = 'More about this';
    }

    p.isExpanded = !p.isExpanded;
  };

  return p;
}

function descriptionVisibility(setVisibility) {
  const languageDescriptions = document.querySelectorAll('.lang-description');
  if (setVisibility === 'show') {
    languageDescriptions.forEach(description => {
      if (!description.isExpanded) description.click();
    });
  } else if (setVisibility === 'hide') {
    languageDescriptions.forEach(description => {
      if (description.isExpanded) description.click();
    });
  }
}

function appendLanguages() {
  const container = document.getElementById('language-cells');
  const row = document.createElement('div');
  row.className = 'row';

  const expandAllLink = document.getElementById('expand-all-lang');
  expandAllLink.onclick = () => descriptionVisibility('show');

  const hideAllLink = document.getElementById('hide-all-lang');
  hideAllLink.onclick = () => descriptionVisibility('hide');

  languages.forEach(language => {
    const col = createColumn(language);
    row.appendChild(col);
  });

  container.appendChild(row);
}

document.addEventListener('DOMContentLoaded', appendLanguages);

// Section Card Content
const TrainingCards = [
  {
    imgLink: 'training/#wgu',
    imgSource: 'images/wgu.png',
    altText: 'WGU Logo',
    cardTitle: 'WGU Bachelors',
    cardText: 'Software Engineering',
    buttonLink: 'training/#wgu',
    cardButton: 'Bachelors Degree'
  },
  {
    imgLink: 'training/#freecodecamp',
    imgSource: 'images/freecodecamp.png',
    altText: 'FreeCodeCamp Logo',
    cardTitle: 'Free Code Camp',
    cardText: 'HTML, CSS, JS, Python',
    buttonLink: 'training/#freecodecamp',
    cardButton: 'Completed Courses'
  },
  {
    imgLink: 'training/#edx',
    imgSource: 'images/georgiatech.png',
    altText: 'Georgia Tech and EdX Logo',
    cardTitle: '0',
    cardText: "Learned OOP principles through GeorgiaTech's comprehensive MOOC",
    buttonLink: 'training/#edx',
    cardButton: 'Completed Courses'
  },
  {
    imgLink: 'training/#codewars',
    imgSource: 'images/codewars.png',
    altText: 'Codewars Logo',
    cardTitle: '0',
    cardText: 'Over 700 challenges done in C#, JS, Python, Java and SQL',
    buttonLink: 'training/#codewars',
    cardButton: 'Honor & Rank'
  },
  {
    imgLink: 'training/#sololearn',
    imgSource: 'images/sololearn.png',
    altText: 'SoloLearn Logo',
    cardTitle: '0',
    cardText: 'Completed introductory programming courses on many topics',
    buttonLink: 'training/#sololearn',
    cardButton: 'Completed Courses'
  },
  {
    imgLink: 'training/#mimo',
    imgSource: 'images/mimo.png',
    altText: 'Mimo Logo',
    cardTitle: '0',
    cardText: 'Completed introductory courses in HTML, JS, SQL and Python',
    buttonLink: 'training/#mimo',
    cardButton: 'Completed Courses'
  },
  {
    imgLink: 'training/#udemy',
    imgSource: 'images/udemy.png',
    altText: 'Udemy Logo',
    cardTitle: '0',
    cardText: 'Completed courses about GitHub, SEO, JS and more',
    buttonLink: 'training/#udemy',
    cardButton: 'Completed Courses'
  },
  {
    imgLink: 'training/#books',
    imgSource: 'images/books.jpg',
    altText: 'Various Programming Books',
    cardTitle: 'Books',
    cardText: 'A few books that have helped my journey',
    buttonLink: 'training/#books',
    cardButton: 'Finished Books'
  },
  {
    imgLink: 'training/#chatgpt',
    imgSource: 'images/chatgpt.jpg',
    altText: 'ChatGPT logo',
    cardTitle: 'ChatGPT',
    cardText: 'A constant tutor and a source of challenges',
    buttonLink: 'training/#chatgpt',
    cardButton: 'How AI helped'
  },
  {
    imgLink: 'training/#beercity',
    imgSource: 'images/beercity.jpg',
    altText: 'Beer City Code logo',
    cardTitle: '0',
    cardText: 'The 2023 Saturday Conference was a great experience',
    buttonLink: 'training/#beercity',
    cardButton: 'The code conference'
  },
  {
    imgLink: 'training/#codingGames',
    imgSource: 'images/codingGames.jpg',
    altText: 'Programming Games',
    cardTitle: '0',
    cardText: 'I also had fun coding with some programming games!',
    buttonLink: 'training/#codingGames',
    cardButton: 'Coding Games'
  }
];

const ToolCards = [
  {
    imgLink: 'tools/#software',
    imgSource: 'images/vscode.png',
    altText: 'Visual Studio Code Logo',
    cardTitle: 'Visual Studio Code',
    cardText: 'My favorite code editor',
    buttonLink: 'tools/#software',
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
    imgLink: 'tools/#os',
    imgSource: 'images/os.png',
    altText: 'Windows, Apple and Linux logos',
    cardTitle: 'Operating System',
    cardText: 'What Operating System do I prefer?',
    buttonLink: 'tools/#os',
    cardButton: 'Operating Systems'
  }
];
const GoalCards = [
  {
    imgLink: 'goals/#learning',
    imgSource: 'images/learning.jpg',
    altText: 'Image of lines of code',
    cardTitle: 'Learning Goals',
    cardText:
      "I have more to learn and I have some things in mind for what's next. Always more to learn!",
    buttonLink: 'goals/#learning',
    cardButton: 'Further Training'
  },
  {
    imgLink: 'goals/#professional',
    imgSource: 'images/professional.jpg',
    altText: 'image of someone typing code',
    cardTitle: 'Professional Goals',
    cardText:
      "I'm yearning for something new and excited about a career as a developer. ",
    buttonLink: 'goals/#professional',
    cardButton: 'Career Goals'
  },

  {
    imgLink: 'goals/#personal',
    imgSource: 'images/personal.jpg',
    altText: 'image of a family at beach',
    cardTitle: 'Personal Goals',
    cardText:
      "I want to live life to the fullest and make the most of my time. What I'm looking forward to!",
    buttonLink: 'goals/#personal',
    cardButton: 'Life outside of work'
  }
];
const ProjectCards = [
  {
    imgLink: 'projects/#fomcore',
    imgSource: 'images/fomcore.jpg',
    altText: 'space invaders fork image',
    cardTitle: 'Fomcore Invaders',
    cardText: 'Practice with OOP using classes & objects',
    buttonLink: 'projects/#fomcore',
    cardButton: 'A Python Game'
  },
  {
    imgLink: 'projects/#snowday',
    imgSource: 'images/snowday.jpg',
    altText: 'App screenshot of snow day calculator',
    cardTitle: 'Snow Day Calculator',
    cardText: "Weather.gov's API and a Node.js server app",
    buttonLink: 'projects/#snowday',
    cardButton: 'Will we have school?'
  },
  {
    imgLink: 'projects/#swordbuff',
    imgSource: 'images/swordbuff.jpg',
    altText: 'App screenshot of a duolingo like app',
    cardTitle: 'Memorization App',
    cardText: 'A duolingo-like memorization app ',
    buttonLink: 'projects/#swordbuff',
    cardButton: 'A JS heavy app'
  }
];

// Function to create a card
const createCard = cardInfo => {
  const colDiv = document.createElement('div');
  colDiv.className = 'col-md-4 my-3';

  const cardDiv = document.createElement('div');
  cardDiv.className = 'card bg-dark text-white';

  const anchorImg = document.createElement('a');
  anchorImg.href = cardInfo.imgLink;
  if (cardInfo.imgLink.includes('https')) {
    anchorImg.target = '_blank';
  }

  const cardImage = document.createElement('img');
  cardImage.className = 'card-img-top w-100 mx-auto';
  cardImage.src = cardInfo.imgSource;
  cardImage.alt = cardInfo.altText;

  const cardBodyDiv = document.createElement('div');
  cardBodyDiv.className = 'card-body mx-auto';

  const cardTitle = document.createElement('h5');
  cardTitle.className = 'card-title text-center';
  cardTitle.innerText = cardInfo.cardTitle;

  const cardText = document.createElement('p');
  cardText.className = 'card-text text-center';
  cardText.innerText = cardInfo.cardText;

  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'col-12 text-center';

  const cardButton = document.createElement('a');
  cardButton.className = 'btn btn-primary';
  cardButton.href = cardInfo.buttonLink;
  if (cardInfo.buttonLink.includes('https')) {
    cardButton.target = '_blank';
  }
  cardButton.innerText = cardInfo.cardButton;

  // Assembling the card
  anchorImg.appendChild(cardImage);
  buttonDiv.appendChild(cardButton);
  if (cardInfo.cardTitle !== '0') {
    cardBodyDiv.appendChild(cardTitle);
  }
  cardBodyDiv.appendChild(cardText);
  cardBodyDiv.appendChild(buttonDiv);
  cardDiv.appendChild(anchorImg);
  cardDiv.appendChild(cardBodyDiv);
  colDiv.appendChild(cardDiv);

  return colDiv;
};

const CardSections = [
  [TrainingCards, 'training-cards'],
  [ToolCards, 'tool-cards'],
  [GoalCards, 'goal-cards'],
  [ProjectCards, 'project-cards']
];

// Add each card section to DOM
CardSections.forEach(([cards, containerId]) => {
  const sectionContainer = document.getElementById(containerId);

  cards.forEach(cardInfo => {
    const card = createCard(cardInfo);
    sectionContainer.appendChild(card);
  });
});
