document.addEventListener('DOMContentLoaded', () => {
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
                        <button class="action-btn btn-update" data-id="${book.id}">Mark Completed</button>
                    </div>
                `;
                dashboardGrid.appendChild(card);
            });

            document.querySelectorAll('#dashboard-grid .btn-update').forEach(button => {
                button.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    toggleStatus(id);
                });
            });
        }
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