let quotes = [];
const SERVER_URL = "https://example.com/api/quotes"; // Change to your mock or real endpoint

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");
const feedback = document.getElementById("feedback");

// Load quotes from localStorage or default
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : getDefaultQuotes();
  saveQuotes();
}

// Default starter quotes
function getDefaultQuotes() {
  return [
    { id: Date.now(), text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" }
  ];
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.toLowerCase();
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

function showRandomQuote() {
  const selected = categoryFilter.value;
  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selected);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${random.text}" — [${random.category}]`;
  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

function loadLastViewedQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    quoteDisplay.textContent = `"${quote.text}" — [${quote.category}]`;
  }
}

function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    feedback.textContent = "Please enter both quote and category.";
    feedback.style.color = "red";
    return;
  }

  const newQuote = {
    id: Date.now(),
    text,
    category
  };

  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  showRandomQuote();

  newQuoteText.value = "";
  newQuoteCategory.value = "";
  feedback.textContent = "Quote added locally!";
  feedback.style.color = "green";

  // Push to server
  syncQuoteToServer(newQuote);
}

// ========== SERVER SYNC SECTION ========== //

async function fetchFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    if (!response.ok) throw new Error("Fetch failed");

    const serverQuotes = await response.json();
    resolveConflicts(serverQuotes);
  } catch (err) {
    console.warn("Failed to fetch from server:", err.message);
  }
}

function resolveConflicts(serverQuotes) {
  let updated = false;
  const localMap = new Map(quotes.map(q => [q.id, q]));

  for (const sq of serverQuotes) {
    if (!localMap.has(sq.id)) {
      quotes.push(sq);
      updated = true;
    } else if (JSON.stringify(localMap.get(sq.id)) !== JSON.stringify(sq)) {
      // Server takes precedence
      const idx = quotes.findIndex(q => q.id === sq.id);
      quotes[idx] = sq;
      updated = true;
    }
  }

  if (updated) {
    saveQuotes();
    populateCategories();
    feedback.textContent = "Quotes updated from server!";
    feedback.style.color = "orange";
  }
}

async function syncQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
  } catch (err) {
    console.warn("Failed to sync with server:", err.message);
  }
}

// Periodic Server Sync
setInterval(fetchFromServer, 15000); // every 15 seconds

// ========== INIT & EVENTS ========== //

newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", filterQuotes);

loadQuotes();
populateCategories();
loadLastViewedQuote();
filterQuotes();
fetchFromServer(); // initial fetch
