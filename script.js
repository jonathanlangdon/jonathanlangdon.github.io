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

// Active Navigation
window.addEventListener('scroll', function () {
  let fromTop = window.scrollY

  document.querySelectorAll('nav a').forEach(link => {
    if (!link.hash) {
      return
    }

    let section = document.querySelector(link.hash)

    if (
      section.offsetTop <= fromTop &&
      section.offsetTop + section.offsetHeight > fromTop
    ) {
      link.classList.add('active')
    } else {
      link.classList.remove('active')
    }
  })
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

// Check if service workers are supported and register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js.gz')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope)
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error)
      })
  })
}
