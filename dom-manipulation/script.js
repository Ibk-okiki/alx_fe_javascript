// Initialize quotes array with sample data
let quotes = [
    {
        id: 1,
        text: "The only way to do great work is to love what you do.",
        category: "Motivation",
        author: "Steve Jobs",
        lastModified: Date.now(),
        source: "local"
    },
    {
        id: 2,
        text: "Life is what happens to you while you're busy making other plans.",
        category: "Life",
        author: "John Lennon",
        lastModified: Date.now(),
        source: "local"
    },
    {
        id: 3,
        text: "The future belongs to those who believe in the beauty of their dreams.",
        category: "Dreams",
        author: "Eleanor Roosevelt",
        lastModified: Date.now(),
        source: "local"
    },
    {
        id: 4,
        text: "In the middle of difficulty lies opportunity.",
        category: "Opportunity",
        author: "Albert Einstein",
        lastModified: Date.now(),
        source: "local"
    },
    {
        id: 5,
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        category: "Success",
        author: "Winston Churchill",
        lastModified: Date.now(),
        source: "local"
    }
];

// Storage keys
const STORAGE_KEY = 'dynamicQuoteGenerator_quotes';
const SYNC_KEY = 'dynamicQuoteGenerator_lastSync';
const CONFLICT_KEY = 'dynamicQuoteGenerator_conflicts';

// Sync configuration
const SYNC_INTERVAL = 30000; // 30 seconds
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API

// State variables
let currentQuote = null;
let currentFilter = 'all';
let syncTimer = null;
let lastSyncTime = 0;
let isOnline = navigator.onLine;
let conflicts = [];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');
const totalQuotesElement = document.getElementById('totalQuotes');
const totalCategoriesElement = document.getElementById('totalCategories');
const filteredQuotesElement = document.getElementById('filteredQuotes');
const addQuoteContainer = document.getElementById('addQuoteContainer');
const syncIndicator = document.getElementById('syncIndicator');
const syncStatus = document.getElementById('syncStatus');
const conflictModal = document.getElementById('conflictModal');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadQuotes();
    loadLastSync();
    populateCategories();
    updateStatistics();
    updateSyncStatus();
    setupEventListeners();
    startSyncTimer();
    
    // Initial sync
    syncQuotes();
});

// Event Listeners
function setupEventListeners() {
    // Online/offline detection
    window.addEventListener('online', function() {
        isOnline = true;
        updateSyncStatus();
        syncQuotes();
    });

    window.addEventListener('offline', function() {
        isOnline = false;
        updateSyncStatus();
    });

    // Before page unload - save current state
    window.addEventListener('beforeunload', function() {
        saveQuotes();
    });
}

// Server Interaction Functions
async function fetchQuotesFromServer() {
    try {
        updateSyncStatus('syncing');
        
        // Simulate fetching quotes from server using JSONPlaceholder
        const response = await fetch(SERVER_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const serverData = await response.json();
        
        // Transform JSONPlaceholder data to quote format
        const serverQuotes = serverData.slice(0, 10).map((post, index) => ({
            id: 1000 + index,
            text: post.title,
            category: "Server",
            author: "Server Source",
            lastModified: Date.now() - Math.random() * 86400000, // Random time within last 24 hours
            source: "server"
        }));

        return serverQuotes;
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        showNotification('Failed to fetch quotes from server', 'error');
        return null;
    }
}

async function postQuoteToServer(quote) {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: quote.text,
                body: `Category: ${quote.category}, Author: ${quote.author || 'Unknown'}`,
                userId: 1
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        showNotification('Quote synced to server successfully', 'success');
        return result;
    } catch (error) {
        console.error('Error posting quote to server:', error);
        showNotification('Failed to sync quote to server', 'error');
        return null;
    }
}

// Sync Functions
async function syncQuotes() {
    if (!isOnline) {
        updateSyncStatus('offline');
        return;
    }

    try {
        updateSyncStatus('syncing');
        
        const serverQuotes = await fetchQuotesFromServer();
        
        if (serverQuotes) {
            const mergeResult = mergeQuotes(quotes, serverQuotes);
            
            if (mergeResult.conflicts.length > 0) {
                conflicts = mergeResult.conflicts;
                showConflictModal();
            } else {
                quotes = mergeResult.merged;
                saveQuotes();
                updateLastSync();
                populateCategories();
                updateStatistics();
                showNotification('Data synchronized successfully', 'success');
            }
        }
        
        updateSyncStatus('online');
    } catch (error) {
        console.error('Sync error:', error);
        updateSyncStatus('offline');
        showNotification('Sync failed', 'error');
    }
}

function mergeQuotes(localQuotes, serverQuotes) {
    const merged = [...localQuotes];
    const conflicts = [];
    
    serverQuotes.forEach(serverQuote => {
        const localQuote = localQuotes.find(q => q.id === serverQuote.id);
        
        if (!localQuote) {
            // New quote from server
            merged.push(serverQuote);
        } else if (localQuote.lastModified < serverQuote.lastModified) {
            // Server quote is newer
            if (localQuote.text !== serverQuote.text || 
                localQuote.category !== serverQuote.category ||
                localQuote.author !== serverQuote.author) {
                // Conflict detected
                conflicts.push({
                    id: serverQuote.id,
                    local: localQuote,
                    server: serverQuote
                });
            } else {
                // Update timestamp without conflict
                const index = merged.findIndex(q => q.id === serverQuote.id);
                merged[index] = serverQuote;
            }
        }
    });
    
    return { merged, conflicts };
}

function forceSync() {
    if (isOnline) {
        syncQuotes();
    } else {
        showNotification('Cannot sync while offline', 'warning');
    }
}

function startSyncTimer() {
    if (syncTimer) {
        clearInterval(syncTimer);
    }
    
    syncTimer = setInterval(() => {
        if (isOnline) {
            syncQuotes();
        }
    }, SYNC_INTERVAL);
}

// Conflict Resolution Functions
function showConflictModal() {
    const conflictList = document.getElementById('conflictList');
    conflictList.innerHTML = '';
    
    conflicts.forEach(conflict => {
        const conflictDiv = document.createElement('div');
        conflictDiv.className = 'conflict-item';
        conflictDiv.innerHTML = `
            <h4>Quote ID: ${conflict.id}</h4>
            <div><strong>Local:</strong> "${conflict.local.text}" - ${conflict.local.category}</div>
            <div><strong>Server:</strong> "${conflict.server.text}" - ${conflict.server.category}</div>
        `;
        conflictList.appendChild(conflictDiv);
    });
    
    conflictModal.style.display = 'block';
}

function closeConflictModal() {
    conflictModal.style.display = 'none';
}

function resolveConflicts(resolution) {
    conflicts.forEach(conflict => {
        const index = quotes.findIndex(q => q.id === conflict.id);
        
        if (resolution === 'server') {
            quotes[index] = conflict.server;
        } else if (resolution === 'local') {
            // Keep local version, update timestamp
            quotes[index].lastModified = Date.now();
        } else if (resolution === 'merge') {
            // Simple merge strategy - combine text
            quotes[index] = {
                ...conflict.local,
                text: `${conflict.local.text} | ${conflict.server.text}`,
                lastModified: Date.now()
            };
        }
    });
    
    conflicts = [];
    saveQuotes();
    updateLastSync();
    populateCategories();
    updateStatistics();
    closeConflictModal();
    showNotification(`Conflicts resolved using ${resolution} strategy`, 'success');
}

// Storage Functions
function saveQuotes() {
    try {
        const quotesData = JSON.stringify(quotes);
        localStorage.setItem(STORAGE_KEY, quotesData);
    } catch (error) {
        console.error('Error saving quotes:', error);
        showNotification('Error saving quotes', 'error');
    }
}

function loadQuotes() {
    try {
        const storedQuotes = localStorage.getItem(STORAGE_KEY);
        if (storedQuotes) {
            const parsedQuotes = JSON.parse(storedQuotes);
            if (Array.isArray(parsedQuotes) && parsedQuotes.length > 0) {
                quotes = parsedQuotes;
                return true;
            }
        }
    } catch (error) {
        console.error('Error loading quotes:', error);
    }
    return false;
}

function updateLastSync() {
    lastSyncTime = Date.now();
    localStorage.setItem(SYNC_KEY, lastSyncTime.toString());
}

function loadLastSync() {
    try {
        const stored = localStorage.getItem(SYNC_KEY);
        if (stored) {
            lastSyncTime = parseInt(stored);
        }
    } catch (error) {
        console.error('Error loading last sync time:', error);
    }
}

// UI Functions
function updateSyncStatus(status) {
    const indicator = syncIndicator;
    const statusText = syncStatus;
    
    indicator.className = 'sync-indicator';
    
    if (status === 'syncing') {
        indicator.classList.add('syncing');
        statusText.textContent = 'Syncing...';
    } else if (isOnline) {
        indicator.classList.add('online');
        const timeSinceSync = Date.now() - lastSyncTime;
        const minutes = Math.floor(timeSinceSync / 60000);
        statusText.textContent = minutes > 0 ? `Last sync: ${minutes}m ago` : 'Synced';
    } else {
        indicator.classList.add('offline');
        statusText.textContent = 'Offline';
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))].sort();
    const currentSelection = categoryFilter.value;
    
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    if (categories.includes(currentSelection)) {
        categoryFilter.value = currentSelection;
    }
}

function updateStatistics() {
    totalQuotesElement.textContent = quotes.length;
    totalCategoriesElement.textContent = [...new Set(quotes.map(q => q.category))].length;
    updateFilteredQuotesCount();
}

function updateFilteredQuotesCount() {
    let filteredCount = quotes.length;
    if (currentFilter !== 'all') {
        filteredCount = quotes.filter(quote => quote.category === currentFilter).length;
    }
    filteredQuotesElement.textContent = filteredCount;
}

function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    currentFilter = selectedCategory;
    updateFilteredQuotesCount();
    showRandomQuote();
}

function showRandomQuote() {
    let availableQuotes = quotes;

    if (currentFilter !== 'all') {
        availableQuotes = quotes.filter(quote => quote.category === currentFilter);
    }

    if (availableQuotes.length === 0) {
        quoteDisplay.innerHTML = '<div class="empty-state">No quotes available in this category.</div>';
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    const selectedQuote = availableQuotes[randomIndex];
    currentQuote = selectedQuote;

    const quoteElement = document.createElement('div');
    quoteElement.innerHTML = `
        <div class="quote-text">"${selectedQuote.text}"</div>
        <div class="quote-category">${selectedQuote.category}</div>
        ${selectedQuote.author ? `<div class="quote-author">— ${selectedQuote.author}</div>` : ''}
    `;

    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(quoteElement);

    quoteElement.style.opacity = '0';
    quoteElement.style.transform = 'translateY(20px)';
    setTimeout(() => {
        quoteElement.style.transition = 'all 0.5s ease';
        quoteElement.style.opacity = '1';
        quoteElement.style.transform = 'translateY(0)';
    }, 10);
}

function toggleAddQuoteForm() {
    const container = addQuoteContainer;
    if (container.style.display === 'none') {
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
    } else {
        container.style.display = 'none';
    }
}

function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
    const author = document.getElementById('newQuoteAuthor').value.trim();

    if (!text || !category) {
        showNotification('Please fill in both quote text and category fields.', 'error');
        return;
    }

    const newQuote = {
        id: Date.now(),
        text: text,
        category: category,
        author: author || null,
        lastModified: Date.now(),
        source: "local"
    };

    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    updateStatistics();
    
    // Try to sync to server
    if (isOnline) {
        postQuoteToServer(newQuote);
    }

    // Clear form
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    document.getElementById('newQuoteAuthor').value = '';
    
    // Hide form
    addQuoteContainer.style.display = 'none';
    
    showNotification('Quote added successfully!', 'success');
}

function cancelAddQuote() {
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    document.getElementById('newQuoteAuthor').value = '';
    addQuoteContainer.style.display = 'none';
}

function exportToJsonFile(type = 'all') {
    let dataToExport = quotes;
    
    if (type === 'current' && currentFilter !== 'all') {
        dataToExport = quotes.filter(quote => quote.category === currentFilter);
    }

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `quotes_${type}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification(`${dataToExport.length} quotes exported successfully`, 'success');
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        quotes = [];
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SYNC_KEY);
        localStorage.removeItem(CONFLICT_KEY);
        
        populateCategories();
        updateStatistics();
        quoteDisplay.innerHTML = '<div class="empty-state">No quotes available. Add some quotes to get started!</div>';
        
        showNotification('All data cleared successfully', 'info');
    }
}

// Enhanced sync with periodic checks
function checkForUpdates() {
    if (isOnline && Date.now() - lastSyncTime > SYNC_INTERVAL) {
        syncQuotes();
    }
}

// Auto-sync on visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && isOnline) {
        checkForUpdates();
    }
});

// Data validation before sync
function validateQuoteData(quote) {
    const errors = [];
    
    if (!quote.text || quote.text.trim().length === 0) {
        errors.push('Quote text is required');
    }
    
    if (!quote.category || quote.category.trim().length === 0) {
        errors.push('Quote category is required');
    }
    
    if (quote.text && quote.text.length > 1000) {
        errors.push('Quote text is too long (max 1000 characters)');
    }
    
    return errors;
}

// Initialize sync status on page load
setTimeout(() => {
    updateSyncStatus();
}, 1000);

// Show initial quote
setTimeout(() => {
    showRandomQuote();
}, 500);
