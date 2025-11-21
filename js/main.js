// Main JavaScript file - imports all other modules
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website loaded successfully!');
    
    // Initialize all modules
    if (typeof initNavigation === 'function') initNavigation();
    if (typeof initAnimations === 'function') initAnimations();
    if (typeof initLanguageSwitcher === 'function') initLanguageSwitcher();
    if (typeof initSliders === 'function') initSliders();
    if (typeof initFormHandler === 'function') initFormHandler();
});