document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('new-book-form');
  if (form) {

    form.addEventListener('submit', function(event) {

      event.preventDefault();

      const titleInput = document.getElementById('title').value;
      const authorInput = document.getElementById('author').value;
      const genreInput = document.getElementById('genre').value;

      const newEntry = {
          id: Date.now(),
          title: titleInput,
          author: authorInput,
          genre: genreInput,
          status: 'Reading', 
          dateAdded: new Date().toLocaleDateString()
      };

      let library = JSON.parse(localStorage.getItem('starlogArchive')) || [];
      
      library.push(newEntry);


      localStorage.setItem('starlogArchive', JSON.stringify(library));

      form.reset();

      alert(`Transmission Logged: "${newEntry.title}" has been saved to your archives.`);
    });
  }
});