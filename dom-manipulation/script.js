      // Quote data structure
        let quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Motivation" },
            { text: "Life is what happens to you while you're busy making other plans.", category: "Life" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
            { text: "It is during our darkest moments that we must focus to see the light.", category: "Inspiration" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
            { text: "The only impossible journey is the one you never begin.", category: "Motivation" },
            { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Friendship" },
            { text: "The way to get started is to quit talking and begin doing.", category: "Action" },
            { text: "Don't be afraid to give up the good to go for the great.", category: "Success" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" }
        ];

        let currentCategory = 'all';
        let currentQuoteIndex = -1;

        // DOM elements
        const quoteDisplay = document.getElementById('quoteDisplay');
        const newQuoteBtn = document.getElementById('newQuote');
        const toggleAddFormBtn = document.getElementById('toggleAddForm');
        const addQuoteForm = document.getElementById('addQuoteForm');
        const newQuoteText = document.getElementById('newQuoteText');
        const newQuoteCategory = document.getElementById('newQuoteCategory');

        // Initialize the application
        function init() {
            updateStats();
            updateCategoryFilter();
            showRandomQuote();
            
            // Event listeners
            newQuoteBtn.addEventListener('click', showRandomQuote);
            toggleAddFormBtn.addEventListener('click', toggleAddQuoteForm);
            
            // Add keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                if (e.key === 'n' || e.key === 'N') {
                    showRandomQuote();
                } else if (e.key === 'a' || e.key === 'A') {
                    toggleAddQuoteForm();
                }
            });
        }

        // Show random quote function with advanced DOM manipulation
        function showRandomQuote() {
            const filteredQuotes = currentCategory === 'all' 
                ? quotes 
                : quotes.filter(quote => quote.category.toLowerCase() === currentCategory.toLowerCase());
            
            if (filteredQuotes.length === 0) {
                displayNoQuotesMessage();
                return;
            }

            // Get random quote (avoid showing the same quote twice in a row)
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            } while (randomIndex === currentQuoteIndex && filteredQuotes.length > 1);
            
            currentQuoteIndex = randomIndex;
            const selectedQuote = filteredQuotes[randomIndex];

            // Create quote elements dynamically
            const quoteContainer = document.createElement('div');
            quoteContainer.className = 'quote-animation';
            
            const quoteTextElement = document.createElement('div');
            quoteTextElement.className = 'quote-text';
            quoteTextElement.textContent = `"${selectedQuote.text}"`;
            
            const quoteCategoryElement = document.createElement('div');
            quoteCategoryElement.className = 'quote-category';
            quoteCategoryElement.textContent = `— ${selectedQuote.category}`;
            
            // Clear and append new elements
            quoteDisplay.innerHTML = '';
            quoteContainer.appendChild(quoteTextElement);
            quoteContainer.appendChild(quoteCategoryElement);
            quoteDisplay.appendChild(quoteContainer);

            // Add click-to-copy functionality
            quoteDisplay.addEventListener('click', function() {
                copyToClipboard(selectedQuote.text);
            });
        }

        // Create and manage add quote form
        function createAddQuoteForm() {
            // Form is already created in HTML, just toggle visibility
            toggleAddQuoteForm();
        }

        function toggleAddQuoteForm() {
            addQuoteForm.classList.toggle('hidden');
            if (!addQuoteForm.classList.contains('hidden')) {
                newQuoteText.focus();
                toggleAddFormBtn.textContent = 'Cancel';
            } else {
                toggleAddFormBtn.textContent = 'Add Your Own Quote';
                clearForm();
            }
        }

        // Add new quote with validation and DOM updates
        function addQuote() {
            const text = newQuoteText.value.trim();
            const category = newQuoteCategory.value.trim();

            // Validation
            if (!text || !category) {
                showMessage('Please fill in both fields!', 'error');
                return;
            }

            if (text.length < 10) {
                showMessage('Quote must be at least 10 characters long!', 'error');
                return;
            }

            // Check for duplicates
            const isDuplicate = quotes.some(quote => 
                quote.text.toLowerCase() === text.toLowerCase()
            );

            if (isDuplicate) {
                showMessage('This quote already exists!', 'error');
                return;
            }

            // Add new quote
            const newQuote = {
                text: text,
                category: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
            };

            quotes.push(newQuote);
            
            // Update UI
            updateStats();
            updateCategoryFilter();
            clearForm();
            toggleAddQuoteForm();
            
            showMessage('Quote added successfully!', 'success');
            
            // Show the new quote
            setTimeout(() => {
                currentCategory = 'all';
                updateCategoryButtons();
                showRandomQuote();
            }, 1500);
        }

        function cancelAddQuote() {
            toggleAddQuoteForm();
        }

        // Update statistics
        function updateStats() {
            document.getElementById('totalQuotes').textContent = quotes.length;
            
            const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
            document.getElementById('totalCategories').textContent = uniqueCategories.length;
        }

        // Update category filter buttons
        function updateCategoryFilter() {
            const categoryFilter = document.querySelector('.category-filter');
            const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
            
            // Keep the "All Categories" button and add category-specific buttons
            const allButton = categoryFilter.querySelector('[data-category="all"]');
            categoryFilter.innerHTML = '';
            categoryFilter.appendChild(allButton);
            
            uniqueCategories.forEach(category => {
                const button = document.createElement('button');
                button.className = 'category-btn';
                button.setAttribute('data-category', category);
                button.textContent = category;
                button.addEventListener('click', () => filterByCategory(category));
                categoryFilter.appendChild(button);
            });

            // Re-add event listener for "All Categories" button
            allButton.addEventListener('click', () => filterByCategory('all'));
        }

        // Filter quotes by category
        function filterByCategory(category) {
            currentCategory = category;
            updateCategoryButtons();
            showRandomQuote();
        }

        function updateCategoryButtons() {
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-category') === currentCategory) {
                    btn.classList.add('active');
                }
            });
        }

        // Display message when no quotes available
        function displayNoQuotesMessage() {
            quoteDisplay.innerHTML = `
                <div style="text-align: center; opacity: 0.7;">
                    <p style="font-size: 1.2em; margin: 0;">No quotes available for "${currentCategory}" category.</p>
                    <p style="font-size: 0.9em; margin-top: 10px;">Try adding some quotes or select a different category!</p>
                </div>
            `;
        }

        // Utility functions
        function clearForm() {
            newQuoteText.value = '';
            newQuoteCategory.value = '';
        }

        function showMessage(message, type) {
            const existingMessage = document.querySelector('.success-message, .error-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
            messageDiv.textContent = message;
            
            if (type === 'error') {
                messageDiv.style.background = 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)';
            }
            
            addQuoteForm.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 3000);
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showTemporaryMessage('Quote copied to clipboard!');
            }).catch(() => {
                showTemporaryMessage('Failed to copy quote');
            });
        }

        function showTemporaryMessage(message) {
            const tempMessage = document.createElement('div');
            tempMessage.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            `;
            tempMessage.textContent = message;
            document.body.appendChild(tempMessage);
            
            setTimeout(() => {
                tempMessage.remove();
            }, 2000);
        }

        // Initialize the application when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);
