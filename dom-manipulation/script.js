// Initialize quotes array with sample data
        let quotes = [
            {
                text: "The only way to do great work is to love what you do.",
                category: "Motivation",
                author: "Steve Jobs"
            },
            {
                text: "Life is what happens to you while you're busy making other plans.",
                category: "Life",
                author: "John Lennon"
            },
            {
                text: "The future belongs to those who believe in the beauty of their dreams.",
                category: "Dreams",
                author: "Eleanor Roosevelt"
            },
            {
                text: "In the middle of difficulty lies opportunity.",
                category: "Opportunity",
                author: "Albert Einstein"
            },
            {
                text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                category: "Success",
                author: "Winston Churchill"
            },
            {
                text: "The only impossible journey is the one you never begin.",
                category: "Motivation",
                author: "Tony Robbins"
            },
            {
                text: "Wisdom begins in wonder.",
                category: "Wisdom",
                author: "Socrates"
            },
            {
                text: "Be yourself; everyone else is already taken.",
                category: "Authenticity",
                author: "Oscar Wilde"
            }
        ];

        // Storage keys
        const STORAGE_KEY = 'dynamicQuoteGenerator_quotes';
        const SESSION_KEY = 'dynamicQuoteGenerator_lastQuote';
        const FILTER_KEY = 'dynamicQuoteGenerator_lastFilter';

        // DOM elements
        const quoteDisplay = document.getElementById('quoteDisplay');
        const newQuoteButton = document.getElementById('newQuote');
        const toggleFormButton = document.getElementById('toggleForm');
        const addQuoteContainer = document.getElementById('addQuoteContainer');
        const importExportContainer = document.getElementById('importExportContainer');
        const categoryFilter = document.getElementById('categoryFilter');
        const totalQuotesElement = document.getElementById('totalQuotes');
        const totalCategoriesElement = document.getElementById('totalCategories');
        const filteredQuotesElement = document.getElementById('filteredQuotes');
        const exportButton = document.getElementById('exportQuotes');
        const clearStorageButton = document.getElementById('clearStorage');

        // Current quote tracker
        let currentQuote = null;
        let currentFilter = 'all';

        // Storage Functions
        function saveQuotes() {
            try {
                const quotesData = JSON.stringify(quotes);
                localStorage.setItem(STORAGE_KEY, quotesData);
                console.log('Quotes saved to localStorage');
            } catch (error) {
                console.error('Error saving quotes:', error);
                showNotification('Error saving quotes. Storage might be full.', 'error');
            }
        }

        function loadQuotes() {
            try {
                const storedQuotes = localStorage.getItem(STORAGE_KEY);
                if (storedQuotes) {
                    const parsedQuotes = JSON.parse(storedQuotes);
                    if (Array.isArray(parsedQuotes) && parsedQuotes.length > 0) {
                        quotes = parsedQuotes;
                        console.log('Quotes loaded from localStorage');
                        return true;
                    }
                }
            } catch (error) {
                console.error('Error loading quotes:', error);
                showNotification('Error loading saved quotes. Using default quotes.', 'error');
            }
            return false;
        }

        function saveLastQuote(quote) {
            try {
                const quoteData = JSON.stringify(quote);
                sessionStorage.setItem(SESSION_KEY, quoteData);
            } catch (error) {
                console.error('Error saving last quote:', error);
            }
        }

        function loadLastQuote() {
            try {
                const lastQuote = sessionStorage.getItem(SESSION_KEY);
                if (lastQuote) {
                    return JSON.parse(lastQuote);
                }
            } catch (error) {
                console.error('Error loading last quote:', error);
            }
            return null;
        }

        function saveLastFilter(filter) {
            try {
                localStorage.setItem(FILTER_KEY, filter);
            } catch (error) {
                console.error('Error saving last filter:', error);
            }
        }

        function loadLastFilter() {
            try {
                return localStorage.getItem(FILTER_KEY) || 'all';
            } catch (error) {
                console.error('Error loading last filter:', error);
                return 'all';
            }
        }

        // NEW: Populate Categories Function
        function populateCategories() {
            const categories = [...new Set(quotes.map(quote => quote.category))].sort();
            const currentSelection = categoryFilter.value;
            
            // Clear existing options except "All Categories"
            categoryFilter.innerHTML = '<option value="all">All Categories</option>';
            
            // Add category options
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });

            // Restore previous selection if it still exists
            if (categories.includes(currentSelection)) {
                categoryFilter.value = currentSelection;
            }
        }

        // NEW: Filter Quotes Function
        function filterQuotes() {
            const selectedCategory = categoryFilter.value;
            currentFilter = selectedCategory;
            
            // Save the selected filter to localStorage
            saveLastFilter(selectedCategory);
            
            // Update filtered quotes count
            updateFilteredQuotesCount();
            
            // Show a quote from the filtered category
            showRandomQuote();
            
            // Update visual feedback
            updateFilterFeedback();
        }

        function updateFilteredQuotesCount() {
            let filteredCount = quotes.length;
            if (currentFilter !== 'all') {
                filteredCount = quotes.filter(quote => quote.category === currentFilter).length;
            }
            filteredQuotesElement.textContent = filteredCount;
        }

        function updateFilterFeedback() {
            const filterLabel = categoryFilter.parentElement.querySelector('label');
            if (currentFilter === 'all') {
                filterLabel.textContent = 'Filter by Category:';
            } else {
                filterLabel.textContent = `Showing ${currentFilter} quotes:`;
            }
        }

        // Enhanced Show Random Quote Function
        function showRandomQuote() {
            let availableQuotes = quotes;

            // Filter quotes by category if not 'all'
            if (currentFilter !== 'all') {
                availableQuotes = quotes.filter(quote => quote.category === currentFilter);
            }

            if (availableQuotes.length === 0) {
                quoteDisplay.innerHTML = '<div class="empty-state">No quotes available in this category.</div>';
                return;
            }

            // Select random quote
            const randomIndex = Math.floor(Math.random() * availableQuotes.length);
            const selectedQuote = availableQuotes[randomIndex];

            // Save current quote to session storage
            currentQuote = selectedQuote;
            saveLastQuote(selectedQuote);

            // Create DOM elements for the quote
            const quoteElement = document.createElement('div');
            quoteElement.innerHTML = `
                <div class="quote-text">"${selectedQuote.text}"</div>
                <div class="quote-category">${selectedQuote.category}</div>
                ${selectedQuote.author ? `<div class="quote-author">— ${selectedQuote.author}</div>` : ''}
            `;

            // Clear previous content and add new quote
            quoteDisplay.innerHTML = '';
            quoteDisplay.appendChild(quoteElement);

            // Add animation effect
            quoteElement.style.opacity = '0';
            quoteElement.style.transform = 'translateY(20px)';
            setTimeout(() => {
                quoteElement.style.transition = 'all 0.5s ease';
                quoteElement.style.opacity = '1';
                quoteElement.style.transform = 'translateY(0)';
            }, 10);
        }

        // Enhanced Add Quote Function
        function addQuote() {
            const newQuoteText = document.getElementById('newQuoteText').value.trim();
            const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();
            const newQuoteAuthor = document.getElementById('newQuoteAuthor').value.trim();

            // Validate input
            if (!newQuoteText || !newQuoteCategory) {
                showNotification('Please fill in both quote text and category fields.', 'error');
                return;
            }

            // Create new quote object
            const newQuote = {
                text:
                    
