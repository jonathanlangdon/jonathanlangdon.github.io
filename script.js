// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    })
  })
})

// Function to load the content of a section
function loadSectionContent(section) {
  const src = section.getAttribute('data-src')
  if (src) {
    fetch(src)
      .then(response => response.text())
      .then(content => {
        section.innerHTML = content
        section.removeAttribute('data-src') // Remove the data-src attribute to prevent reloading
        section.classList.remove('lazy-load-section') // Remove the class to stop checking this section
        section.classList.add('fade-in') // Add fade-in class initially with opacity 0

        // Trigger reflow to make sure the initial 'fade-in' class is applied
        void section.offsetWidth

        // Add the 'show' class to trigger the fade-in effect
        requestAnimationFrame(() => {
          section.classList.add('show')
        })
      })
  }
}

// Function to check if an element is in the viewport
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  )
}

// Function to handle lazy loading
function lazyLoadSections() {
  const lazySections = document.querySelectorAll('.lazy-load-section')
  lazySections.forEach(section => {
    if (isElementInViewport(section)) {
      loadSectionContent(section)
    }
  })
}

// Attach the lazyLoadSections function to the scroll event
window.addEventListener('scroll', lazyLoadSections)
window.addEventListener('resize', lazyLoadSections)

// Initial loading check
lazyLoadSections()
