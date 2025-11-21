// Language Switcher functionality
let currentLang = 'en';

function initLanguageSwitcher() {
    const languageBtns = document.querySelectorAll('.language-btn');

    function switchLanguage(lang) {
        currentLang = lang;
        
        // Update active button
        languageBtns.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update all elements with data attributes
        document.querySelectorAll('[data-en]').forEach(element => {
            if (lang === 'en') {
                element.textContent = element.dataset.en;
            } else if (lang === 'am') {
                element.textContent = element.dataset.am;
            }
        });
        
        // Update form placeholders if needed
        document.querySelectorAll('input, textarea').forEach(input => {
            const label = input.previousElementSibling;
            if (label && label.dataset.en) {
                if (lang === 'en') {
                    input.placeholder = label.dataset.en;
                } else if (lang === 'am') {
                    input.placeholder = label.dataset.am;
                }
            }
        });

        // Update navigation menu links - FIXED THIS PART
        updateNavigationMenu(lang);
        
        // Update page titles and meta descriptions
        updatePageMetadata(lang);
        
        // Save language preference to localStorage
        localStorage.setItem('preferredLanguage', lang);
    }

    // Update navigation menu based on language - FIXED FUNCTION
    function updateNavigationMenu(lang) {
        const navLinks = document.querySelectorAll('.nav-links a');
        
        // Define menu translations
        const menuTranslations = {
            en: {
                'Home': 'Home',
                'About': 'About',
                'Education & Experience': 'Education & Experience',
                'Projects': 'Projects',
                'Skills': 'Skills',
                'Contact': 'Contact'
            },
            am: {
                'Home': 'መነሻ',
                'About': 'ስለ እኔ',
                'Education & Experience': 'ትምህርት እና ልምድ',
                'Projects': 'ፕሮጀክቶች',
                'Skills': 'ችሎታዎች',
                'Contact': 'አግኙኝ'
            }
        };

        navLinks.forEach(link => {
            const originalText = link.getAttribute('data-original-text') || link.textContent.trim();
            // Store original text if not already stored
            if (!link.getAttribute('data-original-text')) {
                link.setAttribute('data-original-text', originalText);
            }
            
            if (menuTranslations[lang] && menuTranslations[lang][originalText]) {
                link.textContent = menuTranslations[lang][originalText];
            }
        });
    }

    // Update page metadata based on language
    function updatePageMetadata(lang) {
        const pageTitles = {
            en: {
                'index.html': 'Ashenafi Sentayehu | Full Stack Developer Portfolio',
                'about.html': 'About Me - Ashenafi Sentayehu',
                'education.html': 'Education & Experience - Ashenafi Sentayehu',
                'projects.html': 'Projects - Ashenafi Sentayehu',
                'skills.html': 'Skills - Ashenafi Sentayehu',
                'contact.html': 'Contact Me - Ashenafi Sentayehu'
            },
            am: {
                'index.html': 'አሸናፊ ሰንታየሁ | ፉል ስታክ አበልጻጊ ፖርትፎሊዮ',
                'about.html': 'ስለ እኔ - አሸናፊ ሰንታየሁ',
                'education.html': 'ትምህርት እና ልምድ - አሸናፊ ሰንታየሁ',
                'projects.html': 'ፕሮጀክቶች - አሸናፊ ሰንታየሁ',
                'skills.html': 'ችሎታዎች - አሸናፊ ሰንታየሁ',
                'contact.html': 'ያግኙኝ - አሸናፊ ሰንታየሁ'
            }
        };

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (pageTitles[lang] && pageTitles[lang][currentPage]) {
            document.title = pageTitles[lang][currentPage];
        }

        // Update meta description if needed
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            const descriptions = {
                en: 'Professional portfolio of Ashenafi Sentayehu - Full Stack Web Developer, Software Engineer, and Graphic Designer specializing in modern web technologies',
                am: 'የአሸናፊ ሰንታየሁ ሙያዊ ፖርትፎሊዮ - ፉል ስታክ ዌብ አበልጻጊ፣ ሶፍትዌር ምህንድስና እና ግራፊክ ዲዛይነር በዘመናዊ ዌብ ቴክኖሎጂዎች'
            };
            if (descriptions[lang]) {
                metaDescription.content = descriptions[lang];
            }
        }
    }

    // Initialize language from localStorage or default to English
    function initializeLanguage() {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && (savedLang === 'en' || savedLang === 'am')) {
            switchLanguage(savedLang);
        } else {
            switchLanguage('en'); // Default to English
        }
    }

    // Initialize language switcher
    if (languageBtns.length > 0) {
        languageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                switchLanguage(btn.dataset.lang);
            });
        });

        // Initialize language on page load
        initializeLanguage();
    }
}

// Export current language for other modules
function getCurrentLanguage() {
    return currentLang;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initLanguageSwitcher();
});