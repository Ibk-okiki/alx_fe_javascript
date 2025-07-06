// Initialize quotes array with sample data (will be overridden by localStorage if available)
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

// Local Storage Management
const STORAGE_KEY = 'dynamicQuoteGenerator_quotes';
const SESSION_KEY = 'dynamicQuoteGenerator_lastQuote';

// Save quotes to localStorage
function saveQuotes() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
        console.log('Quotes saved to localStorage');
    } catch (error) {
        console.error('Error saving quotes to localStorage:', error);
        showNotification('Error saving quotes. Storage might be full.', 'error');
    }
}

// Load quotes from localStorage
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
        console.error('Error loading quotes from localStorage:', error);
        showNotification('Error loading saved quotes. Using default quotes.', 'error');
    }
    return false;
}

// Save last viewed quote to sessionStorage
function saveLastQuote(quote) {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(quote));
    } catch (error) {
        console.error('Error saving last quote to sessionStorage:', error);
    }
}

// Load last viewed quote from sessionStorage
function loadLastQuote() {
    try {
        const lastQuote = sessionStorage.getItem(SESSION_KEY);
        if (lastQuote) {
            return JSON.parse(lastQuote);
        }
    } catch (error) {
        console.error('Error loading last quote from sessionStorage:', error);
    }
    return null;
}

// Clear all storage
function clearAllStorage() {
    if (confirm('Are you sure you want to clear all saved quotes? This action cannot be undone.')) {
        try {
            localStorage.removeItem(STORAGE_KEY);
            sessionStorage.removeItem(SESSION_KEY);
            quotes = [];
            updateStats();
            updateCategoryFilter();
            quoteDisplay.innerHTML = '<div class="empty-state">All quotes cleared. Add some new quotes to get started!</div>';
            showNotification('All data cleared successfully!', 'success');
        } catch (error) {
            console.error('Error clearing storage:', error);
            showNotification('Error clearing storage.', 'error');
        }
    }
}

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const toggleFormButton = document.getElementById('toggleForm');
const addQuoteContainer = document.getElementById('addQuoteContainer');
const importExportContainer = document.getElementById('importExportContainer');
const categorySelect = document.getElementById('categorySelect');
const totalQuotesElement = document.getElementById('totalQuotes');
const totalCategoriesElement = document.getElementById('totalCategories');
const exportButton = document.getElementById('exportQuotes');
const clearStorageButton = document.getElementById('clearStorage');

// Current quote tracker for session storage
let currentQuote = null;

// Show random quote function
function showRandomQuote() {
    const selectedCategory = categorySelect.value;
    let availableQuotes = quotes;

    // Filter quotes by category if not 'all'
    if (selectedCategory !== 'all') {
        availableQuotes = quotes.filter(quote => quote.category === selectedCategory);
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

// Add new quote function
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
        text: newQuoteText,
        category: newQuoteCategory,
        author: newQuoteAuthor || null
    };

    // Add to quotes array
    quotes.push(newQuote);

    // Save to localStorage
    saveQuotes();

    // Clear form
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    document.getElementById('newQuoteAuthor').value = '';

    // Update UI
    updateStats();
    updateCategoryFilter();
    
    // Hide form
    addQuoteContainer.style.display = 'none';
    toggleFormButton.textContent = 'Add New Quote';

    // Show success message
    showNotification('Quote added successfully!', 'success');
}

// Cancel add quote function
function cancelAddQuote() {
    addQuoteContainer.style.display = 'none';
    toggleFormButton.textContent = 'Add New Quote';
    
    // Clear form
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    document.getElementById('newQuoteAuthor').value = '';
}

// Toggle import/export form
function toggleImportExport() {
    if (importExportContainer.style.display === 'none') {
        importExportContainer.style.display = 'block';
        exportButton.textContent = 'Close Import/Export';
    } else {
        importExportContainer.style.display = 'none';
        exportButton.textContent = 'Export Quotes';
    }
}

// Export quotes to JSON file
function exportToJsonFile(type = 'all') {
    try {
        let quotesToExport = quotes;
        let filename = 'quotes_export.json';

        if (type === 'current' && categorySelect.value !== 'all') {
            quotesToExport = quotes.filter(quote => quote.category === categorySelect.value);
            filename = `quotes_${categorySelect.value.toLowerCase()}_export.json`;
        }

        if (quotesToExport.length === 0) {
            showNotification('No quotes to export in the selected category.', 'error');
            return;
        }

        const dataStr = JSON.stringify(quotesToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.style.display = 'none';
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        URL.revokeObjectURL(url);
        
        showNotification(`${quotesToExport.length} quotes exported successfully!`, 'success');
    } catch (error) {
        console.error('Error exporting quotes:', error);
        showNotification('Error exporting quotes. Please try again.', 'error');
    }
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            
            // Validate imported data
            if (!Array.isArray(importedQuotes)) {
                throw new Error('Invalid JSON format. Expected an array of quotes.');
            }

            // Validate each quote object
            const validQuotes = importedQuotes.filter(quote => {
                return quote && 
                       typeof quote === 'object' && 
                       typeof quote.text === 'string' && 
                       typeof quote.category === 'string' && 
                       quote.text.trim() !== '' && 
                       quote.category.trim() !== '';
            });

            if (validQuotes.length === 0) {
                throw new Error('No valid quotes found in the imported file.');
            }

            // Add imported quotes to existing quotes
            quotes.push(...validQuotes);
            
            // Save to localStorage
            saveQuotes();
            
            // Update UI
            updateStats();
            updateCategoryFilter();
            
            // Clear file input
            event.target.value = '';
            
            showNotification(`${validQuotes.length} quotes imported successfully!`, 'success');
            
            if (validQuotes.length < importedQuotes.length) {
                showNotification(`${importedQuotes.length - validQuotes.length} invalid quotes were skipped.`, 'warning');
            }
            
        } catch (error) {
            console.error('Error importing quotes:', error);
            showNotification(`Error importing quotes: ${error.message}`, 'error');
            event.target.value = '';
        }
    };
    
    fileReader.onerror = function() {
        showNotification('Error reading file. Please try again.', 'error');
        event.target.value = '';
    };
    
    fileReader.readAsText(file);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    const colors = {
        success: '#48bb78',
        error: '#f56565',
        warning: '#ed8936',
        info: '#4299e1'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Toggle form visibility
function toggleAddQuoteForm() {
    if (addQuoteContainer.style.display === 'none') {
        addQuoteContainer.style.display = 'block';
        toggleFormButton.textContent = 'Hide Form';
    } else {
        addQuoteContainer.style.display = 'none';
        toggleFormButton.textContent = 'Add New Quote';
    }
}

// Load last quote on page load
function loadLastQuoteOnStart() {
    const lastQuote = loadLastQuote();
    if (lastQuote) {
        currentQuote = lastQuote;
        const quoteElement = document.createElement('div');
        quoteElement.innerHTML = `
            <div class="quote-text">"${lastQuote.text}"</div>
            <div class="quote-category">${lastQuote.category}</div>
            ${lastQuote.author ? `<div class="quote-author">— ${lastQuote.author}</div>` : ''}
            <div style="margin-top: 10px; font-size: 0.8em; color: #a0aec0; font-style: italic;">
                (Last viewed quote from previous session)
            </div>
        `;
        quoteDisplay.innerHTML = '';
        quoteDisplay.appendChild(quoteElement);
    }
}

// Update statistics
function updateStats() {
    totalQuotesElement.textContent = quotes.length;
    const categories = [...new Set(quotes.map(quote => quote.category))];
    totalCategoriesElement.textContent = categories.length;
}

// Update category filter dropdown
function updateCategoryFilter() {
    const categories = [...new Set(quotes.map(quote => quote.category))].sort();
    const currentSelection = categorySelect.value;
    
    // Clear existing options except "All Categories"
    categorySelect.innerHTML = '<option value="all">All Categories</option>';
    
    // Add category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Restore previous selection if it still exists
    if (categories.includes(currentSelection)) {
        categorySelect.value = currentSelection;
    }
}

// Event listeners
newQuoteButton.addEventListener('click', showRandomQuote);
toggleFormButton.addEventListener('click', toggleAddQuoteForm);
exportButton.addEventListener('click', toggleImportExport);
clearStorageButton.addEventListener('click', clearAllStorage);
categorySelect.addEventListener('change', showRandomQuote);

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.ctrlKey) {
        showRandomQuote();
    } else if (event.key === 'Escape') {
        if (addQuoteContainer.style.display !== 'none') {
            cancelAddQuote();
        }
        if (importExportContainer.style.display !== 'none') {
            toggleImportExport();
        }
    }
});

// Initialize the application
function initializeApp() {
    // Load quotes from localStorage first
    const quotesLoaded = loadQuotes();
    
    updateStats();
    updateCategoryFilter();
    
    // If quotes were loaded and there's a last quote, show it
    if (quotesLoaded) {
        loadLastQuoteOnStart();
    } else {
        // Otherwise show a random quote from default data
        showRandomQuote();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeApp);
