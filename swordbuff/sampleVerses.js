// Initially this was set up on a website with a MySQL server... but for the purposes of demonstration, I'm replacing the SQL database with a simple object

// $.get('http://192.168.3.11:5000/random-verse', function (data) {

export const data = {
  verses: [
    {
      book: 'Frank Herbert, Dune',
      chapter: 1,
      text: "The mystery of life isn't a problem to solve, but a reality to experience.",
      verse_end: 1,
      verse_start: 1
    },
    {
      book: 'Frank Herbert, Dune',
      chapter: 1,
      text: 'What do you despise? By this are you truly known',
      verse_end: 1,
      verse_start: 1
    },
    {
      book: 'Frank Herbert, Dune',
      chapter: 1,
      text: 'I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear. I will permit it to pass over me and through me. And when it has gone past I will turn the inner eye to see its path. Where the fear has gone there will be nothing. Only I will remain.',
      verse_end: 1,
      verse_start: 1
    }
  ]
};
