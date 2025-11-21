// Professional Navigation functionality
class Navigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.header = document.querySelector('header');
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        this.initMobileMenu();
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
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
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
        
        // Animate menu items out
        this.animateMenuItems('out');
        
        // Dispatch custom event
        this.dispatchEvent('menuClose');
    }

    animateMenuItems(direction) {
        const menuItems = this.navLinks.querySelectorAll('li');
        
        if (direction === 'in') {
            // Animate in with stagger
            menuItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        } else {
            // Animate out
            menuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                }, index * 50);
            });
        }
    }

    preventBodyScroll() {
        // Store original body position and overflow
        let scrollPosition = 0;

        const enableBodyScroll = () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollPosition);
        };

        const disableBodyScroll = () => {
            scrollPosition = window.pageYOffset;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
        };

        // Observe menu state changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (this.navLinks.classList.contains('active')) {
                        disableBodyScroll();
                    } else {
                        enableBodyScroll();
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
            
            // Add scrolled class based on scroll position
            if (scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            // Hide/show header on scroll (optional)
            if (scrollY > lastScrollY && scrollY > 100 && !this.isMenuOpen) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
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
                
                if (targetId === '#') return;
                
                if (targetId.startsWith('#') && targetId.length > 1) {
                    e.preventDefault();
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const headerHeight = this.header ? this.header.offsetHeight : 0;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        
                        // Smooth scroll with easing
                        this.smoothScrollTo(targetPosition, 800);
                        
                        // Close mobile menu if open
                        if (this.isMenuOpen) {
                            this.closeMenu();
                        }
                    }
                }
            });
        });
    }

    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        if (!sections.length || !navLinks.length) return;

        let observer;

        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        this.setActiveNavLink(id);
                    }
                });
            }, {
                rootMargin: '-20% 0px -70% 0px',
                threshold: 0.1
            });

            sections.forEach(section => observer.observe(section));
        } else {
            // Fallback to scroll-based detection
            let ticking = false;
            
            const updateActiveNav = () => {
                let currentSection = '';
                const headerHeight = this.header ? this.header.offsetHeight : 0;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - headerHeight - 100;
                    
                    if (window.scrollY >= sectionTop) {
                        currentSection = section.getAttribute('id');
                    }
                });

                this.setActiveNavLink(currentSection);
                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateActiveNav);
                    ticking = true;
                }
            });
            
            updateActiveNav();
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

        let startX = 0;
        let currentX = 0;

        const onTouchStart = (e) => {
            startX = e.touches[0].clientX;
        };

        const onTouchMove = (e) => {
            if (!this.isMenuOpen) return;
            
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;

            // Swipe right to close if menu is open
            if (diff < -50) {
                this.closeMenu();
            }
        };

        this.navLinks.addEventListener('touchstart', onTouchStart, { passive: true });
        this.navLinks.addEventListener('touchmove', onTouchMove, { passive: true });
    }

    dispatchEvent(eventName) {
        const event = new CustomEvent(`navigation:${eventName}`, {
            detail: { 
                navigation: this,
                timestamp: Date.now()
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
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', function() {
    window.appNavigation = new Navigation();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}