(() => {
  const mapContainer = document.querySelector("#project-map");
  if (!mapContainer || !window.maplibregl) return;

  const project = (postcode, address, service) => ({ postcode, address, service });

  const projectYears = {
    "2023": [
      project("UB6 8LR", "11 Norseman Way", "Residential survey and design"),
      project("UB7 9EX", "42 Blackthorn Avenue", "Residential design package"),
      project("B43 7TA", "111 Wilderness Lane", "Roof and technical design"),
      project("UB3 3PA", "25 Birchway", "Loft structural design"),
      project("WD23 2BB", "108 Park Avenue", "Architectural and structural plans"),
      project("KT20 5DZ", "38 Downs Way", "Detailed construction design"),
      project("WV2 2DU", "14 Rooker Crescent", "Building Regulations package"),
      project("WV6 0AX", "134 Sweetman Street", "Building Regulations package"),
      project("TW5 0AD", "9 and 11 Shenley Road", "Residential design and structures"),
      project("WS3 2SQ", "2 Tintern Crescent", "Building Regulations package")
    ],
    "2024": [
      project("UB10 9NG", "5 North Way", "Residential design package"),
      project("WD3 4EE", "2 Spencer Walk", "Architectural and technical design"),
      project("WV2 2DU", "14 Rooker Crescent", "Building Regulations coordination"),
      project("UB1 2TL", "35 St Peters Road", "Residential plans and structures"),
      project("B42 2NY", "129 Booths Farm Road", "Architectural design"),
      project("LU1 3XG", "18 Union Street", "Technical drawing package"),
      project("B74 3AF", "Atrium House, Barns Farm, Roman Lane", "Commercial design coordination"),
      project("WS2 7AF", "9 Forest Lane", "Residential technical design"),
      project("B33 9SB", "302 Kitts Green Road", "Architectural design"),
      project("TW8 0EW", "60 Kew Bridge Road", "Residential design coordination"),
      project("UB10 8RU", "112 Burnham Avenue", "Residential plans"),
      project("B43 7TA", "111 Wilderness Lane", "Roof and structural design"),
      project("HP12 3LT", "11 Juniper Drive", "Residential technical package"),
      project("WV12 5BE", "261 Lichfield Road", "Architectural and structural design"),
      project("WS9 0BE", "203 Walsall Road", "Residential design package"),
      project("UB4 0NJ", "179 Berwick Avenue", "Planning and technical drawings"),
      project("WD23 4HN", "102 Ashfield Avenue", "Residential design"),
      project("WS11 1SH", "The Angles, Watling Street", "Architectural design"),
      project("WS12 0QD", "59 Ironstone Road", "Residential plans and structures"),
      project("B14 6TW", "25 Mercia Drive", "Residential design package"),
      project("ST17 0LX", "9 Oak Avenue", "Architectural and technical design"),
      project("UB8 3NU", "27 Copperfield Avenue", "Residential structural design"),
      project("UB3 3PA", "25 Birchway", "Loft structural design"),
      project("WV12 4SH", "12 Eaton Rise", "Residential design package"),
      project("CV6 3FR", "72 Owenford Road", "Architectural plans"),
      project("WD23 2BB", "108 Park Avenue", "Architectural and structural plans"),
      project("KT20 5DZ", "38 Downs Way", "Detailed construction design"),
      project("LE2 8RF", "5 Vaughan Road", "Residential design package"),
      project("WS3 2SQ", "2 Tintern Crescent", "Raft foundation and calculations"),
      project("WV6 0JJ", "124 Court Road", "Detailed plans and structures"),
      project("WV13 1HA", "15 Avon Drive", "Residential design"),
      project("WV11 1BF", "10 High Street", "Technical drawing package"),
      project("B70 0SP", "9 Melbourne Close", "Foundation design"),
      project("WV4 5SS", "61 Mount Road", "Residential technical design"),
      project("WV4 5RH", "63 Dewsbury Drive", "Residential plans and structures"),
      project("CV3 6PF", "141 Kenpas Highway", "Architectural and technical design"),
      project("CV2 5AY", "6 Belgrave Road", "Residential design package"),
      project("HA0 4RW", "10 Queen Victoria Avenue", "Architectural drawings"),
      project("TW5 9DH", "20 St Leonards Gardens", "Residential design"),
      project("N11 2PR", "42A Palace Road", "Beam calculations and energy coordination"),
      project("UB3 4PD", "16 Crane Gardens", "Outbuilding and raft foundation design"),
      project("WV6 0AX", "134 Sweetman Street", "Building Regulations package"),
      project("WV6 9NL", "17 Tyninghame Avenue", "Structural plans and reports"),
      project("B62 9PF", "99 Narrow Lane", "Residential technical design"),
      project("B62 8SJ", "118 Hamilton Avenue", "Structural calculations"),
      project("WV14 8EF", "7 Edinburgh Road", "Residential design package"),
      project("HA4 0NW", "177 Queens Walk", "Architectural design"),
      project("DY4 7RJ", "4 Peake Drive", "Residential plans and structures"),
      project("UB6 9HT", "16 Garrick Road", "Architectural plans"),
      project("HA9 6QL", "218 Harrow Road", "Residential design package"),
      project("TW13 5PD", "91 Winchester Road", "Extension beam calculations"),
      project("WS5 3AE", "15 Brookhouse Road", "Drawing and design coordination"),
      project("B74 4BN", "35 Sara Close", "Loft floor structural calculations"),
      project("SL3 8UR", "73 Torridge Road", "Structural calculations and joint report"),
      project("B92 7EF", "130 Kineton Green Road", "Residential technical design"),
      project("DY8 3NY", "99 Bridgnorth Road", "Construction and waterproofing details"),
      project("WS5 4RG", "6 Willowherb Close", "Residential design package"),
      project("WV3 7DT", "7 Duke Street", "Architectural and technical design"),
      project("WV4 5HD", "33 Dudley Walk", "Residential design coordination"),
      project("WV2 2LZ", "80 George Street", "Technical drawing package"),
      project("WS5 3LF", "12 Beacon Road", "Residential technical design"),
      project("UB6 8JN", "90 Thames Avenue", "Existing and proposed plans"),
      project("ST4 1DJ", "36-42 Church Street", "Heritage drawing coordination"),
      project("TW5 0AD", "9 and 11 Shenley Road", "Residential design and structures")
    ],
    "2025": [
      project("TW3 2HN", "51 Park Close", "Residential design package"),
      project("TW5 9DH", "20 St Leonards Gardens", "Residential design"),
      project("UB7 7AA", "3 Ferrers Avenue", "Architectural and technical design"),
      project("WS3 2SQ", "2 Tintern Crescent", "Foundation and structural design"),
      project("B92 7EF", "130 Kineton Green Road", "Residential technical design"),
      project("W5 2JF", "63 Park View Road", "Residential design package"),
      project("WV3 7DT", "7 Duke Street", "Detailed plans and foundations"),
      project("B74 2AA", "19 Donegal Road", "Architectural design"),
      project("WV10 0LY", "13 Bushbury Road", "Residential plans and structures"),
      project("ST5 3TZ", "12 Bordeaux Walk", "Residential technical design"),
      project("B32 1JU", "162 Worlds End Lane", "Architectural design package"),
      project("PE28 0QN", "White Gates, Bythorn", "Residential design coordination"),
      project("WV6 9NL", "17 Tyninghame Avenue", "Structural plans and reports"),
      project("TW7 5HF", "18 Downs View", "Residential design package"),
      project("WS1 2PS", "248 Broadway North", "Architectural and structural design"),
      project("UB8 3NU", "11 Copperfield Avenue", "Structural design review"),
      project("B62 8SJ", "118 Hamilton Avenue", "Vaulted ceiling and joist calculations"),
      project("UB3 3AH", "25 Stirling Road", "Residential design package"),
      project("TW5 0AD", "9 and 11 Shenley Road", "Residential design and structures"),
      project("UB8 1AB", "4 Cornwall Road", "Detailed architectural plans"),
      project("KT12 4PW", "12 Newlands Close", "Residential technical design"),
      project("WV4 5HD", "33 Dudley Walk", "Residential design coordination"),
      project("CV3 6PF", "143 Kenpas Highway", "Architectural and technical design"),
      project("HA1 4TQ", "82 Longley Road", "Residential design package"),
      project("TW12 1DH", "29 St James's Road", "Architectural and structural design"),
      project("SL3 0QH", "56 Dawley Ride", "Residential technical package"),
      project("TW7 7DT", "256a Twickenham Road", "Architectural design"),
      project("CV2 5GP", "51 Meadow Due Road", "Residential design package"),
      project("WV6 0PL", "61 Evans Street", "Residential plans and structures"),
      project("HA2 8EX", "392 Northolt Road", "Architectural design package"),
      project("DY4 7RJ", "4 Peake Drive", "Residential plans and structures"),
      project("GU1 4AW", "71-72 North Street", "Land Registry and lease plans"),
      project("WS2 0JL", "106 Wilkes Avenue", "Beam and raft foundation calculations"),
      project("WD4 8JW", "Old Farm, Harthall Lane", "Extension and planning design"),
      project("HA2 7QN", "52 The Ridgeway", "Residential design package"),
      project("UB10 9HS", "84 Sutton Court Road", "Architectural and technical design"),
      project("NW2 1JJ", "199 Hendon Way", "Residential design coordination"),
      project("UB1 2TL", "35 St Peters Road", "Residential plans and structures"),
      project("UB7 9DW", "102 Sipson Road", "Extension, dormer and boiler room plans"),
      project("B74 2LG", "44 Thornhill Park", "Residential design package"),
      project("B70 9TJ", "41 Wheatley Street", "Raft foundation design and calculations"),
      project("WV14 8UP", "Daisy Bank Community Centre, Ash Road", "Multi-plot technical design"),
      project("WS1 4NW", "17 Duchess Road", "Architectural and structural design"),
      project("B21 9ST", "145 Soho Road", "Commercial design package"),
      project("LU4 8PY", "116-124 Wingate Road", "Architectural design coordination")
    ],
    "2026": [
      project("ST5 3TZ", "12 Bordeaux Walk", "Structural calculations and technical updates"),
      project("TW3 2NS", "152 Heath Road", "Drawing and CAD conversion"),
      project("ST4 1DJ", "36-42 Church Street", "Detailed plans, energy, drainage and heritage work"),
      project("UB6 8JN", "90 Thames Avenue", "Beam calculations and site plans"),
      project("B21 9ST", "145 Soho Road", "Commercial plans, stairs, joists and Building Regulations"),
      project("UB7 7AA", "3 Ferrers Avenue", "Updated beam calculations"),
      project("WV4 6QH", "104 Farrington Road", "Planning updates and structural calculations"),
      project("B74 2LG", "44 Thornhill Park", "Extension plans and structural calculations"),
      project("B13 9LU", "2 Bankside, Moseley", "Beam calculations"),
      project("B93 9JW", "88 Barcheston Road", "Build-over design and structural calculations"),
      project("WS5 3LF", "12 Beacon Road", "Detailed plans and structural calculations"),
      project("WV3 7DT", "7 Duke Street", "U-value calculations"),
      project("TW5 0AD", "9 and 11 Shenley Road", "Updated structural calculations"),
      project("WV4 5HD", "33 Dudley Walk", "Wall-removal structural calculations"),
      project("B70 9AL", "178 Dudley Street", "Steel beam calculations"),
      project("WV2 2LZ", "80 George Street", "Detailed plans and foundation design"),
      project("B66 4JU", "25-27 Waterloo Road", "EPC, SAP and CAD documentation"),
      project("HA4 0NW", "177 Queens Walk", "As-built elevation drawings"),
      project("WS5 4LB", "60 Redwood Road", "Loadbearing wall and beam calculations"),
      project("TW7 5HH", "115 Roxborough Avenue", "Detailed plans and structural calculations"),
      project("WS8 6LA", "G J F Fabrications Ltd, The Chase Link", "Scaled A0 drawing package"),
      project("WD4 8JW", "Old Farm, Harthall Lane", "Planning review and proposal development"),
      project("GU1 4AW", "71-72 North Street", "Land Registry-compliant plans")
    ]
  };

  const mapSummary = document.querySelector("#map-summary");
  const normalizePostcode = (postcode) => postcode.trim().toUpperCase().replace(/\s+/g, " ");
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
  const boroughColours = [
    "#d75a3f", "#087f78", "#3467a6", "#91711f", "#45763f", "#9a4c76",
    "#7857a4", "#b05e25", "#3f7b88", "#a24b4b", "#56704b", "#6863a3"
  ];
  const colourForBorough = (borough) => {
    const hash = [...borough].reduce((total, character) => total + character.charCodeAt(0), 0);
    return boroughColours[hash % boroughColours.length];
  };
  const postcodeOverrides = new Map([
    ["WS8 6LA", { borough: "Walsall", coords: [-1.920646, 52.652269] }]
  ]);
  const allPostcodes = [...new Set(
    Object.values(projectYears).flat().map(({ postcode }) => normalizePostcode(postcode))
  )];
  const postcodeLocations = new Map();

  const loadPostcodeLocations = async () => {
    const chunks = [];
    for (let index = 0; index < allPostcodes.length; index += 100) {
      chunks.push(allPostcodes.slice(index, index + 100));
    }

    const payloads = await Promise.all(chunks.map(async (postcodes) => {
      const response = await fetch("https://api.postcodes.io/postcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcodes })
      });
      if (!response.ok) throw new Error("Postcode lookup failed");
      return response.json();
    }));

    payloads.flatMap(({ result }) => result).forEach(({ query, result }) => {
      if (!result) return;
      postcodeLocations.set(normalizePostcode(query), {
        borough: result.admin_district || result.region || "United Kingdom",
        coords: [result.longitude, result.latitude]
      });
    });
    postcodeOverrides.forEach((location, postcode) => {
      postcodeLocations.set(postcode, location);
    });
  };

  const groupsForYear = (year) => {
    const groups = new Map();
    projectYears[year].forEach((entry) => {
      const postcode = normalizePostcode(entry.postcode);
      const location = postcodeLocations.get(postcode);
      if (!location) return;
      if (!groups.has(postcode)) {
        groups.set(postcode, { postcode, ...location, projects: [] });
      }
      groups.get(postcode).projects.push(entry);
    });
    return [...groups.values()];
  };

  const featureCollectionForYear = (year) => ({
    type: "FeatureCollection",
    features: groupsForYear(year).map((group) => {
      const projectList = group.projects.map(({ address, service }) => (
        `<li><b>${escapeHTML(address)}</b><span>${escapeHTML(service)}</span></li>`
      )).join("");
      return {
        type: "Feature",
        geometry: { type: "Point", coordinates: group.coords },
        properties: {
          kind: "postcode",
          postcode: group.postcode,
          borough: group.borough,
          markerColour: colourForBorough(group.borough),
          popup: `<strong>${escapeHTML(group.postcode)}</strong>` +
            `<small>${escapeHTML(group.borough)} | ${year}</small><ul>${projectList}</ul>`
        }
      };
    })
  });

  const boroughCollectionForYear = (year) => {
    const boroughs = new Map();
    groupsForYear(year).forEach((group) => {
      if (!boroughs.has(group.borough)) {
        boroughs.set(group.borough, { borough: group.borough, groups: [] });
      }
      boroughs.get(group.borough).groups.push(group);
    });

    return {
      type: "FeatureCollection",
      features: [...boroughs.values()].map(({ borough, groups }) => {
        const coords = [
          groups.reduce((total, group) => total + group.coords[0], 0) / groups.length,
          groups.reduce((total, group) => total + group.coords[1], 0) / groups.length
        ];
        return {
          type: "Feature",
          geometry: { type: "Point", coordinates: coords },
          properties: {
            kind: "borough",
            borough,
            postcodeCount: groups.length,
            markerColour: colourForBorough(borough)
          }
        };
      })
    };
  };

  const map = new maplibregl.Map({
    container: "project-map",
    style: "https://tiles.openfreemap.org/styles/liberty",
    center: [-1.15, 52.05],
    zoom: 5.7,
    minZoom: 5,
    maxZoom: 14,
    scrollZoom: false,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    attributionControl: true
  });

  map.touchZoomRotate.disableRotation();
  let activeYear = "2026";
  let mapMarkers = [];

  const clearMarkers = () => {
    mapMarkers.forEach((marker) => marker.remove());
    mapMarkers = [];
  };

  const renderMarkers = () => {
    if (!postcodeLocations.size) return;
    clearMarkers();

    if (map.getZoom() < 8.25) {
      mapMarkers = boroughCollectionForYear(activeYear).features.map((feature) => {
        const { borough, postcodeCount, markerColour } = feature.properties;
        const element = document.createElement("button");
        element.className = "borough-map-marker";
        element.type = "button";
        element.textContent = postcodeCount;
        const postcodeLabel = postcodeCount === 1 ? "postcode" : "postcodes";
        element.title = `${borough}: ${postcodeCount} verified ${postcodeLabel}`;
        element.setAttribute("aria-label", element.title);
        element.style.setProperty("--marker-colour", markerColour);
        element.addEventListener("click", (event) => {
          event.stopPropagation();
          map.easeTo({
            center: feature.geometry.coordinates,
            zoom: 9,
            duration: 500
          });
        });
        return new maplibregl.Marker({ element, anchor: "center" })
          .setLngLat(feature.geometry.coordinates)
          .addTo(map);
      });
      return;
    }

    mapMarkers = featureCollectionForYear(activeYear).features.map((feature) => {
      const { postcode, borough, markerColour, popup } = feature.properties;
      const element = document.createElement("button");
      element.className = "postcode-map-marker";
      element.type = "button";
      element.title = `${postcode} | ${borough}`;
      element.setAttribute("aria-label", element.title);
      element.style.setProperty("--marker-colour", markerColour);
      element.innerHTML = `<span class="postcode-map-dot"></span>` +
        `<span class="postcode-map-label">${escapeHTML(postcode)}</span>`;

      const mapMarker = new maplibregl.Marker({ element, anchor: "center" })
        .setLngLat(feature.geometry.coordinates)
        .setPopup(new maplibregl.Popup({ offset: 15, closeButton: true }).setHTML(popup))
        .addTo(map);
      return mapMarker;
    });
  };

  const renderYear = (year) => {
    activeYear = year;
    const groups = groupsForYear(year);

    const boroughCount = new Set(groups.map(({ borough }) => borough)).size;
    if (mapSummary) {
      mapSummary.textContent = `${groups.length} verified postcodes | ${boroughCount} local authority areas | ${projectYears[year].length} project records`;
    }
    document.querySelectorAll("[data-map-year]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mapYear === year);
    });
    renderMarkers();
  };

  const showAll = () => {
    const groups = groupsForYear(activeYear);
    if (!groups.length) return;
    if (groups.length === 1) {
      map.easeTo({ center: groups[0].coords, zoom: 11, duration: 700 });
      return;
    }
    const bounds = new maplibregl.LngLatBounds();
    groups.forEach(({ coords }) => bounds.extend(coords));
    map.fitBounds(bounds, { padding: 60, maxZoom: 8.2, duration: 700 });
  };

  map.on("load", async () => {
    try {
      if (mapSummary) mapSummary.textContent = "Validating project postcodes...";
      await loadPostcodeLocations();
      renderYear(activeYear);
      showAll();
    } catch (error) {
      console.error(error);
      if (mapSummary) mapSummary.textContent = "Project locations are temporarily unavailable.";
    }
  });
  map.on("zoomend", renderMarkers);

  document.querySelectorAll("[data-map-year]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!postcodeLocations.size) return;
      renderYear(button.dataset.mapYear);
      showAll();
    });
  });

  document.querySelectorAll("[data-map-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.mapAction;
      if (action === "in") map.zoomIn({ duration: 350 });
      if (action === "out") map.zoomOut({ duration: 350 });
      if (action === "all") showAll();
    });
  });
})();
