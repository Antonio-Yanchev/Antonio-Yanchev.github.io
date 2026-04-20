const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function makeVisible(el) {
  el.classList.add("is-visible");
}

if (!prefersReduced) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          makeVisible(entry.target);
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 },
  );

  document
    .querySelectorAll(".reveal, .reveal-stagger")
    .forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll(".reveal, .reveal-stagger").forEach(makeVisible);
}

const navLinks = Array.from(document.querySelectorAll("nav .navlink"));
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((a) => a.setAttribute("aria-current", "false"));
    link.setAttribute("aria-current", "true");
  });
});

if (sections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.setAttribute("aria-current", "false"));
          const id = "#" + entry.target.id;
          const active = navLinks.find((a) => a.getAttribute("href") === id);
          if (active) {
            active.setAttribute("aria-current", "true");
          }
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0.08 },
  );

  sections.forEach((section) => navObserver.observe(section));
}

const avatar = document.getElementById("avatar");
const modal = document.getElementById("avatarModal");
const closeBtn = document.getElementById("closeAvatar");

function openModal() {
  if (!modal) {
    return;
  }
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  if (closeBtn) {
    closeBtn.focus();
  }
}

function closeModal() {
  if (!modal) {
    return;
  }
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (avatar) {
  avatar.addEventListener("click", openModal);
}
if (closeBtn) {
  closeBtn.addEventListener("click", closeModal);
}
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});
