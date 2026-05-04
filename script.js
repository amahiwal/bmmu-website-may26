const header = document.querySelector(".site-header");
const heroArt = document.querySelector(".hero-art");
const heroMark = document.querySelector(".hero-mark-wrap");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealTargets = [
  ...document.querySelectorAll(
    ".reveal, .reveal-stagger"
  ),
];

const progressBar = document.getElementById("progressBar");
const scrollTopBtn = document.getElementById("scrollTop");

const updateProgress = () => {
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  const progress = (window.pageYOffset / totalHeight) * 100;
  if (progressBar) progressBar.style.width = `${progress}%`;

  if (scrollTopBtn) {
    if (progress > 40) {
      scrollTopBtn.classList.add("is-visible");
    } else {
      scrollTopBtn.classList.remove("is-visible");
    }
  }
};

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

window.addEventListener("scroll", updateProgress);


revealTargets.forEach((target) => target.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

// Mouse hover effect removed as requested


// FAQ Accordion Logic
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const trigger = item.querySelector(".faq-trigger");
  trigger.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    
    // If we click an already active item, do nothing (as per "always one open")
    if (isActive) return;

    // Close all other items
    faqItems.forEach((otherItem) => {
      otherItem.classList.remove("active");
    });

    // Open the clicked item
    item.classList.add("active");
  });
});

// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle");
const body = document.body;
const navLinks = document.querySelectorAll(".nav a");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    body.classList.toggle("is-nav-open");
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    body.classList.remove("is-nav-open");
  });
});

// Slider Logic
const sliderContainer = document.querySelector('.slider-container');
const sliderTrack = document.querySelector('.slider-track');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

if (sliderContainer && sliderTrack) {
  let isDragging = false;
  let startX;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let currentIndex = 0;
  let autoSlideInterval;

  const cards = Array.from(document.querySelectorAll('.person-card'));
  
  let cardWidth;
  let maxTranslate;

  const updateSliderMetrics = () => {
    if (cards.length > 0) {
      cardWidth = cards[0].offsetWidth + 24;
      maxTranslate = -(sliderTrack.scrollWidth - sliderContainer.offsetWidth);
    }
  };

  window.addEventListener('load', updateSliderMetrics);
  window.addEventListener('resize', () => {
    updateSliderMetrics();
    currentIndex = 0;
    currentTranslate = 0;
    prevTranslate = 0;
    setSliderPosition();
  });

  const setSliderPosition = () => {
    sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
  };

  const moveSlider = (direction) => {
    if (!cardWidth) updateSliderMetrics();
    if (!cardWidth) return;

    currentIndex += direction;
    
    const totalCards = cards.length;
    const visibleCards = Math.floor(sliderContainer.offsetWidth / cardWidth);
    const maxIndex = totalCards - visibleCards;

    if (currentIndex < 0) currentIndex = maxIndex;
    if (currentIndex > maxIndex) currentIndex = 0;

    currentTranslate = -(currentIndex * cardWidth);
    
    // Boundary check for the last slide
    if (currentTranslate < maxTranslate) {
      currentTranslate = maxTranslate;
    }

    prevTranslate = currentTranslate;
    setSliderPosition();
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
      moveSlider(1);
    }, 4000);
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideInterval);
  };

  // Button Controls
  nextBtn?.addEventListener('click', () => {
    moveSlider(1);
    startAutoSlide();
  });

  prevBtn?.addEventListener('click', () => {
    moveSlider(-1);
    startAutoSlide();
  });

  // Drag / Touch Logic
  const getPositionX = (event) => {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  };

  const touchStart = (event) => {
    isDragging = true;
    startX = getPositionX(event);
    stopAutoSlide();
    sliderTrack.style.transition = 'none';
  };

  const touchMove = (event) => {
    if (!isDragging) return;
    const currentX = getPositionX(event);
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;
    setSliderPosition();
  };

  const touchEnd = () => {
    isDragging = false;
    sliderTrack.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    
    if (!cardWidth) updateSliderMetrics();
    if (!cardWidth) return;

    // Snap to closest card
    currentIndex = Math.round(Math.abs(currentTranslate) / cardWidth);
    
    const totalCards = cards.length;
    const visibleCards = Math.floor(sliderContainer.offsetWidth / cardWidth);
    const maxIndex = totalCards - visibleCards;
    
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    currentTranslate = -(currentIndex * cardWidth);
    prevTranslate = currentTranslate;
    setSliderPosition();
    startAutoSlide();
  };

  sliderContainer.addEventListener('mousedown', touchStart);
  sliderContainer.addEventListener('mousemove', touchMove);
  sliderContainer.addEventListener('mouseup', touchEnd);
  sliderContainer.addEventListener('mouseleave', () => {
    if (isDragging) touchEnd();
  });

  sliderContainer.addEventListener('touchstart', touchStart);
  sliderContainer.addEventListener('touchmove', touchMove);
  sliderContainer.addEventListener('touchend', touchEnd);

  // Wheel / Trackpad Horizontal Scroll
  let wheelTimeout;
  sliderContainer.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      event.preventDefault();
      stopAutoSlide();
      
      if (!cardWidth) updateSliderMetrics();
      
      currentTranslate -= event.deltaX;
      
      // Boundaries
      if (currentTranslate > 0) currentTranslate = 0;
      if (currentTranslate < maxTranslate) currentTranslate = maxTranslate;
      
      setSliderPosition();
      prevTranslate = currentTranslate;

      // Snap after scrolling stops
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        touchEnd();
      }, 150);
    }
  }, { passive: false });

  // Resize handling
  window.addEventListener('resize', () => {
    currentIndex = 0;
    currentTranslate = 0;
    prevTranslate = 0;
    setSliderPosition();
  });

  // Initialize
  updateSliderMetrics();
  startAutoSlide();
}
