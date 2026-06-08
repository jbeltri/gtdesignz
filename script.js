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

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const locations = [
  { name: "Guildford", brief: "Retail demise and Land Registry plan coordination", coords: [51.2362, -0.5704] },
  { name: "Wolverhampton", brief: "Building Regulations, structural packages and technical details", coords: [52.5862, -2.1285] },
  { name: "Birmingham", brief: "Multi-level commercial and residential conversion design", coords: [52.4862, -1.8904] },
  { name: "Walsall", brief: "Residential plans, steel calculations and foundation coordination", coords: [52.586, -1.9829] },
  { name: "Stoke-on-Trent", brief: "Heritage drawings, schedules and roof details", coords: [53.0027, -2.1794] },
  { name: "Hayes", brief: "Outbuilding design and foundation strategy near trees", coords: [51.5123, -0.42] },
  { name: "Hounslow & Isleworth", brief: "Residential extensions, detailed plans and structural calculations", coords: [51.4684, -0.3618] },
  { name: "Greenford", brief: "Existing and proposed plans with site coordination", coords: [51.5281, -0.355] },
  { name: "North London", brief: "Beam calculations, SAP coordination and opening details", coords: [51.614, -0.141] },
  { name: "Lichfield area", brief: "Industrial layout and large-format technical drawing coordination", coords: [52.647, -1.93] },
  { name: "Milton Keynes", brief: "Regional architectural and technical project support", coords: [52.0406, -0.7594] }
];

if (document.querySelector("#project-map") && window.L) {
  const map = L.map("project-map", {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView([52.1, -1.25], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  const markerIcon = L.divIcon({
    className: "",
    html: '<div class="custom-marker"><span></span></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    tooltipAnchor: [0, -22]
  });

  locations.forEach((location) => {
    L.marker(location.coords, { icon: markerIcon })
      .addTo(map)
      .bindTooltip(`<strong>${location.name}</strong>${location.brief}`, {
        direction: "top",
        opacity: 1
      })
      .bindPopup(`<strong>${location.name}</strong><br>${location.brief}`);
  });
}

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
