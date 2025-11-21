// Form handling functionality
function initFormHandler() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const currentLang = getCurrentLanguage ? getCurrentLanguage() : 'en';
            const message = currentLang === 'en' 
                ? `Thank you, ${name}! Your message has been sent. I'll get back to you soon.`
                : `አመሰግናለሁ, ${name}! መልእክትዎ ተልኳል። በቅርብ ጊዜ እመለስልዎታለሁ።`;
            
            alert(message);
            contactForm.reset();
            
            // AJAX submission for Netlify Forms
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(new FormData(contactForm)).toString()
            })
            .then(() => {
                if (formMessage) {
                    formMessage.style.color = "green";
                    formMessage.innerText = currentLang === 'en' 
                        ? "Your message has been sent successfully!" 
                        : "መልእክትዎ በተሳካ ሁኔታ ተልኳል!";
                }
            })
            .catch((error) => {
                if (formMessage) {
                    formMessage.style.color = "red";
                    formMessage.innerText = currentLang === 'en' 
                        ? "Oops! There was an error sending your message." 
                        : "ይቅርታ! መልእክትዎን በማስተላለፍ ላይ ስህተት ተከስቷል።";
                }
                console.error(error);
            });
        });
    }
}