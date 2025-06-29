// Quote data structure
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
    { text: "Life is what happens to you while you're busy making other plans.", category: "Life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "It is during our darkest moments that we must focus to see the light.", category: "Perseverance" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "The only impossible journey is the one you never begin.", category: "Motivation" },
    { text: "In the middle of difficulty lies opportunity.", category: "Opportunity" },
    { text: "Believe you can and you're halfway there.", category: "Confidence" },
    { text: "The way to get started is to quit talking and begin doing.", category: "Action" }
];

// Global variables
let currentFilter = 'all';
let isFormVisible = false;

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const toggleFormBtn = document.getElementById('toggleAddForm');
const addQuoteForm = document.getElementById('addQuoteForm');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const categoryFilters = document.getElementById('categoryFilters');
const totalQuotesEl = document.getElementById('totalQuotes');
const totalCategoriesEl = document.getElementById('totalCategories');
const currentFilterEl = document.getElementById('currentFilter');

/**
 * Initialize the application
 */
function init() {
    updateStats();
    createCategoryFilters();
    displayRandomQuote(); // Use displayRandomQuote instead of showRandomQuote
    
    // Event listeners - specifically for "Show New Quote" button
    newQuoteBtn.addEventListener('click', displayRandomQuote);
    toggleFormBtn.addEventListener('click', toggleAddQuoteForm);
    
    // Add keyboard support for form
    newQuoteText.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            addQuote();
        }
    });
    
    newQuoteCategory.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addQuote();
        }
    });
}

/**
 * Display a random quote - Core function for random quote selection and DOM update
 * Uses innerHTML for direct DOM manipulation as required
 */
function displayRandomQuote() {
    // Filter quotes based on current filter
    const filteredQuotes = currentFilter === 'all' ? 
        quotes : quotes.filter(quote => quote.category.toLowerCase() === currentFilter.toLowerCase());
    
    // Handle empty filter results
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `
            <div class="quote-text">"No quotes found in this category."</div>
            <div class="quote-category">— Try adding some!</div>
        `;
        return;
    }
    
    // Select random quote from filtered results using Math.random()
    const random = Math.floor(Math.random() * filteredQuotes.length);
    const selectedQuote = filteredQuotes[random];
    
    // Update DOM directly using innerHTML
    quoteDisplay.innerHTML = `
        <div class="quote-text fade-in">"${selectedQuote.text}"</div>
        <div class="quote-category fade-in">— ${selectedQuote.category}</div>
    `;
    
    // Add visual feedback animation
    quoteDisplay.style.transform = 'scale(1.02)';
    setTimeout(() => {
        quoteDisplay.style.transform = 'scale(1)';
    }, 200);
    
    console.log('Random quote displayed:', selectedQuote);
}

/**
 * Legacy function name support - calls displayRandomQuote
 */
function showRandomQuote() {
    displayRandomQuote();
}

/**
 * Display a quote with animation effects
 * Advanced DOM manipulation for content display
 */
function displayQuote(text, category) {
    // Create new quote text element
    const quoteTextEl = document.createElement('div');
    quoteTextEl.className = 'quote-text fade-in';
    quoteTextEl.textContent = `"${text}"`;
    
    // Create new quote category element
    const quoteCategoryEl = document.createElement('div');
    quoteCategoryEl.className = 'quote-category fade-in';
    quoteCategoryEl.textContent = `— ${category}`;
    
    // Clear existing content and add new elements
    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(quoteTextEl);
    quoteDisplay.appendChild(quoteCategoryEl);
    
    // Add visual feedback animation
    quoteDisplay.style.transform = 'scale(1.02)';
    setTimeout(() => {
        quoteDisplay.style.transform = 'scale(1)';
    }, 200);
}

/**
 * Create and manage the add quote form interface
 * Dynamic form creation and management
 */
function createAddQuoteForm() {
    // This function demonstrates form creation, but the form is already in HTML
    // In a fully dynamic approach, you would create the form elements here
    const form = document.createElement('div');
    form.id = 'dynamicAddQuoteForm';
    form.innerHTML = `
        <h3>Add a New Quote</h3>
        <div class="form-group">
            <label for="dynamicQuoteText">Quote Text:</label>
            <textarea id="dynamicQuoteText" placeholder="Enter your inspirational quote here..."></textarea>
        </div>
        <div class="form-group">
            <label for="dynamicQuoteCategory">Category:</label>
            <input type="text" id="dynamicQuoteCategory" placeholder="e.g., Motivation, Wisdom, Success">
        </div>
        <div class="form-buttons">
            <button onclick="cancelAddQuote()" class="cancel-btn">Cancel</button>
            <button onclick="addQuoteFromDynamic()">Add Quote</button>
        </div>
    `;
    return form;
}

/**
 * Toggle the visibility of the add quote form
 */
function toggleAddQuoteForm() {
    isFormVisible = !isFormVisible;
    
    if (isFormVisible) {
        addQuoteForm.style.display = 'block';
        addQuoteForm.classList.add('slide-in');
        toggleFormBtn.textContent = 'Cancel';
        newQuoteText.focus();
    } else {
        addQuoteForm.style.display = 'none';
        toggleFormBtn.textContent = 'Add New Quote';
        clearForm();
    }
}

/**
 * Add a new quote to the collection
 * Core function for dynamic content addition with array manipulation and DOM updates
 */
function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();
    
    // Validate input
    if (!text || !category) {
        alert('Please fill in both the quote text and category.');
        return;
    }
    
    // Create new quote object
    const newQuote = {
        text: text,
        category: category
    };
    
    // Add to quotes array - direct array manipulation
    quotes.push(newQuote);
    console.log('Quote added to array:', newQuote);
    console.log('Updated quotes array length:', quotes.length);
    
    // Update the DOM dynamically
    updateStats(); // Update statistics display
    createCategoryFilters(); // Recreate category filter buttons
    clearForm(); // Clear the form inputs
    toggleAddQuoteForm(); // Hide the form
    
    // Display the newly added quote immediately using innerHTML
    quoteDisplay.innerHTML = `
        <div class="quote-text fade-in">"${newQuote.text}"</div>
        <div class="quote-category fade-in">— ${newQuote.category}</div>
    `;
    
    // Show success notification
    showNotification('Quote added successfully!');
    
    // Debug logging
    console.log('DOM updated after adding quote');
    console.log('Total quotes now:', quotes.length);
}

/**
 * Cancel adding a quote and hide the form
 */
function cancelAddQuote() {
    toggleAddQuoteForm();
}

/**
 * Clear the form inputs
 */
function clearForm() {
    newQuoteText.value = '';
    newQuoteCategory.value = '';
}

/**
 * Create category filter buttons dynamically
 * Advanced DOM manipulation for interactive filtering
 */
function createCategoryFilters() {
    // Extract unique categories from quotes
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // Clear existing filter buttons
    categoryFilters.innerHTML = '';
    
    // Create and add "All" filter button
    const allBtn = createCategoryButton('All', 'all');
    categoryFilters.appendChild(allBtn);
    
    // Create and add category-specific filter buttons
    categories.forEach(category => {
        const btn = createCategoryButton(category, category);
        categoryFilters.appendChild(btn);
    });
}

/**
 * Create an individual category filter button
 * DOM element creation with event handling
 */
function createCategoryButton(displayText, filterValue) {
    // Create button element
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.textContent = displayText;
    
    // Set active state if this is the current filter
    if (filterValue.toLowerCase() === currentFilter.toLowerCase()) {
        btn.classList.add('active');
    }
    
    // Add click event listener for filtering
    btn.addEventListener('click', () => {
        // Update global filter state
        currentFilter = filterValue;
        
        // Update button visual states
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update statistics and display new quote
        updateStats();
        displayRandomQuote(); // Use displayRandomQuote for consistency
        
        console.log('Filter changed to:', currentFilter);
    });
    
    return btn;
}

/**
 * Update application statistics display
 * Dynamic content updates based on data changes
 */
function updateStats() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // Update DOM elements with current statistics
    totalQuotesEl.textContent = quotes.length;
    totalCategoriesEl.textContent = categories.length;
    currentFilterEl.textContent = currentFilter === 'all' ? 'All' : currentFilter;
}

/**
 * Show a temporary notification to the user
 * Dynamic element creation for user feedback
 */
function showNotification(message) {
    // Create notification element dynamically
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-weight: bold;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after delay with animation
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Advanced DOM manipulation examples
 */

// Example: Dynamically create a complex quote card
function createQuoteCard(quote) {
    const card = document.createElement('div');
    card.className = 'quote-card';
    
    const text = document.createElement('p');
    text.className = 'card-text';
    text.textContent = quote.text;
    
    const category = document.createElement('span');
    category.className = 'card-category';
    category.textContent = quote.category;
    
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editQuote(quote));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteQuote(quote));
    
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    
    card.appendChild(text);
    card.appendChild(category);
    card.appendChild(actions);
    
    return card;
}

// Example: Dynamic search functionality
function createSearchInterface() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search quotes...';
    searchInput.addEventListener('input', (e) => {
        filterQuotesBySearch(e.target.value);
    });
    
    const searchResults = document.createElement('div');
    searchResults.id = 'searchResults';
    searchResults.className = 'search-results';
    
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchResults);
    
    return searchContainer;
}

// Example: Filter quotes by search term
function filterQuotesBySearch(searchTerm) {
    const results = quotes.filter(quote => 
        quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const resultsContainer = document.getElementById('searchResults');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
        
        results.forEach(quote => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.textContent = `"${quote.text}" - ${quote.category}`;
            resultItem.addEventListener('click', () => {
                displayQuote(quote.text, quote.category);
            });
            resultsContainer.appendChild(resultItem);
        });
    }
}

// Example: Edit quote functionality
function editQuote(quote) {
    const newText = prompt('Edit quote text:', quote.text);
    const newCategory = prompt('Edit category:', quote.category);
    
    if (newText && newCategory) {
        quote.text = newText;
        quote.category = newCategory;
        updateStats();
        createCategoryFilters();
        showNotification('Quote updated successfully!');
    }
}

// Example: Delete quote functionality
function deleteQuote(quoteToDelete) {
    if (confirm('Are you sure you want to delete this quote?')) {
        const index = quotes.findIndex(quote => quote === quoteToDelete);
        if (index > -1) {
            quotes.splice(index, 1);
            updateStats();
            createCategoryFilters();
            displayRandomQuote(); // Use displayRandomQuote consistently
            showNotification('Quote deleted successfully!');
        }
    }
}

// Example: Export quotes functionality
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'quotes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Example: Import quotes functionality
function createImportInterface() {
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedQuotes = JSON.parse(e.target.result);
                    quotes.push(...importedQuotes);
                    updateStats();
                    createCategoryFilters();
                    showNotification('Quotes imported successfully!');
                } catch (error) {
                    alert('Error importing quotes: Invalid file format');
                }
            };
            reader.readAsText(file);
        }
    });
    
    return importInput;
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Example: Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Spacebar to show new quote
    if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        displayRandomQuote(); // Use displayRandomQuote consistently
    }
    
    // Ctrl+N to add new quote
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        toggleAddQuoteForm();
    }
    
    // Escape to close form
    if (e.key === 'Escape' && isFormVisible) {
        toggleAddQuoteForm();
    }
});

// Debug functions for development
function debugInfo() {
    console.log('Current quotes:', quotes);
    console.log('Current filter:', currentFilter);
    console.log('Form visible:', isFormVisible);
    console.log('Available categories:', [...new Set(quotes.map(q => q.category))]);
}

// Make debug function available globally
window.debugInfo = debugInfo;
