        // Quote data structure – will be loaded from localStorage

        Let quotes = [];



        // Session storage keys

        Const STORAGE_KEYS = {

            QUOTES: ‘dynamicQuoteGenerator_quotes’,

            PREFERENCES: ‘dynamicQuoteGenerator_preferences’,

            LAST_QUOTE: ‘dynamicQuoteGenerator_lastQuote’,

            SESSION_STATS: ‘dynamicQuoteGenerator_sessionStats’

        };



        // Default quotes (used if no stored quotes exist)

        Const DEFAULT_QUOTES = [

            { text: “The only way to do great work is to love what you do.”, category: “Motivation” },

            { text: “Life is what happens to you while you’re busy making other plans.”, category: “Life” },

            { text: “The future belongs to those who believe in the beauty of their dreams.”, category: “Dreams” },

            { text: “It is during our darkest moments that we must focus to see the light.”, category: “Inspiration” },

            { text: “Success is not final, failure is not fatal: it is the courage to continue that counts.”, category: “Success” },

            { text: “The only impossible journey is the one you never begin.”, category: “Motivation” },

            { text: “In the end, we will remember not the words of our enemies, but the silence of our friends.”, category: “Friendship” },

            { text: “The way to get started is to quit talking and begin doing.”, category: “Action” },

            { text: “Don’t be afraid to give up the good to go for the great.”, category: “Success” },

            { text: “Innovation distinguishes between a leader and a follower.”, category: “Leadership” }

        ];



        Let currentCategory = ‘all’;

        Let currentQuoteIndex = -1;

        Let sessionStats = {

            quotesViewed: 0,

            quotesAdded: 0,

            sessionStart: Date.now()

        };



        // DOM elements

        Const quoteDisplay = document.getElementById(‘quoteDisplay’);

        Const newQuoteBtn = document.getElementById(‘newQuote’);

        Const toggleAddFormBtn = document.getElementById(‘toggleAddForm’);

        Const addQuoteForm = document.getElementById(‘addQuoteForm’);

        Const newQuoteText = document.getElementById(‘newQuoteText’);

        Const newQuoteCategory = document.getElementById(‘newQuoteCategory’);

        Const exportQuotesBtn = document.getElementById(‘exportQuotes’);

        Const importQuotesBtn = document.getElementById(‘importQuotes’);

        Const clearStorageBtn = document.getElementById(‘clearStorage’);

        Const importSection = document.getElementById(‘importSection’);

        Const importFile = document.getElementById(‘importFile’);



        // Initialize the application

        Function init() {

            loadQuotesFromStorage();

            loadPreferencesFromStorage();

            loadSessionData();

            updateStats();

            updateCategoryFilter();

            showWelcomeMessage();

            

            // Event listeners

            newQuoteBtn.addEventListener(‘click’, showRandomQuote);

            toggleAddFormBtn.addEventListener(‘click’, toggleAddQuoteForm);

            exportQuotesBtn.addEventListener(‘click’, exportQuotes);

            importQuotesBtn.addEventListener(‘click’, toggleImportSection);

            clearStorageBtn.addEventListener(‘click’, clearAllData);

            

            // Add keyboard shortcuts

            Document.addEventListener(‘keydown’, function€ {

                If (e.key === ‘n’ || e.key === ‘N’) {

                    showRandomQuote();

                } else if (e.key === ‘a’ || e.key === ‘A’) {

                    toggleAddQuoteForm();

                } else if (e.key === ‘e’ || e.key === ‘E’) {

                    exportQuotes();

                }

            });



            // Auto-save session data every 30 seconds

            setInterval(saveSessionData, 30000);

            

            // Save data before page unload

            Window.addEventListener(‘beforeunload’, function() {

                saveSessionData();

                savePreferencesToStorage();

            });

        }



        // === WEB STORAGE FUNCTIONS ===



        // Load quotes from localStorage

        Function loadQuotesFromStorage() {

            Try {

                Const storedQuotes = localStorage.getItem(STORAGE_KEYS.QUOTES);

                If (storedQuotes) {

                    Quotes = JSON.parse(storedQuotes);

                    Console.log(`Loaded ${quotes.length} quotes from localStorage`);

                } else {

                    Quotes = […DEFAULT_QUOTES];

                    saveQuotesToStorage();

                    console.log(‘No stored quotes found, using default quotes’);

                }

            } catch (error) {

                Console.error(‘Error loading quotes from localStorage:’, error);

                Quotes = […DEFAULT_QUOTES];

                showMessage(‘Error loading saved quotes. Using default quotes.’, ‘error’);

            }

        }



        // Save quotes to localStorage

        Function saveQuotesToStorage() {

            Try {

                localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));

                console.log(`Saved ${quotes.length} quotes to localStorage`);

            } catch (error) {

                Console.error(‘Error saving quotes to localStorage:’, error);

                showMessage(‘Error saving quotes to storage.’, ‘error’);

            }

        }



        // Load user preferences from localStorage

        Function loadPreferencesFromStorage() {

            Try {

                Const storedPreferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);

                If (storedPreferences) {

                    Const preferences = JSON.parse(storedPreferences);

                    currentCategory = preferences.lastCategory || ‘all’;

                    console.log(‘Loaded user preferences from localStorage’);

                }

            } catch (error) {

                Console.error(‘Error loading preferences:’, error);

            }

        }



        // Save user preferences to localStorage

        Function savePreferencesToStorage() {

            Try {

                Const preferences = {

                    lastCategory: currentCategory,

                    lastUpdated: Date.now()

                };

                localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));

            } catch (error) {

                Console.error(‘Error saving preferences:’, error);

            }

        }



        // Load session data from sessionStorage

        Function loadSessionData() {

            Try {

                Const storedStats = sessionStorage.getItem(STORAGE_KEYS.SESSION_STATS);

                If (storedStats) {

                    sessionStats = JSON.parse(storedStats);

                } else {

                    sessionStats.sessionStart = Date.now();

                }

                

                // Load last viewed quote

                Const lastQuote = sessionStorage.getItem(STORAGE_KEYS.LAST_QUOTE);

                If (lastQuote) {

                    Const quote = JSON.parse(lastQuote);

                    Console.log(‘Last viewed quote:’, quote.text.substring(0, 50) + ‘…’);

                }

            } catch (error) {

                Console.error(‘Error loading session data:’, error);

            }

        }



        // Save session data to sessionStorage

        Function saveSessionData() {

            Try {

                sessionStorage.setItem(STORAGE_KEYS.SESSION_STATS, JSON.stringify(sessionStats));

            } catch (error) {

                Console.error(‘Error saving session data:’, error);

            }

        }



        // Save last viewed quote to sessionStorage

        Function saveLastQuote(quote) {

            Try {

                sessionStorage.setItem(STORAGE_KEYS.LAST_QUOTE, JSON.stringify(quote));

            } catch (error) {

                Console.error(‘Error saving last quote:’, error);

            }



                  
