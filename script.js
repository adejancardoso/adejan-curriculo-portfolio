const projectsGrid = document.querySelector(".projects-grid");

if (projectsGrid) {
    const projectCards = [...projectsGrid.querySelectorAll(".project-card")];
    const previousButton = document.querySelector(".carousel-prev");
    const nextButton = document.querySelector(".carousel-next");
    const dotsContainer = document.querySelector(".carousel-dots");
    let activeProject = 0;
    let autoplayTimer;
    const autoplayDelay = 4000;

    projectCards.forEach((card, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Mostrar projeto ${index + 1}`);
        dot.addEventListener("click", () => scrollToProject(index));
        dotsContainer.appendChild(dot);
    });

    const dots = [...dotsContainer.querySelectorAll(".carousel-dot")];

    function scrollToProject(index) {
    activeProject = Math.max(0, Math.min(index, projectCards.length - 1));

    const card = projectCards[activeProject];
    const distance = card.getBoundingClientRect().left
        - projectsGrid.getBoundingClientRect().left
        - projectsGrid.clientLeft;

    // Rola na horizontal apenas dentro do carrossel.
    projectsGrid.scrollBy({
        left: distance,
        behavior: "smooth"
    });

    updateCarousel();
}

    function updateCarousel() {
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === activeProject);
            dot.setAttribute("aria-current", index === activeProject ? "true" : "false");
        });
        previousButton.disabled = activeProject === 0;
        nextButton.disabled = activeProject === projectCards.length - 1;
    }

    previousButton.addEventListener("click", () => scrollToProject(activeProject - 1));
    nextButton.addEventListener("click", () => scrollToProject(activeProject + 1));

    projectsGrid.addEventListener("scroll", () => {
        const gridLeft = projectsGrid.getBoundingClientRect().left;
        let nearestIndex = 0;
        let nearestDistance = Infinity;

        projectCards.forEach((card, index) => {
            const distance = Math.abs(card.getBoundingClientRect().left - gridLeft);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = index;
            }
        });

        activeProject = nearestIndex;
        updateCarousel();
    });

    projectsGrid.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") scrollToProject(activeProject - 1);
        if (event.key === "ArrowRight") scrollToProject(activeProject + 1);
    });

    function startAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(() => {
            const nextIndex = activeProject === projectCards.length - 1 ? 0 : activeProject + 1;
            scrollToProject(nextIndex);
        }, autoplayDelay);
    }

    const carousel = projectsGrid.closest(".projects-carousel");

    carousel.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", () => clearInterval(autoplayTimer));
    carousel.addEventListener("focusout", startAutoplay);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            clearInterval(autoplayTimer);
        } else {
            startAutoplay();
        }
    });

    updateCarousel();
    startAutoplay();
}
