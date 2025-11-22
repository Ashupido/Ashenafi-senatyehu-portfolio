// Professional Navigation functionality
class Navigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.header = document.querySelector('header');
        this.isMenuOpen = false;
        this.currentLanguage = 'en';
        
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initLanguageSwitcher();
        this.initHeaderEffects();
        this.initSmoothScrolling();
        this.initActiveNavigation();
        this.initTouchGestures();
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

        // Close menu on link click
        document.querySelectorAll('.nav-links a:not(.lang-btn)').forEach(link => {
            link.addEventListener('click', () => {
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
        });

        // Prevent body scroll when menu is open
        this.preventBodyScroll();
    }

    initLanguageSwitcher() {
        // Initialize language from localStorage or default to 'en'
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang) {
            this.currentLanguage = savedLang;
            this.setLanguage(this.currentLanguage);
        }

        // Add click events to all language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLanguageDropdown(btn);
            });
        });

        // Add click events to all language options
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                this.setLanguage(lang);
                this.closeAllLanguageDropdowns();
                
                // Close mobile menu if open
                if (this.isMenuOpen && window.innerWidth <= 992) {
                    this.closeMenu();
                }
            });
        });

        // Close language dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.closeAllLanguageDropdowns();
        });
    }

    toggleLanguageDropdown(button) {
        const dropdown = button.nextElementSibling;
        const isActive = dropdown.classList.contains('active');
        
        // Close all dropdowns first
        this.closeAllLanguageDropdowns();
        
        // Toggle current dropdown if it wasn't active
        if (!isActive) {
            dropdown.classList.add('active');
        }
    }

    closeAllLanguageDropdowns() {
        document.querySelectorAll('.lang-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        
        // Save to localStorage
        localStorage.setItem('preferred-language', lang);
        
        // Update all language button texts
        document.querySelectorAll('.lang-btn span').forEach(span => {
            span.textContent = lang.toUpperCase();
        });
        
        // Update all elements with data attributes
        this.updatePageContent(lang);
        
        // Dispatch language change event
        this.dispatchEvent('languageChange', { language: lang });
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

        // Update page title based on language
        this.updatePageTitle(lang);
    }

    updatePageTitle(lang) {
        const titleMap = {
            'en': 'Ashenafi Sentayehu | Full Stack Developer Portfolio',
            'am': 'አሸናፊ ሰንታየሁ | ፉል ስታክ አበልጻጊ ፖርትፎሊዮ'
        };
        
        if (titleMap[lang]) {
            document.title = titleMap[lang];
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
        document.body.classList.add('menu-open');
        document.documentElement.classList.add('menu-open');
        
        // Animate menu items with stagger
        this.animateMenuItems('in');
        
        // Dispatch custom event
        this.dispatchEvent('menuOpen');
    }

    closeMenu() {
        this.navLinks.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.isMenuOpen = false;
        document.body.classList.remove('menu-open');
        document.documentElement.classList.remove('menu-open');
        
        // Close language dropdowns when menu closes
        this.closeAllLanguageDropdowns();
        
        // Animate menu items out
        this.animateMenuItems('out');
        
        // Dispatch custom event
        this.dispatchEvent('menuClose');
    }

    animateMenuItems(direction) {
        const menuItems = this.navLinks.querySelectorAll('li:not(.language-switcher)');
        
        if (direction === 'in') {
            // Animate in with stagger
            menuItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(30px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 100);
            });
        } else {
            // Animate out
            menuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(30px)';
                }, index * 50);
            });
        }
    }

    preventBodyScroll() {
        let scrollPosition = 0;

        const enableBodyScroll = () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.height = '';
            window.scrollTo(0, scrollPosition);
        };

        const disableBodyScroll = () => {
            scrollPosition = window.pageYOffset;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
            document.body.style.height = '100%';
        };

        // Observe menu state changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (this.navLinks.classList.contains('active')) {
                        disableBodyScroll();
                    } else {
                        setTimeout(enableBodyScroll, 50);
                    }
                }
            });
        });

        observer.observe(this.navLinks, { attributes: true });
    }

    initHeaderEffects() {
        if (!this.header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;
            const headerHeight = this.header.offsetHeight;
            
            // Add scrolled class based on scroll position
            if (scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            // Hide/show header on scroll
            if (scrollY > lastScrollY && scrollY > headerHeight && !this.isMenuOpen) {
                this.header.style.transform = 'translateY(-100%)';
                this.header.style.transition = 'transform 0.3s ease';
            } else {
                this.header.style.transform = 'translateY(0)';
                this.header.style.transition = 'transform 0.3s ease';
            }
            
            lastScrollY = scrollY;
            ticking = false;
        };

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
            
            this.smoothScrollTo(targetPosition, 600);
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
                rootMargin: window.innerWidth <= 768 ? '-15% 0px -75% 0px' : '-20% 0px -70% 0px',
                threshold: 0.1
            });

            sections.forEach(section => observer.observe(section));
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
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', function() {
    window.appNavigation = new Navigation();

    // Add mobile-specific body class
    if (window.innerWidth <= 768) {
        document.body.classList.add('is-mobile');
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            document.body.classList.add('is-mobile');
        } else {
            document.body.classList.remove('is-mobile');
        }
    });
});