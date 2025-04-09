document.addEventListener('DOMContentLoaded', () => {
    const sliderTrack = document.querySelector('.slider-track');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const sliderItems = document.querySelectorAll('.slider-item');
    const totalItems = sliderItems.length;

    // Clonar la primera y última imagen para el efecto infinito
    const firstClone = sliderItems[0].cloneNode(true);
    const lastClone = sliderItems[totalItems - 1].cloneNode(true);

    // Agregar clones al slider
    sliderTrack.appendChild(firstClone);
    sliderTrack.insertBefore(lastClone, sliderItems[0]);

    let currentIndex = 1; // Empezar en el primer elemento original (no en el clon)
    let isTransitioning = false;

    // Función para mover el slider
    const moveSlider = (direction) => {
        if (isTransitioning) return; // Evitar múltiples clics durante la transición
        isTransitioning = true;

        currentIndex += direction;
        sliderTrack.style.transition = 'transform 0.5s ease-in-out';
        sliderTrack.style.transform = `translateX(${-currentIndex * 100}%)`;
    };

    // Evento para el botón "Siguiente"
    nextButton.addEventListener('click', () => {
        moveSlider(1);
    });

    // Evento para el botón "Anterior"
    prevButton.addEventListener('click', () => {
        moveSlider(-1);
    });

    // Reiniciar el slider cuando llega al final o al principio
    sliderTrack.addEventListener('transitionend', () => {
        if (currentIndex === 0) {
            // Si está en el clon inicial, saltar al último elemento real
            sliderTrack.style.transition = 'none';
            currentIndex = totalItems;
            sliderTrack.style.transform = `translateX(${-currentIndex * 100}%)`;
        } else if (currentIndex === totalItems + 1) {
            // Si está en el clon final, saltar al primer elemento real
            sliderTrack.style.transition = 'none';
            currentIndex = 1;
            sliderTrack.style.transform = `translateX(${-currentIndex * 100}%)`;
        }
        isTransitioning = false;
    });

    // Cambio automático de imágenes cada 3 segundos
    setInterval(() => {
        moveSlider(1);
    }, 5000);
});