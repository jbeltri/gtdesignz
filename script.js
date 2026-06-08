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

const regions = [
  {
    name: "London & South East",
    coords: [-0.34, 51.5],
    projects: [
      "Guildford — retail and Land Registry plans",
      "Hayes — outbuilding and foundation strategy",
      "Hounslow & Isleworth — residential extensions",
      "Greenford — existing and proposed plans",
      "North London — structural and energy coordination"
    ]
  },
  {
    name: "West Midlands",
    coords: [-1.99, 52.57],
    projects: [
      "Wolverhampton — Building Regulations and structural packages",
      "Birmingham — mixed-use conversion design",
      "Walsall — residential and foundation coordination",
      "Lichfield area — industrial drawing production",
      "Stoke-on-Trent — heritage drawing coordination"
    ]
  },
  {
    name: "Milton Keynes",
    coords: [-0.7594, 52.0406],
    projects: [
      "Regional architectural design support",
      "Technical drawings and project coordination"
    ]
  }
];

const boroughs = [
  {
    name: "City of Wolverhampton",
    coords: [-2.128, 52.586],
    projects: [
      "WV6 9NL - structural plans and reports",
      "WV6 0JJ - detailed plans and structural calculations",
      "WV3 7DT - architectural and technical design",
      "WV4 5HD - residential design coordination",
      "WV2 2LZ - technical drawing package"
    ]
  },
  {
    name: "Walsall",
    coords: [-1.982, 52.586],
    projects: [
      "WS5 3AE - drawing and design coordination",
      "WS3 2SQ - raft foundation and structural calculations",
      "WS5 3LF - residential technical design"
    ]
  },
  {
    name: "London Borough of Hounslow",
    coords: [-0.36, 51.468],
    projects: [
      "TW5 0AD - residential design package",
      "TW13 5PD - extension beam calculations"
    ]
  },
  { name: "London Borough of Haringey", coords: [-0.111, 51.59], projects: ["N11 2PR - beam calculations and energy coordination"] },
  { name: "London Borough of Hillingdon", coords: [-0.45, 51.54], projects: ["UB3 4PD - outbuilding and raft foundation design"] },
  { name: "London Borough of Ealing", coords: [-0.308, 51.513], projects: ["UB6 8JN - existing and proposed plans"] },
  { name: "London Borough of Brent", coords: [-0.281, 51.558], projects: ["HA0 4RW - architectural drawings"] },
  { name: "Birmingham", coords: [-1.89, 52.486], projects: ["B74 4BN - loft floor structural calculations"] },
  { name: "Dudley", coords: [-2.082, 52.512], projects: ["DY8 3NY - construction junction and waterproofing details"] },
  { name: "Slough", coords: [-0.595, 51.51], projects: ["SL3 8UR - structural calculations and joint report"] },
  { name: "Stoke-on-Trent", coords: [-2.179, 53.003], projects: ["ST4 1DJ - heritage drawing coordination"] }
];

if (document.querySelector("#project-map") && window.maplibregl) {
  const map = new maplibregl.Map({
    container: "project-map",
    style: "https://tiles.openfreemap.org/styles/liberty",
    center: [-1.15, 52.05],
    zoom: 5.7,
    minZoom: 5,
    maxZoom: 13,
    scrollZoom: false,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    attributionControl: true
  });

  map.touchZoomRotate.disableRotation();

  boroughs.forEach((borough) => {
    const element = document.createElement("button");
    element.className = "regional-marker";
    element.type = "button";
    element.title = borough.name;
    const projectLabel = borough.projects.length === 1 ? "project" : "projects";
    element.setAttribute("aria-label", `${borough.name}: ${borough.projects.length} ${projectLabel} in 2024`);
    element.innerHTML = `<span>${borough.projects.length}</span>`;

    const projectList = borough.projects.map((project) => `<li>${project}</li>`).join("");
    const popup = new maplibregl.Popup({ offset: 30, closeButton: true })
      .setHTML(`<strong>${borough.name}</strong><small>2024 projects</small><ul>${projectList}</ul>`);

    new maplibregl.Marker({ element, anchor: "bottom" })
      .setLngLat(borough.coords)
      .setPopup(popup)
      .addTo(map);
  });

  const showAll = () => {
    const bounds = new maplibregl.LngLatBounds();
    boroughs.forEach((borough) => bounds.extend(borough.coords));
    map.fitBounds(bounds, { padding: 75, maxZoom: 6.2, duration: 700 });
  };

  map.on("load", showAll);

  document.querySelectorAll("[data-map-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.mapAction;
      if (action === "in") map.zoomIn({ duration: 350 });
      if (action === "out") map.zoomOut({ duration: 350 });
      if (action === "all") showAll();
    });
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
