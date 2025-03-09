import './index.css'

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.bottom-2 button, .bottom-4 button');
const progressBar = document.querySelector('.progress-bar');
let autoAdvanceTimer;
let touchStartX = 0;
let touchEndX = 0;
const carousel = document.querySelector('.carousel-track');

// Add touch events for swipe
carousel.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carousel.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

function updateSlides() {
    slides.forEach((slide, index) => {
        slide.className = 'carousel-item absolute top-0 left-0 w-full h-full';
        if (index === currentSlide) {
            slide.classList.add('active');
        } else if (index === (currentSlide + 1) % slides.length) {
            slide.classList.add('next');
        } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
            slide.classList.add('prev');
        } else {
            slide.classList.add('hidden');
        }
    });

    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.className = `w-8 sm:w-12 h-1 sm:h-1.5 rounded-full transition-colors ${
            index === currentSlide ? 'bg-white/40' : 'bg-white/20'
        } hover:bg-white/60`;
    });

    // Update progress bar
    progressBar.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
}

function resetAutoAdvance() {
    clearInterval(autoAdvanceTimer);
    autoAdvanceTimer = setInterval(nextSlide, 5000);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
    resetAutoAdvance();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlides();
    resetAutoAdvance();
}

// Add click handlers to indicators
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        updateSlides();
        resetAutoAdvance();
    });
});

export const Carousel = () => (
    <div>
        <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-purple-900/20 to-fuchsia-900/20"></div>
            <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-violet-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-fuchsia-500/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="w-full max-w-6xl mx-auto">
            <div className="carousel-container relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden z-20">
                    <div className="progress-bar absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                </div>

                <button className="nav-button absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center z-20 text-white touch-manipulation" onclick="prevSlide()" title="Previous slide">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>

                <button className="nav-button absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center z-20 text-white touch-manipulation" onclick="nextSlide()" title="Next slide">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>

                <div className="carousel-track relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
                    <div className="carousel-item active absolute top-0 left-0 w-full h-full">
                        <div className="w-full h-full p-4 sm:p-8">
                            <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1515462277126-2dd0c162007a?auto=format&fit=crop&q=80" alt="Geometric art installation" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/40 to-purple-500/40 mix-blend-overlay"></div>
                                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                    <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">Digital Prism</h3>
                                    <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl">Where geometry meets art in a stunning display of light and form.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="carousel-item next absolute top-0 left-0 w-full h-full">
                        <div className="w-full h-full p-4 sm:p-8">
                            <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80" alt="Futuristic tech setup" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/40 to-pink-500/40 mix-blend-overlay"></div>
                                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                    <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">Tech Haven</h3>
                                    <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl">Immerse yourself in the cutting edge of technology and innovation.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="carousel-item hidden absolute top-0 left-0 w-full h-full">
                        <div className="w-full h-full p-4 sm:p-8">
                            <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80" alt="Abstract digital art" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/40 to-rose-500/40 mix-blend-overlay"></div>
                                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                    <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">Neural Dreams</h3>
                                    <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl">AI-generated masterpieces that blur the line between human and machine creativity.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 z-20">
                    <button className="w-8 sm:w-12 h-1 sm:h-1.5 rounded-full bg-white/40 hover:bg-white/60 transition-colors" title="Go to slide 1"></button>
                    <button className="w-8 sm:w-12 h-1 sm:h-1.5 rounded-full bg-white/20 hover:bg-white/60 transition-colors" title="Go to slide 2"></button>
                    <button className="w-8 sm:w-12 h-1 sm:h-1.5 rounded-full bg-white/20 hover:bg-white/60 transition-colors" title="Go to slide 3"></button>
                </div>
            </div>
        </div>
    </div>
);
