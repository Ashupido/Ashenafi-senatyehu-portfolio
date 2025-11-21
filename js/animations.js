// Animation functionality
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate child elements with delays
                animateChildElements(entry.target);
            }
        });
    }, observerOptions);

    function animateChildElements(parent) {
        if (parent.classList.contains('about-text')) {
            const paragraphs = parent.querySelectorAll('p');
            paragraphs.forEach((p, index) => {
                setTimeout(() => {
                    p.classList.add('visible');
                }, 200 * index);
            });
        }
        
        if (parent.classList.contains('skills-grid')) {
            const skillCards = parent.querySelectorAll('.skill-card');
            skillCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, 100 * index);
            });
        }
        
        if (parent.classList.contains('projects-grid')) {
            const projectCards = parent.querySelectorAll('.project-card');
            projectCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, 100 * index);
            });
        }
        
        if (parent.classList.contains('skills-category-grid')) {
            const skillCategories = parent.querySelectorAll('.skill-category');
            skillCategories.forEach((category, index) => {
                setTimeout(() => {
                    category.classList.add('visible');
                }, 100 * index);
            });
        }
        
        if (parent.classList.contains('contact-info')) {
            const contactItems = parent.querySelectorAll('.contact-item');
            contactItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, 100 * index);
            });
        }
        
        if (parent.classList.contains('timeline')) {
            const timelineItems = parent.querySelectorAll('.timeline-item');
            timelineItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, 200 * index);
            });
        }
    }

    // Observe all sections and elements
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    document.querySelectorAll('.section-title').forEach(title => {
        observer.observe(title);
    });

    document.querySelectorAll('.about-text').forEach(text => {
        observer.observe(text);
    });

    document.querySelectorAll('.skills-grid').forEach(grid => {
        observer.observe(grid);
    });

    document.querySelectorAll('.projects-grid').forEach(grid => {
        observer.observe(grid);
    });

    document.querySelectorAll('.skills-category-grid').forEach(grid => {
        observer.observe(grid);
    });

    document.querySelectorAll('.contact-info').forEach(info => {
        observer.observe(info);
    });

    document.querySelectorAll('.contact-form').forEach(form => {
        observer.observe(form);
    });

    // Create floating elements for hero section
    const floatingElements = document.getElementById('floatingElements');
    if (floatingElements) {
        for (let i = 0; i < 15; i++) {
            const element = document.createElement('div');
            element.classList.add('floating-element');
            
            const size = Math.random() * 60 + 20;
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            element.style.left = `${Math.random() * 100}%`;
            element.style.top = `${Math.random() * 100}%`;
            element.style.animationDuration = `${Math.random() * 20 + 10}s`;
            element.style.animationDelay = `${Math.random() * 5}s`;
            
            floatingElements.appendChild(element);
        }
    }
}