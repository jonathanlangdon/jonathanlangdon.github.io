document.addEventListener('DOMContentLoaded', function () {
  const navItems = [
    { text: 'Technologies', link: '#languages' },
    { text: 'Story', link: '#mystory' },
    { text: 'Training', link: '#training' },
    { text: 'Tools', link: '#tools' },
    { text: 'Goals', link: '#goals' },
    { text: 'Projects', link: '#projects' },
    { text: 'Resume', link: '#resume' },
    { text: 'Contact', link: '#contact' }
  ]

  // Function to create a navigation item
  const createNavItem = navItem => {
    const listItem = document.createElement('li')
    listItem.className = 'nav-item'

    const anchor = document.createElement('a')
    anchor.className = 'nav-link'
    anchor.href = navItem.link
    anchor.innerText = navItem.text

    listItem.appendChild(anchor)

    return listItem
  }

  // Append navigation items to the container
  const navContainer = document.querySelector('.navbar-nav')

  navItems.forEach(navItem => {
    const listItem = createNavItem(navItem)
    navContainer.appendChild(listItem)
  })
})
