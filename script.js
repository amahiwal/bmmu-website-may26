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
