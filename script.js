const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];
const backToTop = document.querySelector(".back-to-top");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// مزامنة حالة قائمة الهاتف مع موضع التمرير.
function setMenuOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
  siteNav.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

const sections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const activeLink = navLinks.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
    if (activeLink) {
      navLinks.forEach((link) => link.classList.toggle("is-active", link === activeLink));
    }
  });
}, { rootMargin: "-28% 0px -62% 0px", threshold: 0 });

sections.forEach((section) => sectionObserver.observe(section));

function updateScrollState() {
  const scrolled = window.scrollY > 24;
  header.classList.toggle("is-scrolled", scrolled);
  backToTop.classList.toggle("is-visible", window.scrollY > 600);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${(index % 4) * 70}ms`;
  revealObserver.observe(element);
});

const progressPanel = document.querySelector(".progress-panel");
const progressRing = document.querySelector(".progress-ring");
const progressObserver = new IntersectionObserver((entries, observer) => {
  if (!entries.some((entry) => entry.isIntersecting)) return;
  progressPanel.classList.add("is-visible");
  progressRing.style.setProperty("--ring-value", `${progressRing.dataset.progress}%`);
  progressPanel.querySelectorAll(".stat-track span").forEach((bar) => {
    bar.style.setProperty("--bar-width", bar.dataset.width);
  });
  observer.disconnect();
}, { threshold: 0.35 });

progressObserver.observe(progressPanel);

document.querySelector("#year").textContent = new Date().getFullYear().toLocaleString("ar-EG");

// إخفاء موضع الشعار عند غياب الملف دون استبداله بشعار آخر.
document.querySelectorAll(".brand img").forEach((image) => {
  image.addEventListener("error", () => image.remove(), { once: true });
});