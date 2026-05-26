document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('new-book-form');
    const modal = document.getElementById('success-modal');
    const modalMessage = document.getElementById('modal-message');
    const closeModalBtn = document.getElementById('close-modal');
    const libraryGrid = document.getElementById('library-grid');

    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    let itemToDelete = null;

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

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            if (deleteModal) {
                deleteModal.classList.add('hidden');
            }
            itemToDelete = null;
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (itemToDelete !== null) {
                deleteEntry(itemToDelete);
                if (deleteModal) {
                    deleteModal.classList.add('hidden');
                }
                itemToDelete = null;
            }
        });
    }

    if (libraryGrid) {
        renderLibrary();
    }

    function renderLibrary() {
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
                    <div class="card-actions">
                        <button class="action-btn btn-update" data-id="${book.id}">Toggle Status</button>
                        <button class="action-btn btn-delete" data-id="${book.id}">Purge</button>
                    </div>
                `;
                libraryGrid.appendChild(card);
            });

            document.querySelectorAll('.btn-delete').forEach(button => {
                button.addEventListener('click', function() {
                    itemToDelete = parseInt(this.getAttribute('data-id'));
                    if (deleteModal) {
                        deleteModal.classList.remove('hidden');
                    }
                });
            });

            document.querySelectorAll('.btn-update').forEach(button => {
                button.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    toggleStatus(id);
                });
            });
        }
    }

    function deleteEntry(id) {
        let library = JSON.parse(localStorage.getItem('starlogArchive')) || [];
        library = library.filter(book => book.id !== id);
        localStorage.setItem('starlogArchive', JSON.stringify(library));
        renderLibrary();
    }

    function toggleStatus(id) {
        let library = JSON.parse(localStorage.getItem('starlogArchive')) || [];
        const bookIndex = library.findIndex(book => book.id === id);
        
        if (bookIndex !== -1) {
            library[bookIndex].status = library[bookIndex].status === 'Reading' ? 'Completed' : 'Reading';
            localStorage.setItem('starlogArchive', JSON.stringify(library));
            renderLibrary();
        }
    }
});