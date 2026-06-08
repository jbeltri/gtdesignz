const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

navToggle?.addEventListener("click", () => {
  const open = siteNav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  navToggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}"></i>`;
  lucide.createIcons();
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const slider = document.querySelector(".project-slider");
document.querySelectorAll("[data-slide]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = slider?.querySelector(".project-card");
    const amount = (card?.getBoundingClientRect().width || 420) + 24;
    slider?.scrollBy({
      left: button.dataset.slide === "next" ? amount : -amount,
      behavior: "smooth"
    });
  });
});

const heroImage = document.querySelector("[data-time-hero]");
const heroSources = {
  dawn: "assets/images/residential-extension-dawn.webp",
  morning: "assets/images/residential-extension-morning.webp",
  midday: "assets/images/residential-extension-midday.webp",
  afternoon: "assets/images/residential-extension-afternoon.webp",
  dusk: "assets/images/residential-extension-concept.webp",
  night: "assets/images/residential-extension-night.webp"
};

const getHeroPeriod = (hour) => {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 11) return "morning";
  if (hour >= 11 && hour < 14) return "midday";
  if (hour >= 14 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 23) return "dusk";
  return "night";
};

let activeHeroPeriod = "";
const updateHeroForLocalTime = () => {
  if (!heroImage) return;

  const period = getHeroPeriod(new Date().getHours());
  if (period === activeHeroPeriod) return;

  activeHeroPeriod = period;
  heroImage.dataset.dayPeriod = period;
  heroImage.closest(".hero")?.setAttribute("data-day-period", period);

  const source = heroSources[period];
  if (heroImage.getAttribute("src") === source) return;

  const loader = new Image();
  loader.decoding = "async";
  loader.src = source;
  loader.addEventListener("load", () => {
    if (activeHeroPeriod !== period) return;

    heroImage.classList.add("is-updating");
    window.setTimeout(() => {
      heroImage.src = source;
      window.requestAnimationFrame(() => heroImage.classList.remove("is-updating"));
    }, 180);
  }, { once: true });
};

updateHeroForLocalTime();
window.setInterval(updateHeroForLocalTime, 60_000);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const projectForm = document.querySelector("#project-form");
projectForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(projectForm);
  const name = `${data.get("firstName")} ${data.get("surname")}`;
  const subject = encodeURIComponent(`New project enquiry: ${data.get("projectType")} - ${data.get("location")}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone") || "Not provided"}\n` +
    `Project type: ${data.get("projectType")}\nLocation: ${data.get("location")}\n\nProject brief:\n${data.get("description")}`
  );
  const status = projectForm.querySelector(".form-status");
  status.textContent = "Your email application is opening with the project brief ready to send.";
  window.location.href = `mailto:enquiries@gtdesignzltd.com?subject=${subject}&body=${body}`;
});

document.querySelector("#year").textContent = new Date().getFullYear();
lucide.createIcons();
