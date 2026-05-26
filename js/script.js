document.addEventListener('DOMContentLoaded', () => {
    
    const noteModalHTML = `
        <div id="note-modal" class="modal hidden">
            <div class="modal-content">
                <p style="color: var(--neon-blue); margin-bottom: 1rem; font-size: 1.2rem; text-transform: uppercase;">Update Mission Notes</p>
                <textarea id="edit-note-input" rows="4" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid #2a3441; color: var(--text-light); padding: 0.8rem; font-family: 'Share Tech Mono', monospace; margin-bottom: 1.5rem; resize: vertical;"></textarea>
                <div class="modal-actions">
                    <button type="button" id="save-note-btn" class="action-btn btn-update">Save Data</button>
                    <button type="button" id="cancel-note-btn" class="action-btn btn-note">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', noteModalHTML);

    const form = document.getElementById('new-book-form');
    const modal = document.getElementById('success-modal');
    const modalMessage = document.getElementById('modal-message');
    const closeModalBtn = document.getElementById('close-modal');
    const libraryGrid = document.getElementById('library-grid');
    const statsGrid = document.getElementById('stats-grid');
    const dashboardGrid = document.getElementById('dashboard-grid');

    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    
    const noteModal = document.getElementById('note-modal');
    const noteInput = document.getElementById('edit-note-input');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const cancelNoteBtn = document.getElementById('cancel-note-btn');

    let itemToDelete = null;
    let itemToEditNote = null;

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const titleInput = document.getElementById('title').value;
            const authorInput = document.getElementById('author').value;
            const genreInput = document.getElementById('genre').value;
            const notesElement = document.getElementById('notes');
            const notesInput = notesElement ? notesElement.value : '';

            const newEntry = {
                id: Date.now(),
                title: titleInput,
                author: authorInput,
                genre: genreInput,
                notes: notesInput,
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

    if (cancelDeleteBtn && deleteModal) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteModal.classList.add('hidden');
            itemToDelete = null;
        });
    }

    if (confirmDeleteBtn && deleteModal) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (itemToDelete !== null) {
                deleteEntry(itemToDelete);
                deleteModal.classList.add('hidden');
                itemToDelete = null;
            }
        });
    }

    if (cancelNoteBtn && noteModal) {
        cancelNoteBtn.addEventListener('click', () => {
            noteModal.classList.add('hidden');
            itemToEditNote = null;
        });
    }

    if (saveNoteBtn && noteModal) {
        saveNoteBtn.addEventListener('click', () => {
            if (itemToEditNote !== null) {
                updateNote(itemToEditNote, noteInput.value);
                noteModal.classList.add('hidden');
                itemToEditNote = null;
            }
        });
    }

    if (libraryGrid) renderLibrary();
    if (statsGrid) renderStats();
    if (dashboardGrid) renderDashboard();

    function renderLibrary() {
        if (!libraryGrid) return;
        let library = JSON.parse(localStorage.getItem('starlogArchive')) || [];

        if (library.length === 0) {
            libraryGrid.innerHTML = '<p class="empty-message">No transmissions found in the archive. Please log a new entry.</p>';
        } else {
            libraryGrid.innerHTML = '';
            library.forEach(book => {
                const card = document.createElement('div');
                card.className = 'book-card';
                const noteHTML = book.notes ? `<div class="mission-note">${book.notes}</div>` : '';
                card.innerHTML = `
                    <div class="card-header">
                        <h3>${book.title}</h3>
                        <span class="genre-tag">${book.genre}</span>
                    </div>
                    <div class="card-body">
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Status:</strong> <span class="status ${book.status.toLowerCase()}">${book.status}</span></p>
                        <p><strong>Logged:</strong> ${book.dateAdded}</p>
                        ${noteHTML}
                    </div>
                    <div class="card-actions">
                        <button class="action-btn btn-note" data-id="${book.id}">Notes</button>
                        <button class="action-btn btn-update" data-id="${book.id}">Status</button>
                        <button class="action-btn btn-delete" data-id="${book.id}">Purge</button>
                    </div>
                `;
                libraryGrid.appendChild(card);
            });
            attachCardListeners();
        }
    }

    function renderDashboard() {
        if (!dashboardGrid) return;
        let library = JSON.parse(localStorage.getItem('starlogArchive')) || [];
        let readingList = library.filter(book => book.status === 'Reading');

        if (readingList.length === 0) {
            dashboardGrid.innerHTML = `<div class="mission-placeholder"><p>No active logs detected. Head to 'Log New Entry' to begin.</p></div>`;
            dashboardGrid.classList.remove('library-grid');
        } else {
            dashboardGrid.innerHTML = '';
            dashboardGrid.classList.add('library-grid');
            readingList.forEach(book => {
                const card = document.createElement('div');
                card.className = 'book-card';
                const noteHTML = book.notes ? `<div class="mission-note">${book.notes}</div>` : '';
                card.innerHTML = `
                    <div class="card-header">
                        <h3>${book.title}</h3>
                        <span class="genre-tag">${book.genre}</span>
                    </div>
                    <div class="card-body">
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Status:</strong> <span class="status ${book.status.toLowerCase()}">${book.status}</span></p>
                        <p><strong>Logged:</strong> ${book.dateAdded}</p>
                        ${noteHTML}
                    </div>
                    <div class="card-actions">
                        <button class="action-btn btn-note" data-id="${book.id}">Edit Notes</button>
                        <button class="action-btn btn-update" data-id="${book.id}">Mark Completed</button>
                    </div>
                `;
                dashboardGrid.appendChild(card);
            });
            attachCardListeners();
        }
    }

    function attachCardListeners() {
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function() {
                itemToDelete = parseInt(this.getAttribute('data-id'));
                if (deleteModal) deleteModal.classList.remove('hidden');
            });
        });

        document.querySelectorAll('.btn-update').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                toggleStatus(id);
            });
        });

        document.querySelectorAll('.btn-note').forEach(button => {
            button.addEventListener('click', function() {
                itemToEditNote = parseInt(this.getAttribute('data-id'));
                let library = JSON.parse(localStorage.getItem('starlogArchive')) || [];
                const book = library.find(b => b.id === itemToEditNote);
                if (book && noteModal) {
                    noteInput.value = book.notes || '';
                    noteModal.classList.remove('hidden');
                }
            });
        });
    }

    function renderStats() {
        if (!statsGrid) return;
        let library = JSON.parse(localStorage.getItem('starlogArchive')) || [];
        
        const totalLogs = library.length;
        const completedLogs = library.filter(book => book.status === 'Completed').length;
        const readingLogs = library.filter(book => book.status === 'Reading').length;
        
        let topGenre = "N/A";
        if (totalLogs > 0) {
            const genreCounts = {};
            library.forEach(book => {
                genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
            });
            topGenre = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b);
        }

        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${totalLogs}</div>
                <div class="stat-label">Total Transmissions</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${completedLogs}</div>
                <div class="stat-label">Missions Completed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${readingLogs}</div>
                <div class="stat-label">Active Missions</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="font-size: 2rem; margin-top: 1rem;">${topGenre}</div>
                <div class="stat-label">Primary Sector</div>
            </div>
        `;
    }

    function deleteEntry(id) {
        let library = JSON.parse(localStorage.getItem('starlogArchive')) || [];
        library = library.filter(book => book.id !== id);
        localStorage.setItem('starlogArchive', JSON.stringify(library));
        if (libraryGrid) renderLibrary();
        if (dashboardGrid) renderDashboard();
        if (statsGrid) renderStats();
    }

    function toggleStatus(id) {
        let library = JSON.parse(localStorage.getItem('starlogArchive')) || [];
        const bookIndex = library.findIndex(book => book.id === id);
        
        if (bookIndex !== -1) {
            library[bookIndex].status = library[bookIndex].status === 'Reading' ? 'Completed' : 'Reading';
            localStorage.setItem('starlogArchive', JSON.stringify(library));
            if (libraryGrid) renderLibrary();
            if (dashboardGrid) renderDashboard();
            if (statsGrid) renderStats();
        }
    }

    function updateNote(id, newNoteText) {
        let library = JSON.parse(localStorage.getItem('starlogArchive')) || [];
        const bookIndex = library.findIndex(book => book.id === id);
        
        if (bookIndex !== -1) {
            library[bookIndex].notes = newNoteText;
            localStorage.setItem('starlogArchive', JSON.stringify(library));
            if (libraryGrid) renderLibrary();
            if (dashboardGrid) renderDashboard();
        }
    }
});

document.addEventListener('mousemove', function(e) {
    for (let i = 0; i < 2; i++) {
        const star = document.createElement('div');
        star.className = 'star-dust';
        
        const size = Math.random() * 4 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        
        star.style.left = (e.pageX - size / 2 + offsetX) + 'px';
        star.style.top = (e.pageY - size / 2 + offsetY) + 'px';
        
        document.body.appendChild(star);
        
        setTimeout(() => {
            star.remove();
        }, 800);
    }
});