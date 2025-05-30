document.addEventListener('DOMContentLoaded', function () {
  const navItems = [
    { text: 'Story', link: '/#mystory' },
    { text: 'Projects', link: '/#projects' },
    { text: 'Training', link: '/#training' },
    { text: 'Experience', link: '/#languages' },
    { text: 'Tools', link: '/#tools' },
    { text: 'Goals', link: '/#goals' },
    { text: 'Resume', link: '/#resume' }
  ];

  // Function to create a navigation item
  const createNavItem = navItem => {
    const listItem = document.createElement('li');
    listItem.className = 'nav-item';

    const anchor = document.createElement('a');
    anchor.className = 'nav-link';
    anchor.href = navItem.link;
    anchor.innerText = navItem.text;

    listItem.appendChild(anchor);

    return listItem;
  };

  // Append navigation items to the container
  const navContainer = document.querySelector('.navbar-nav');

  navItems.forEach(navItem => {
    const listItem = createNavItem(navItem);
    navContainer.appendChild(listItem);
  });
});
