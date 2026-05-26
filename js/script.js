document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('new-book-form');
    const modal = document.getElementById('success-modal');
    const modalMessage = document.getElementById('modal-message');
    const closeModalBtn = document.getElementById('close-modal');
    const libraryGrid = document.getElementById('library-grid');

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

    if (libraryGrid) {
        let library = JSON.parse(localStorage.getItem('starlogArchive')) || [];

        if (library.length === 0) {
            libraryGrid.innerHTML = '<p class="empty-message">No transmissions found in the archive. Please log a new entry.</p>';
        } else {
            libraryGrid.innerHTML = '';
            library.forEach(book => {
                const card = document.createElement('div');
                card.className = 'book-card';
                card.innerHTML = `
                    <div class="card-header">
                        <h3>${book.title}</h3>
                        <span class="genre-tag">${book.genre}</span>
                    </div>
                    <div class="card-body">
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Status:</strong> <span class="status ${book.status.toLowerCase()}">${book.status}</span></p>
                        <p><strong>Logged:</strong> ${book.dateAdded}</p>
                    </div>
                `;
                libraryGrid.appendChild(card);
            });
        }
    }
});