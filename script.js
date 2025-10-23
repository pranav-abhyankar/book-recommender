// Data storage
        let currentBooks = [];
        let library = JSON.parse(localStorage.getItem('library')) || [];
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        let readingHistory = JSON.parse(localStorage.getItem('history')) || [];

        // Initialize
        window.addEventListener('load', () => {
            searchBooks();
            updateStats();
            document.getElementById('searchInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') searchBooks();
            });
        });

        // Tab switching
        function switchTab(tab) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            
            if (tab === 'discover') {
                document.getElementById('discoverSection').classList.add('active');
                event.target.classList.add('active');
            } else if (tab === 'library') {
                document.getElementById('librarySection').classList.add('active');
                event.target.classList.add('active');
                displayLibrary();
            } else if (tab === 'recommendations') {
                document.getElementById('recommendationsSection').classList.add('active');
                event.target.classList.add('active');
            }
        }

        // Search functionality
        async function searchBooks() {
            const query = document.getElementById('searchInput').value.trim() || 'bestsellers';
            const category = document.getElementById('categoryFilter').value;
            const sort = document.getElementById('sortFilter').value;
            const lang = document.getElementById('langFilter').value;
            const printType = document.getElementById('printFilter').value;

            let searchQuery = query;
            if (category) searchQuery += `+subject:${category}`;

            const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=40&orderBy=${sort}&langRestrict=${lang}&printType=${printType}`;

            showLoading(true);
            hideEmpty();

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.items && data.items.length > 0) {
                    currentBooks = data.items;
                    displayBooks(currentBooks, 'booksGrid');
                    document.getElementById('totalBooks').textContent = data.items.length;
                } else {
                    showEmpty();
                }
            } catch (error) {
                console.error('Error:', error);
                showEmpty();
            } finally {
                showLoading(false);
            }
        }

        function quickSearch(term) {
            document.getElementById('searchInput').value = term;
            searchBooks();
        }

        // Display books
        function displayBooks(books, gridId) {
            const grid = document.getElementById(gridId);
            grid.innerHTML = '';

            books.forEach(book => {
                const info = book.volumeInfo;
                const bookId = book.id;
                const isFavorite = favorites.includes(bookId);
                const isInLibrary = library.some(b => b.id === bookId);

                const card = document.createElement('div');
                card.className = 'book-card';
                card.onclick = (e) => {
                    if (!e.target.closest('.quick-btn')) {
                        showBookDetails(book);
                    }
                };

                const thumbnail = info.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/280x400?text=No+Cover';
                const title = info.title || 'Unknown Title';
                const authors = info.authors?.join(', ') || 'Unknown Author';
                const rating = info.averageRating || 'N/A';
                const pages = info.pageCount || 'N/A';
                const categories = info.categories?.slice(0, 2) || [];

                card.innerHTML = `
                    <div class="book-cover-wrapper">
                        <img src="${thumbnail}" alt="${title}" class="book-cover">
                        <div class="book-badge">${rating !== 'N/A' ? '⭐ ' + rating : 'NEW'}</div>
                        <div class="quick-actions">
                            <button class="quick-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite('${bookId}', event)" title="Add to Favorites">
                                ${isFavorite ? '❤️' : '🤍'}
                            </button>
                            <button class="quick-btn ${isInLibrary ? 'active' : ''}" onclick="toggleLibrary('${bookId}', event)" title="Add to Library">
                                ${isInLibrary ? '📚' : '➕'}
                            </button>
                        </div>
                    </div>
                    <div class="book-info">
                        <div class="book-title">${title}</div>
                        <div class="book-author">by ${authors}</div>
                        <div class="book-meta">
                            <div class="book-rating">
                                <span>⭐</span>
                                <span>${rating}</span>
                            </div>
                            <div class="book-pages">${pages} pages</div>
                        </div>
                        ${categories.length > 0 ? `
                            <div class="book-tags">
                                ${categories.map(cat => `<span class="book-tag">${cat}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;

                grid.appendChild(card);
            });
        }

        // Favorites and Library management
        function toggleFavorite(bookId, event) {
            event.stopPropagation();
            const index = favorites.indexOf(bookId);
            
            if (index > -1) {
                favorites.splice(index, 1);
            } else {
                favorites.push(bookId);
            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateStats();
            
            // Refresh current view
            if (document.getElementById('discoverSection').classList.contains('active')) {
                displayBooks(currentBooks, 'booksGrid');
            }
        }

        function toggleLibrary(bookId, event) {
            event.stopPropagation();
            const book = currentBooks.find(b => b.id === bookId);
            const index = library.findIndex(b => b.id === bookId);
            
            if (index > -1) {
                library.splice(index, 1);
            } else {
                library.push({
                    id: bookId,
                    data: book,
                    status: 'want',
                    addedDate: new Date().toISOString()
                });
            }
            
            localStorage.setItem('library', JSON.stringify(library));
            updateStats();
            
            // Refresh current view
            if (document.getElementById('discoverSection').classList.contains('active')) {
                displayBooks(currentBooks, 'booksGrid');
            } else if (document.getElementById('librarySection').classList.contains('active')) {
                displayLibrary();
            }
        }

        // Display Library
        function displayLibrary() {
            const container = document.getElementById('libraryList');
            
            if (library.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #94a3b8;">
                        <div style="font-size: 3em; margin-bottom: 20px;">📚</div>
                        <h3>Your library is empty</h3>
                        <p>Start adding books from the Discover section!</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = library.map(item => {
                const info = item.data.volumeInfo;
                const thumbnail = info.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/80x120?text=No+Cover';
                const title = info.title || 'Unknown';
                const authors = info.authors?.join(', ') || 'Unknown Author';
                
                return `
                    <div class="list-item">
                        <img src="${thumbnail}" class="list-item-cover">
                        <div class="list-item-info">
                            <div class="list-item-title">${title}</div>
                            <div class="book-author">${authors}</div>
                            <div class="list-item-actions">
                                <select class="status-badge status-${item.status}" onchange="updateStatus('${item.id}', this.value)">
                                    <option value="want" ${item.status === 'want' ? 'selected' : ''}>📚 Want to Read</option>
                                    <option value="reading" ${item.status === 'reading' ? 'selected' : ''}>📖 Reading</option>
                                    <option value="finished" ${item.status === 'finished' ? 'selected' : ''}>✅ Finished</option>
                                </select>
                                <button class="btn btn-secondary" style="padding: 8px 16px;" onclick="viewBookFromLibrary('${item.id}')">View Details</button>
                                <button class="btn" style="padding: 8px 16px; background: #fee; color: #c00;" onclick="removeFromLibrary('${item.id}')">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function updateStatus(bookId, status) {
            const book = library.find(b => b.id === bookId);
            if (book) {
                book.status = status;
                localStorage.setItem('library', JSON.stringify(library));
                displayLibrary();
            }
        }

        function removeFromLibrary(bookId) {
            library = library.filter(b => b.id !== bookId);
            localStorage.setItem('library', JSON.stringify(library));
            updateStats();
            displayLibrary();
        }

        function viewBookFromLibrary(bookId) {
            const book = library.find(b => b.id === bookId);
            if (book) {
                showBookDetails(book.data);
            }
        }

        // AI Recommendations
        async function getRecommendations() {
            const input = document.getElementById('recommendInput').value.trim();
            if (!input) return;

            const grid = document.getElementById('recommendationsGrid');
            grid.innerHTML = '<div class="loading"><div class="spinner"></div><p>Finding similar books...</p></div>';

            try {
                // Search for the input book
                const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(input)}&maxResults=1`;
                const searchRes = await fetch(searchUrl);
                const searchData = await searchRes.json();

                if (!searchData.items || searchData.items.length === 0) {
                    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🤔</div><h3>Book not found</h3><p>Try entering a different book title</p></div>';
                    return;
                }

                const baseBook = searchData.items[0];
                const categories = baseBook.volumeInfo.categories?.[0] || '';
                const authors = baseBook.volumeInfo.authors?.[0] || '';

                // Get recommendations based on category and author
                const recQuery = categories ? `subject:${categories}` : `${authors}`;
                const recUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(recQuery)}&maxResults=30&orderBy=relevance`;
                
                const recRes = await fetch(recUrl);
                const recData = await recRes.json();

                if (recData.items) {
                    // Filter out the original book and add similarity scores
                    const recommendations = recData.items
                        .filter(book => book.id !== baseBook.id)
                        .map(book => {
                            // Calculate similarity score (simplified)
                            let score = 50;
                            const bookCats = book.volumeInfo.categories || [];
                            const bookAuthors = book.volumeInfo.authors || [];
                            
                            if (bookCats.some(cat => categories.includes(cat))) score += 30;
                            if (bookAuthors.includes(authors)) score += 20;
                            
                            book.similarityScore = Math.min(score, 98);
                            return book;
                        })
                        .sort((a, b) => b.similarityScore - a.similarityScore)
                        .slice(0, 20);

                    displayRecommendations(recommendations, baseBook);
                } else {
                    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">📚</div><h3>No recommendations found</h3></div>';
                }
            } catch (error) {
                console.error('Error:', error);
                grid.innerHTML = '<div class="empty-state"><div class="empty-icon">❌</div><h3>Error loading recommendations</h3></div>';
            }
        }

        function displayRecommendations(books, baseBook) {
            const grid = document.getElementById('recommendationsGrid');
            grid.innerHTML = `
                <div style="grid-column: 1/-1; background: white; padding: 30px; border-radius: 15px; margin-bottom: 20px;">
                    <h3 style="color: var(--primary); margin-bottom: 15px;">📖 Based on: ${baseBook.volumeInfo.title}</h3>
                    <p style="color: #64748b;">We found ${books.length} similar books you might enjoy!</p>
                </div>
            `;

            books.forEach(book => {
                const info = book.volumeInfo;
                const bookId = book.id;
                const isFavorite = favorites.includes(bookId);
                const isInLibrary = library.some(b => b.id === bookId);

                const card = document.createElement('div');
                card.className = 'book-card';
                card.onclick = (e) => {
                    if (!e.target.closest('.quick-btn')) {
                        showBookDetails(book);
                    }
                };

                const thumbnail = info.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/280x400?text=No+Cover';
                const title = info.title || 'Unknown Title';
                const authors = info.authors?.join(', ') || 'Unknown Author';
                const rating = info.averageRating || 'N/A';
                const similarity = book.similarityScore || 0;

                card.innerHTML = `
                    <div class="book-cover-wrapper">
                        <img src="${thumbnail}" alt="${title}" class="book-cover">
                        <div class="book-badge">${similarity}% Match</div>
                        <div class="quick-actions">
                            <button class="quick-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite('${bookId}', event)">
                                ${isFavorite ? '❤️' : '🤍'}
                            </button>
                            <button class="quick-btn ${isInLibrary ? 'active' : ''}" onclick="toggleLibrary('${bookId}', event)">
                                ${isInLibrary ? '📚' : '➕'}
                            </button>
                        </div>
                    </div>
                    <div class="book-info">
                        <div class="book-title">${title}</div>
                        <div class="book-author">by ${authors}</div>
                        <div class="book-meta">
                            <div class="book-rating">
                                <span>⭐</span>
                                <span>${rating}</span>
                            </div>
                        </div>
                        <div class="similarity-bar">
                            <div class="similarity-fill" style="width: ${similarity}%"></div>
                        </div>
                    </div>
                `;

                grid.appendChild(card);
            });
        }

        // Book Details Modal
        function showBookDetails(book) {
            const info = book.volumeInfo;
            const modal = document.getElementById('bookModal');
            const modalBody = document.getElementById('modalBody');

            const thumbnail = info.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/220x330?text=No+Cover';
            const title = info.title || 'Unknown Title';
            const authors = info.authors?.join(', ') || 'Unknown Author';
            const publisher = info.publisher || 'Unknown';
            const publishedDate = info.publishedDate || 'Unknown';
            const pages = info.pageCount || 'N/A';
            const rating = info.averageRating || 'N/A';
            const ratingsCount = info.ratingsCount || 0;
            const categories = info.categories?.join(', ') || 'N/A';
            const language = info.language?.toUpperCase() || 'N/A';
            const description = info.description || 'No description available.';
            const isbn = info.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || 'N/A';

            const isFavorite = favorites.includes(book.id);
            const isInLibrary = library.some(b => b.id === book.id);

            modalBody.innerHTML = `
                <div class="modal-book-header">
                    <img src="${thumbnail}" class="modal-cover">
                    <div class="modal-info">
                        <h2>${title}</h2>
                        <div class="modal-meta">
                            <div class="meta-item">
                                <span class="meta-label">Author:</span>
                                <span>${authors}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Publisher:</span>
                                <span>${publisher}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Published:</span>
                                <span>${publishedDate}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Pages:</span>
                                <span>${pages}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Rating:</span>
                                <span>⭐ ${rating} (${ratingsCount} reviews)</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Categories:</span>
                                <span>${categories}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Language:</span>
                                <span>${language}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">ISBN:</span>
                                <span>${isbn}</span>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button class="btn ${isFavorite ? 'btn-primary' : 'btn-secondary'}" onclick="toggleFavoriteFromModal('${book.id}')">
                                ${isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                            </button>
                            <button class="btn ${isInLibrary ? 'btn-primary' : 'btn-secondary'}" onclick="toggleLibraryFromModal('${book.id}')">
                                ${isInLibrary ? '📚 In Library' : '➕ Add to Library'}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 class="section-title">📄 Description</h3>
                    <p style="line-height: 1.8; color: #475569;">${description}</p>
                </div>
                ${info.previewLink ? `
                    <div style="margin-top: 30px;">
                        <a href="${info.previewLink}" target="_blank" class="btn btn-primary" style="display: inline-block; text-decoration: none;">
                            📖 Preview on Google Books
                        </a>
                    </div>
                ` : ''}
            `;

            modal.style.display = 'block';
            
            // Add to reading history
            if (!readingHistory.includes(book.id)) {
                readingHistory.push(book.id);
                localStorage.setItem('history', JSON.stringify(readingHistory));
            }
        }

        function toggleFavoriteFromModal(bookId) {
            toggleFavorite(bookId, { stopPropagation: () => {} });
            closeModal();
        }

        function toggleLibraryFromModal(bookId) {
            const book = currentBooks.find(b => b.id === bookId);
            if (book) {
                toggleLibrary(bookId, { stopPropagation: () => {} });
                closeModal();
            }
        }

        function closeModal() {
            document.getElementById('bookModal').style.display = 'none';
        }

        window.onclick = function(event) {
            const modal = document.getElementById('bookModal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // Voice Search
        function startVoiceSearch() {
            if ('webkitSpeechRecognition' in window) {
                const recognition = new webkitSpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;

                recognition.onstart = function() {
                    document.querySelector('.voice-search').textContent = '🎙️';
                };

                recognition.onresult = function(event) {
                    const transcript = event.results[0][0].transcript;
                    document.getElementById('searchInput').value = transcript;
                    searchBooks();
                };

                recognition.onerror = function(event) {
                    console.error('Speech recognition error:', event.error);
                    alert('Voice search not available. Please type your search.');
                };

                recognition.onend = function() {
                    document.querySelector('.voice-search').textContent = '🎤';
                };

                recognition.start();
            } else {
                alert('Voice search is not supported in your browser. Please use Chrome.');
            }
        }

        // Utility functions
        function updateStats() {
            document.getElementById('libraryCount').textContent = library.length;
            document.getElementById('favoriteCount').textContent = favorites.length;
        }

        function showLoading(show) {
            document.getElementById('loading').style.display = show ? 'block' : 'none';
            document.getElementById('booksGrid').style.display = show ? 'none' : 'grid';
        }

        function showEmpty() {
            document.getElementById('emptyState').style.display = 'block';
            document.getElementById('booksGrid').style.display = 'none';
        }

        function hideEmpty() {
            document.getElementById('emptyState').style.display = 'none';
        }