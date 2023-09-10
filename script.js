// Boilerplate template

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    })
  })
})

// Highlight active section in navigation

window.addEventListener('scroll', function () {
  let fromTop = window.scrollY

  // Check if at the bottom of the page
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    // At the bottom of the page, set the last link as active
    document
      .querySelectorAll('nav a')
      .forEach(link => link.classList.remove('active'))
    let lastLink =
      document.querySelectorAll('nav a')[
        document.querySelectorAll('nav a').length - 1
      ]
    if (lastLink.hash) {
      lastLink.classList.add('active')
    }
    return
  }

  // Variable to keep track of the closest section
  let closest = null

  document.querySelectorAll('nav a').forEach(link => {
    if (!link.hash) {
      return
    }

    let section = document.querySelector(link.hash)

    // Calculate distance from section to current scroll position
    let distance = Math.abs(fromTop - section.offsetTop)

    // Update closest if this section is closer
    if (closest === null || Math.abs(fromTop - closest.offsetTop) > distance) {
      closest = section
    }
  })

  // Remove active class from all links
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active')
  })

  // Set the closest section's corresponding link to active
  if (closest) {
    let link = document.querySelector(`nav a[href="#${closest.id}"]`)
    link.classList.add('active')
  }
})

//Scroll to Top
document.addEventListener('DOMContentLoaded', function () {
  var scrollToTopButton = document.querySelector('.scroll-to-top')

  // Function to scroll to the top smoothly
  function scrollToTop() {
    if (window.scrollY !== 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  scrollToTopButton.addEventListener('click', scrollToTop)
})
