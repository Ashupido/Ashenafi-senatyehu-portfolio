// Project image slider functionality
function initSliders() {
    document.querySelectorAll(".project-card").forEach(card => {
        const slides = card.querySelectorAll(".project-img img");
        const prev = card.querySelector(".prev");
        const next = card.querySelector(".next");
        let index = 0;

        function showSlide(i) {
            slides.forEach((img, n) => img.classList.toggle("active", n === i));
        }

        if (next && slides.length > 1) {
            next.addEventListener("click", () => {
                index = (index + 1) % slides.length;
                showSlide(index);
            });
        }

        if (prev && slides.length > 1) {
            prev.addEventListener("click", () => {
                index = (index - 1 + slides.length) % slides.length;
                showSlide(index);
            });
        }

        // Auto-slide every 4s
        if (slides.length > 1) {
            setInterval(() => {
                index = (index + 1) % slides.length;
                showSlide(index);
            }, 4000);
        }

        // Initialize first slide
        if (slides.length > 0) {
            showSlide(index);
        }
    });
}