// Initial array of quotes
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

// Create category dropdown dynamically
const categoryFilter = document.createElement("select");
categoryFilter.id = "categoryFilter";
document.body.insertBefore(categoryFilter, quoteDisplay);
categoryFilter.addEventListener("change", showRandomQuote);

// Populate category dropdown options
function updateCategoryOptions() {
  const categories = ["All", ...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = ""; // clear existing
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.toLowerCase();
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Show a random quote from the selected category
function showRandomQuote() {
  const selected = categoryFilter.value;
  let filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selected);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${random.text}" — [${random.category}]`;
}

// Add a new quote from user input
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  newQuoteText.value = "";
  newQuoteCategory.value = "";

  updateCategoryOptions();
  showRandomQuote();
  alert("Quote added successfully!");
}

// Event listener
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize dropdown
updateCategoryOptions();
