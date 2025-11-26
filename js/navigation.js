// Professional Navigation functionality
class Navigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.header = document.querySelector('header');
        this.isMenuOpen = false;
        this.currentLanguage = 'en';
        this.scrollPosition = 0;
        
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initLanguageSwitcher();
        this.initHeaderEffects();
        this.initSmoothScrolling();
        this.initActiveNavigation();
        this.initTouchGestures();
        this.initAccessibility();
    }

    initMobileMenu() {
        if (!this.hamburger || !this.navLinks) {
            console.error('Navigation elements not found');
            return;
        }

        // Hamburger click
        this.hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close menu on link click (excluding language buttons)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't close menu for language switcher clicks
                if (link.classList.contains('lang-btn')) {
                    return;
                }
                if (window.innerWidth <= 992) {
                    this.closeMenu();
                }
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !e.target.closest('.nav-links') && 
                !e.target.closest('.hamburger')) {
                this.closeMenu();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Close on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && this.isMenuOpen) {
                this.closeMenu();
            }
            
            // Update body class for mobile detection
            this.updateBodyClass();
        });

        // Prevent body scroll when menu is open
        this.preventBodyScroll();
        
        // Initial body class update
        this.updateBodyClass();
    }

    updateBodyClass() {
        if (window.innerWidth <= 768) {
            document.body.classList.add('is-mobile');
            document.body.classList.remove('is-tablet');
        } else if (window.innerWidth <= 992) {
            document.body.classList.add('is-tablet');
            document.body.classList.remove('is-mobile');
        } else {
            document.body.classList.remove('is-mobile', 'is-tablet');
        }
    }

    initLanguageSwitcher() {
        // Initialize language from localStorage or default to 'en'
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang) {
            this.currentLanguage = savedLang;
            this.setLanguage(this.currentLanguage);
        }

        // Add click events to ALL language buttons (both desktop and mobile)
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const lang = btn.getAttribute('data-lang');
                if (lang && (lang === 'en' || lang === 'am')) {
                    this.setLanguage(lang);
                    
                    // Close mobile menu if open (only for mobile view)
                    if (this.isMenuOpen && window.innerWidth <= 992) {
                        this.closeMenu();
                    }
                }
            });
        });

        // Update all language button active states
        this.updateLanguageButtonStates(this.currentLanguage);
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        
        // Save to localStorage
        localStorage.setItem('preferred-language', lang);
        
        // Update all language button active states
        this.updateLanguageButtonStates(lang);
        
        // Update all elements with data attributes
        this.updatePageContent(lang);
        
        // Update navigation menu text
        this.updateNavigationMenu(lang);
        
        // Update page title based on language
        this.updatePageTitle(lang);
        
        // Update ARIA labels
        this.updateAriaLabels(lang);
        
        // Dispatch language change event
        this.dispatchEvent('languageChange', { language: lang });
    }

    updateLanguageButtonStates(lang) {
        // Update all language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            const isActive = btnLang === lang;
            
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive);
            
            // Update button text
            const span = btn.querySelector('span');
            if (span) {
                span.textContent = lang.toUpperCase();
            }
        });
    }

    updatePageContent(lang) {
        // Update all elements with data-en and data-am attributes
        document.querySelectorAll('[data-en]').forEach(element => {
            if (lang === 'en') {
                element.textContent = element.getAttribute('data-en');
            } else if (lang === 'am') {
                element.textContent = element.getAttribute('data-am');
            }
        });

        // Update form placeholders
        this.updateFormPlaceholders(lang);
        
        // Update image alt texts if they have data attributes
        this.updateImageAlts(lang);
    }

    updateFormPlaceholders(lang) {
        document.querySelectorAll('input, textarea').forEach(input => {
            const placeholderEn = input.getAttribute('data-placeholder-en');
            const placeholderAm = input.getAttribute('data-placeholder-am');
            
            if (placeholderEn && placeholderAm) {
                input.placeholder = lang === 'en' ? placeholderEn : placeholderAm;
            }
        });
    }

    updateImageAlts(lang) {
        document.querySelectorAll('img[data-alt-en]').forEach(img => {
            const altEn = img.getAttribute('data-alt-en');
            const altAm = img.getAttribute('data-alt-am');
            
            if (altEn && altAm) {
                img.alt = lang === 'en' ? altEn : altAm;
            }
        });
    }

    updateNavigationMenu(lang) {
        const navLinks = document.querySelectorAll('.nav-links a');
        
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
            // Skip language buttons
            if (link.classList.contains('lang-btn')) return;
            
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

    updateAriaLabels(lang) {
        const translations = {
            en: {
                menuToggle: 'Toggle navigation menu',
                languageSwitch: 'Switch language'
            },
            am: {
                menuToggle: 'የማውጫ ሜኑ አቀማመጥ ቀይር',
                languageSwitch: 'ቋንቋ ቀይር'
            }
        };
        
        if (this.hamburger) {
            this.hamburger.setAttribute('aria-label', translations[lang].menuToggle);
        }
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.setAttribute('aria-label', `${translations[lang].languageSwitch} to ${btn.getAttribute('data-lang').toUpperCase()}`);
        });
    }

    updatePageTitle(lang) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
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
        
        if (pageTitles[lang] && pageTitles[lang][currentPage]) {
            document.title = pageTitles[lang][currentPage];
        }
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.navLinks.classList.add('active');
        this.hamburger.classList.add('active');
        this.isMenuOpen = true;
        this.lockBodyScroll();
        
        // Update ARIA attributes
        this.hamburger.setAttribute('aria-expanded', 'true');
        this.navLinks.setAttribute('aria-hidden', 'false');
        
        // Show language switcher in mobile
        const mobileLanguageSwitcher = document.querySelector('.language-switcher-mobile');
        if (mobileLanguageSwitcher && window.innerWidth <= 992) {
            mobileLanguageSwitcher.classList.add('active');
        }
        
        // Animate menu items with stagger
        this.animateMenuItems('in');
        
        // Dispatch custom event
        this.dispatchEvent('menuOpen');
    }

    closeMenu() {
        this.navLinks.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.isMenuOpen = false;
        this.unlockBodyScroll();
        
        // Update ARIA attributes
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.navLinks.setAttribute('aria-hidden', 'true');
        
        // Hide language switcher in mobile
        const mobileLanguageSwitcher = document.querySelector('.language-switcher-mobile');
        if (mobileLanguageSwitcher && window.innerWidth <= 992) {
            mobileLanguageSwitcher.classList.remove('active');
        }
        
        // Animate menu items out
        this.animateMenuItems('out');
        
        // Dispatch custom event
        this.dispatchEvent('menuClose');
    }

    animateMenuItems(direction) {
        const menuItems = this.navLinks.querySelectorAll('li');
        const mobileLanguageSwitcher = document.querySelector('.language-switcher-mobile');
        const navContent = this.navLinks.querySelector('.nav-links__content');
        
        if (direction === 'in') {
            // Reset styles first
            menuItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-10px)';
                item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            // Animate in with stagger
            menuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
            
            // Animate language switcher from bottom
            if (mobileLanguageSwitcher && window.innerWidth <= 992) {
                setTimeout(() => {
                    mobileLanguageSwitcher.style.opacity = '1';
                    mobileLanguageSwitcher.style.transform = 'translateY(0)';
                }, menuItems.length * 100 + 200);
            }
            
            // Scroll to top when menu opens
            if (navContent) {
                setTimeout(() => {
                    navContent.scrollTop = 0;
                }, 100);
            }
        } else {
            // Animate out
            menuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-10px)';
                }, index * 50);
            });
            
            if (mobileLanguageSwitcher && window.innerWidth <= 992) {
                mobileLanguageSwitcher.style.opacity = '0';
                mobileLanguageSwitcher.style.transform = 'translateY(20px)';
            }
        }
    }

    lockBodyScroll() {
        this.scrollPosition = window.pageYOffset;
        document.body.classList.add('menu-open');
        document.documentElement.classList.add('menu-open');
        document.body.style.top = `-${this.scrollPosition}px`;
    }

    unlockBodyScroll() {
        document.body.classList.remove('menu-open');
        document.documentElement.classList.remove('menu-open');
        document.body.style.top = '';
        window.scrollTo(0, this.scrollPosition);
    }

    preventBodyScroll() {
        // Additional safety for scroll prevention
        document.addEventListener('touchmove', (e) => {
            if (this.isMenuOpen && !e.target.closest('.nav-links')) {
                e.preventDefault();
            }
        }, { passive: false });
    }

   initHeaderEffects() {
    if (!this.header) return;

    let ticking = false;

    const updateHeader = () => {
        const scrollY = window.scrollY;
        
        // ALWAYS SHOW HEADER - Only change background on scroll
        if (scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Header will always be visible - no transform changes
        this.header.style.transform = 'translateY(0)';
        this.header.style.transition = 'all 0.3s ease';
        
        this.lastScrollY = scrollY;
        ticking = false;
    };

    // ... rest of the method


        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Initial state
        updateHeader();
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                
                if (targetId === '#' || targetId === '#!') return;
                
                if (targetId.startsWith('#') && targetId.length > 1) {
                    e.preventDefault();
                    
                    this.scrollToSection(targetId);
                    
                    // Close mobile menu if open
                    if (this.isMenuOpen) {
                        this.closeMenu();
                    }
                }
            });
        });
    }

    scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = this.header ? this.header.offsetHeight : 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            this.smoothScrollTo(targetPosition, 800);
        }
    }

    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = this.easeOutCubic(progress);
            
            window.scrollTo(0, startPosition + (distance * ease));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        if (!sections.length || !navLinks.length) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        this.setActiveNavLink(id);
                    }
                });
            }, {
                rootMargin: this.getRootMargin(),
                threshold: 0.1
            });

            sections.forEach(section => observer.observe(section));
        }
    }

    getRootMargin() {
        if (window.innerWidth <= 480) {
            return '-15% 0px -75% 0px';
        } else if (window.innerWidth <= 768) {
            return '-20% 0px -70% 0px';
        } else {
            return '-25% 0px -65% 0px';
        }
    }

    setActiveNavLink(sectionId) {
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    initTouchGestures() {
        if (!this.navLinks) return;

        let touchStartX = 0;
        let touchEndX = 0;

        this.navLinks.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.navLinks.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const swipeDistance = startX - endX;

        // Swipe right to close (negative distance means right swipe)
        if (swipeDistance < -swipeThreshold && this.isMenuOpen) {
            this.closeMenu();
        }
    }

    initAccessibility() {
        // Add ARIA attributes
        if (this.hamburger) {
            this.hamburger.setAttribute('aria-expanded', 'false');
            this.hamburger.setAttribute('aria-controls', 'nav-links');
            this.hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        }
        
        if (this.navLinks) {
            this.navLinks.setAttribute('aria-hidden', 'false');
            this.navLinks.id = 'nav-links';
        }
        
        // Add keyboard navigation
        this.navLinks.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.isMenuOpen) {
                const focusableElements = this.navLinks.querySelectorAll('a, button, .lang-btn');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(`navigation:${eventName}`, {
            detail: { 
                navigation: this,
                timestamp: Date.now(),
                isMobile: window.innerWidth <= 992,
                ...detail
            }
        });
        document.dispatchEvent(event);
    }

    // Public methods
    open() {
        this.openMenu();
    }

    close() {
        this.closeMenu();
    }

    isOpen() {
        return this.isMenuOpen;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    changeLanguage(lang) {
        this.setLanguage(lang);
    }
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', function() {
    window.appNavigation = new Navigation();
});