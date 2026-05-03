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
    ".big-six .content, .split-grid > *, .testimonials .content, .quote-grid > *, .tickets .content, .ticket, .right-fit .content, .fit-grid > *, .book .content"
  ),
];

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

if (heroArt && heroMark && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  heroArt.addEventListener("pointermove", (event) => {
    const bounds = heroArt.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    heroMark.style.setProperty("--hero-x", `${x * 14}px`);
    heroMark.style.setProperty("--hero-y", `${y * 14}px`);
    heroMark.style.setProperty("--hero-tilt", `${x * 3}deg`);
  });

  heroArt.addEventListener("pointerleave", () => {
    heroMark.style.removeProperty("--hero-x");
    heroMark.style.removeProperty("--hero-y");
    heroMark.style.removeProperty("--hero-tilt");
  });
}
