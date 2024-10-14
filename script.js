function appendFooter() {
  const currentYear = new Date().getFullYear();

  const copyrightText = document.createElement('p');
  copyrightText.innerText = `©${currentYear} Jonathan Langdon`;
  document.querySelector('footer').appendChild(copyrightText);
}

appendFooter();
