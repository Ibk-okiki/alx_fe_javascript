let quotes = [];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");
const feedback = document.getElementById("feedback");

// Load from localStorage on init
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default quotes
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Imagination is more important than knowledge.", category: "Inspiration" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" }
    ];
    saveQuotes(); // Save defaults on first load
  }
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Update category dropdown
function updateCategoryOptions() {
  const uniqueCategories = Array.from(new Set(quotes.map(q => q.category)));
  categoryFilter.innerHTML = '<option value="all">All</option>';
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.toLowerCase();
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Show a random quote
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const random = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = `"${random.text}" — [${random.category}]`;

  // Save to sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

// Show last viewed quote (session storage)
function loadLastViewedQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    quoteDisplay.textContent = `"${quote.text}" — [${quote.category}]`;
  }
}

// Add a new quote
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    feedback.textContent = "Please enter both quote and category.";
    feedback.style.color = "red";
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  updateCategoryOptions();
  showRandomQuote();

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  feedback.textContent = "Quote added successfully!";
  feedback.style.color = "green";
}

// Export quotes as JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        updateCategoryOptions();
        feedback.textContent = "Quotes imported successfully!";
        feedback.style.color = "green";
      } else {
        throw new Error("Invalid format");
      }
    } catch {
      feedback.textContent = "Failed to import quotes. Ensure it's valid JSON.";
      feedback.style.color = "red";
    }
  };
  reader.readAsText(file);
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", showRandomQuote);

// Init
loadQuotes();
updateCategoryOptions();
loadLastViewedQuote();
