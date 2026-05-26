document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('new-book-form');
    const modal = document.getElementById('success-modal');
    const modalMessage = document.getElementById('modal-message');
    const closeModalBtn = document.getElementById('close-modal');

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

            modalMessage.innerHTML = `Transmission Logged:<br><strong style="color: #00f0ff;">"${newEntry.title}"</strong><br>has been saved to your archives.`;
            modal.classList.remove('hidden');

            setTimeout(() => {
                if (!modal.classList.contains('hidden')) {
                    modal.classList.add('hidden');
                }
            }, 3000);
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
});