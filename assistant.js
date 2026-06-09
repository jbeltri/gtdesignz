(() => {
  "use strict";

  const config = {
    intakeEndpoint: "",
    enquiryEmail: "enquiries@gtdesignzltd.com",
    phone: "+44 20 8212 7981",
    ...(window.GT_ASSISTANT_CONFIG || {})
  };

  const sources = {
    arb: "https://arb.org.uk/architect-information/architects-code-standards-of-conduct-and-practice/",
    riba: "https://www.riba.org/work/insights-and-resources/riba-plan-of-work/",
    planning: "https://www.gov.uk/planning-permission-england-wales",
    lpa: "https://www.planningportal.co.uk/find-your-local-planning-authority/",
    partyWall: "https://www.gov.uk/party-walls-building-works",
    partyWallBooklet: "https://www.gov.uk/government/publications/preventing-and-resolving-disputes-in-relation-to-party-walls/the-party-wall-etc-act-1996-explanatory-booklet",
    thamesWater: "https://www.thameswater.co.uk/help/home-improvements/do-i-need-a-build-agreement",
    severnTrent: "https://www.stwater.co.uk/building-and-developing/overview/"
  };

  const widget = document.createElement("div");
  widget.className = "gt-assistant";
  widget.innerHTML = `
    <button class="gt-assistant-launcher" type="button" aria-expanded="false" aria-controls="gt-assistant-panel">
      <span class="gt-assistant-launcher-icon" aria-hidden="true"><i data-lucide="message-square-text"></i></span>
      <span class="gt-assistant-launcher-copy"><strong>Ask GT</strong><small><span></span> Project guidance</small></span>
    </button>
    <section class="gt-assistant-panel" id="gt-assistant-panel" aria-label="GT Designz project assistant" hidden>
      <header class="gt-assistant-header">
        <div class="gt-assistant-identity">
          <span class="gt-assistant-mark" aria-hidden="true">GT</span>
          <span><strong>Project assistant</strong><small>Built-environment guidance</small></span>
        </div>
        <button class="gt-assistant-close" type="button" aria-label="Close assistant"><i data-lucide="x"></i></button>
      </header>
      <div class="gt-assistant-scope">
        General information only. Complex, disputed or site-specific matters are reviewed by a human agent.
      </div>
      <div class="gt-assistant-messages" role="log" aria-live="polite" aria-relevant="additions"></div>
      <div class="gt-assistant-quick" aria-label="Suggested questions"></div>
      <form class="gt-assistant-form">
        <label class="sr-only" for="gt-assistant-input">Your message</label>
        <textarea id="gt-assistant-input" rows="1" maxlength="1200" placeholder="Ask about your project..."></textarea>
        <button type="submit" aria-label="Send message"><i data-lucide="arrow-up"></i></button>
      </form>
      <p class="gt-assistant-privacy">Do not include payment information. Contact details are used only to respond to your enquiry.</p>
    </section>
  `;
  document.body.append(widget);

  const launcher = widget.querySelector(".gt-assistant-launcher");
  const panel = widget.querySelector(".gt-assistant-panel");
  const closeButton = widget.querySelector(".gt-assistant-close");
  const messages = widget.querySelector(".gt-assistant-messages");
  const quick = widget.querySelector(".gt-assistant-quick");
  const form = widget.querySelector(".gt-assistant-form");
  const input = widget.querySelector("#gt-assistant-input");

  let hasOpened = false;
  let intake = null;

  const initialActions = [
    ["Start a project brief", "start"],
    ["RIBA stages", "riba"],
    ["Planning and history", "planning"],
    ["Build over a sewer", "sewer"],
    ["Party Wall", "party-wall"],
    ["Budget orientation", "budget"],
    ["Dispute or callback", "dispute"]
  ];

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const sourceLink = (label, href) =>
    `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}<i data-lucide="external-link"></i></a>`;

  const refreshIcons = () => window.lucide?.createIcons();

  const addMessage = (role, content, options = {}) => {
    const article = document.createElement("article");
    article.className = `gt-assistant-message is-${role}`;
    article.innerHTML = options.html ? content : `<p>${escapeHtml(content)}</p>`;
    messages.append(article);
    messages.scrollTop = messages.scrollHeight;
    refreshIcons();
  };

  const showQuickReplies = (items = initialActions) => {
    quick.replaceChildren();
    items.forEach(([label, action]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.dataset.action = action;
      quick.append(button);
    });
  };

  const openAssistant = () => {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    widget.classList.add("is-open");
    if (!hasOpened) {
      hasOpened = true;
      addMessage(
        "assistant",
        `<p>Hello. I can help you shape a project brief, understand the RIBA stages, and find the right route for planning, building over sewers, Party Wall matters and early budget review.</p>
        <p>What would you like help with?</p>`,
        { html: true }
      );
      showQuickReplies();
    }
    window.setTimeout(() => input.focus(), 120);
  };

  const closeAssistant = () => {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    widget.classList.remove("is-open");
    launcher.focus();
  };

  const resetChat = () => {
    intake = null;
    input.placeholder = "Ask about your project...";
    addMessage("assistant", "No problem. What project topic can I help with?");
    showQuickReplies();
  };

  const getStandardSteps = () => [
    {
      key: "name",
      prompt: "What is your full name?",
      validate: (value) => value.trim().length >= 2 || "Please enter your name."
    },
    {
      key: "email",
      prompt: "What email address should the team use?",
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email address."
    },
    {
      key: "phone",
      prompt: "What phone number should the team use if a call is helpful?",
      validate: (value) => value.replace(/\D/g, "").length >= 7 || "Please enter a valid phone number."
    },
    {
      key: "address",
      prompt: "What is the project address or postcode?",
      validate: (value) => value.trim().length >= 4 || "Please add the address or postcode."
    },
    {
      key: "projectType",
      prompt: "What type of project is this?",
      replies: [
        ["Residential extension", "Residential extension or alteration"],
        ["New home / outbuilding", "New home or outbuilding"],
        ["Commercial / mixed-use", "Commercial or mixed-use"],
        ["Planning application", "Planning application"],
        ["Building Regulations", "Building Regulations"],
        ["Dispute / complaint", "Dispute or complaint"]
      ],
      validate: (value) => value.trim().length >= 3 || "Please describe the project type."
    },
    {
      key: "brief",
      prompt: "Please describe the proposed work, the current situation and the outcome you need.",
      validate: (value) => value.trim().length >= 12 || "Please add a little more detail so the team can review it."
    },
    {
      key: "budget",
      prompt: "What budget band are you considering? You can also type 'not sure'.",
      replies: [
        ["Under GBP 50k", "Under GBP 50,000"],
        ["GBP 50k-100k", "GBP 50,000-100,000"],
        ["GBP 100k-250k", "GBP 100,000-250,000"],
        ["Over GBP 250k", "Over GBP 250,000"],
        ["Not sure", "Not stated"]
      ],
      validate: () => true
    },
    {
      key: "timescale",
      prompt: "Is there a target date or urgency the team should know about? You can type 'not sure'.",
      validate: () => true
    },
    {
      key: "consent",
      prompt: "May GT Designz use these details to respond to this enquiry? Please answer yes or no.",
      replies: [["Yes, I agree", "yes"], ["No", "no"]],
      validate: (value) => /^(yes|y|agree|i agree)$/i.test(value.trim()) || (/^no$/i.test(value.trim()) ? "declined" : "Please answer yes or no.")
    }
  ];

  const getEscalationSteps = () => [
    {
      key: "phone",
      prompt: "A verified GT Designz agent will review this. What phone number should they use to call you back?",
      validate: (value) => value.replace(/\D/g, "").length >= 7 || "Please enter a valid phone number."
    },
    {
      key: "name",
      prompt: "Thank you. What is your full name?",
      validate: (value) => value.trim().length >= 2 || "Please enter your name."
    },
    {
      key: "email",
      prompt: "What email address can the team use for written follow-up?",
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email address."
    },
    {
      key: "address",
      prompt: "What property address or postcode does this relate to?",
      validate: (value) => value.trim().length >= 4 || "Please add the property address or postcode."
    },
    {
      key: "brief",
      prompt: "Please summarise the issue, the people involved, important dates and the outcome you are seeking. Do not include confidential legal advice.",
      validate: (value) => value.trim().length >= 12 || "Please add enough detail for the agent to understand the issue."
    },
    {
      key: "consent",
      prompt: "May GT Designz use these details to contact you about this matter? Please answer yes or no.",
      replies: [["Yes, I agree", "yes"], ["No", "no"]],
      validate: (value) => /^(yes|y|agree|i agree)$/i.test(value.trim()) || (/^no$/i.test(value.trim()) ? "declined" : "Please answer yes or no.")
    }
  ];

  const askIntakeStep = () => {
    const step = intake.steps[intake.index];
    addMessage("assistant", `${step.prompt} You can type "cancel" at any time.`);
    showQuickReplies(step.replies || []);
    input.placeholder = step.key === "brief" ? "Add project details..." : "Type your answer...";
  };

  const beginIntake = (type = "project", flags = {}) => {
    intake = {
      type,
      flags,
      index: 0,
      data: type === "dispute" ? { projectType: "Dispute or complaint" } : {},
      steps: type === "dispute" ? getEscalationSteps() : getStandardSteps()
    };
    quick.replaceChildren();
    addMessage(
      "assistant",
      type === "dispute"
        ? "I can record the facts and arrange human follow-up. I cannot determine liability, adjudicate a dispute or replace a solicitor or appointed surveyor."
        : "I will collect a concise brief for the GT Designz team."
    );
    askIntakeStep();
  };

  const makeConversationId = () => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `gt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const saveUnsentEnquiry = (payload) => {
    try {
      const key = "gt-assistant-unsent-enquiries";
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      saved.push(payload);
      localStorage.setItem(key, JSON.stringify(saved.slice(-5)));
    } catch {
      // Local storage may be disabled. The email fallback still remains available.
    }
  };

  const buildEmailUrl = (payload) => {
    const subject = encodeURIComponent(`Website assistant enquiry: ${payload.projectType}`);
    const lines = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Property: ${payload.address}`,
      `Project type: ${payload.projectType}`,
      `Budget: ${payload.budget || "Not stated"}`,
      `Timescale: ${payload.timescale || "Not stated"}`,
      "",
      "Brief:",
      payload.brief,
      "",
      `Dispute escalation: ${payload.flags.dispute ? "Yes" : "No"}`,
      `Planning history requested: ${payload.flags.planningHistory ? "Yes" : "No"}`,
      `Build over query: ${payload.flags.buildOver ? "Yes" : "No"}`,
      `Party Wall query: ${payload.flags.partyWall ? "Yes" : "No"}`,
      `Reference: ${payload.conversationId}`
    ];
    return `mailto:${config.enquiryEmail}?subject=${subject}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  const submitIntake = async (payload) => {
    if (!config.intakeEndpoint) return { ok: false, reason: "not-configured" };

    try {
      const response = await fetch(config.intakeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      return { ok: true };
    } catch {
      return { ok: false, reason: "request-failed" };
    }
  };

  const finishIntake = async () => {
    const payload = {
      conversationId: makeConversationId(),
      submittedAt: new Date().toISOString(),
      source: "Website assistant",
      name: intake.data.name || "",
      email: intake.data.email || "",
      phone: intake.data.phone || "",
      address: intake.data.address || "",
      projectType: intake.data.projectType || "Other built-environment enquiry",
      brief: intake.data.brief || "",
      budget: intake.data.budget || "Not stated",
      timescale: intake.data.timescale || "Not stated",
      likelyRibaStage: "To be reviewed",
      consent: true,
      flags: {
        planningHistory: Boolean(intake.flags.planningHistory),
        buildOver: Boolean(intake.flags.buildOver),
        partyWall: Boolean(intake.flags.partyWall),
        dispute: intake.type === "dispute" || Boolean(intake.flags.dispute)
      },
      pageUrl: window.location.href
    };

    const wasDispute = payload.flags.dispute;
    intake = null;
    input.placeholder = "Ask about your project...";
    quick.replaceChildren();
    addMessage("assistant", "Thank you. I am preparing your enquiry record...");

    const result = await submitIntake(payload);
    if (result.ok) {
      addMessage(
        "assistant",
        `<p>Your enquiry has been recorded. ${wasDispute ? "A verified GT Designz agent will review it and call you back." : "The team will review the brief and contact you."}</p>
        <p class="gt-assistant-reference">Reference: ${escapeHtml(payload.conversationId)}</p>`,
        { html: true }
      );
    } else {
      saveUnsentEnquiry(payload);
      const emailUrl = buildEmailUrl(payload);
      addMessage(
        "assistant",
        `<p>Your brief is ready. To deliver it now, send the prepared email below. ${wasDispute ? "A verified agent can then arrange the callback." : ""}</p>
        <div class="gt-assistant-links">
          <a class="is-primary" href="${emailUrl}">Email this brief<i data-lucide="send"></i></a>
          <a href="tel:${config.phone.replace(/[^\d+]/g, "")}">Call GT Designz<i data-lucide="phone"></i></a>
        </div>
        <p class="gt-assistant-reference">Reference: ${escapeHtml(payload.conversationId)}</p>`,
        { html: true }
      );
    }
    showQuickReplies([["Ask another question", "reset"], ["Start another brief", "start"]]);
  };

  const handleIntakeAnswer = async (rawValue) => {
    const value = rawValue.trim();
    if (/^cancel$/i.test(value)) {
      resetChat();
      return;
    }

    const step = intake.steps[intake.index];
    const validation = step.validate(value);
    if (validation !== true) {
      if (validation === "declined") {
        intake = null;
        addMessage("assistant", "Understood. I have not submitted or saved your details. I can still provide general project guidance.");
        showQuickReplies();
        input.placeholder = "Ask about your project...";
        return;
      }
      addMessage("assistant", validation);
      return;
    }

    intake.data[step.key] = value;
    intake.index += 1;
    if (intake.index >= intake.steps.length) {
      await finishIntake();
      return;
    }
    askIntakeStep();
  };

  const showRiba = () => {
    addMessage(
      "assistant",
      `<p>The RIBA Plan of Work is a project framework, not a substitute for a written appointment. Its eight stages are:</p>
      <ol>
        <li><strong>0</strong> Strategic Definition</li>
        <li><strong>1</strong> Preparation and Briefing</li>
        <li><strong>2</strong> Concept Design</li>
        <li><strong>3</strong> Spatial Coordination</li>
        <li><strong>4</strong> Technical Design</li>
        <li><strong>5</strong> Manufacturing and Construction</li>
        <li><strong>6</strong> Handover</li>
        <li><strong>7</strong> Use</li>
      </ol>
      <p>Planning is commonly prepared through Stage 3, while Building Regulations information is normally developed at Stage 4. The exact route depends on scope and procurement.</p>
      <div class="gt-assistant-links">${sourceLink("Official RIBA Plan of Work", sources.riba)}</div>`,
      { html: true }
    );
    showQuickReplies([["Start a project brief", "start"], ["ARB standards", "arb"], ["Budget orientation", "budget"]]);
  };

  const showArb = () => {
    addMessage(
      "assistant",
      `<p>The current ARB Architects Code is organised around six standards: honesty and integrity, public interest, competence, professional practice, communication and collaboration, and respect.</p>
      <p>The Code applies to people registered as architects. This assistant does not claim that status for any person and will refer professional judgement, conflicts, complaints and competence questions to an appropriately qualified human.</p>
      <div class="gt-assistant-links">${sourceLink("ARB Architects Code", sources.arb)}</div>`,
      { html: true }
    );
    showQuickReplies([["RIBA stages", "riba"], ["Dispute or callback", "dispute"], ["Start a brief", "start"]]);
  };

  const showPlanning = () => {
    addMessage(
      "assistant",
      `<p>Planning rules are site- and proposal-specific. For projects in England, the first checks normally include the local planning authority, planning history, permitted development constraints, designations, local policy and any enforcement or condition history.</p>
      <p>Planning history is usually held on the relevant council's public register. Share the full address or postcode and GT Designz can identify the authority and review the available records. A history search does not guarantee that a new proposal will be approved.</p>
      <div class="gt-assistant-links">
        ${sourceLink("GOV.UK planning guidance", sources.planning)}
        ${sourceLink("Find the local planning authority", sources.lpa)}
      </div>`,
      { html: true }
    );
    showQuickReplies([["Request a history review", "planning-intake"], ["Start a project brief", "start"], ["Party Wall", "party-wall"]]);
  };

  const showSewer = () => {
    addMessage(
      "assistant",
      `<p>A build-over check starts with the property address, sewerage undertaker, drainage records and the proposed foundations. Requirements vary by undertaker and asset.</p>
      <p>For example, Thames Water says an application is likely when work is within 3 metres of a public sewer or 1 metre of a public lateral drain. Planning permission does not itself grant permission to build over a sewer. Do not start work until the relevant approvals are confirmed.</p>
      <div class="gt-assistant-links">
        ${sourceLink("Thames Water build-over guidance", sources.thamesWater)}
        ${sourceLink("Severn Trent building and developing", sources.severnTrent)}
      </div>`,
      { html: true }
    );
    showQuickReplies([["Request a build-over review", "sewer-intake"], ["Start a project brief", "start"], ["Planning and history", "planning"]]);
  };

  const showPartyWall = () => {
    addMessage(
      "assistant",
      `<p>The Party Wall etc. Act 1996 applies in England and Wales and is separate from planning permission and Building Regulations.</p>
      <p>It may apply to work on a party wall or structure, a new wall at the boundary, or certain excavations near a neighbouring building. Notices, timing and dispute procedures depend on the work. This assistant can flag the issue and collect facts, but cannot serve as the appointed surveyor or determine a dispute.</p>
      <div class="gt-assistant-links">
        ${sourceLink("GOV.UK Party Wall overview", sources.partyWall)}
        ${sourceLink("Official explanatory booklet", sources.partyWallBooklet)}
      </div>`,
      { html: true }
    );
    showQuickReplies([["Request a Party Wall review", "party-intake"], ["Dispute or callback", "dispute"], ["Start a project brief", "start"]]);
  };

  const showBudget = () => {
    addMessage(
      "assistant",
      `<p>Early budget orientation should include more than the build contract. A useful first review covers:</p>
      <ul>
        <li>floor area, location, specification and existing-building risk</li>
        <li>structure, drainage, access, services and abnormal site work</li>
        <li>consultant, survey, application and statutory fees</li>
        <li>VAT, inflation and a proportionate contingency</li>
      </ul>
      <p>At RIBA Stage 1 the project budget and brief are established; the cost plan is then tested as the design develops. Any figure given before scope and site constraints are reviewed is only an orientation, not a quotation.</p>`,
      { html: true }
    );
    showQuickReplies([["Share scope for review", "start"], ["RIBA stages", "riba"], ["Planning and history", "planning"]]);
  };

  const showBuildingRegulations = () => {
    addMessage(
      "assistant",
      `<p>Building Regulations approval is separate from planning permission. A technical package may need coordinated architectural, structural, fire, thermal, ventilation, drainage and accessibility information, depending on the project.</p>
      <p>This normally aligns most closely with RIBA Stage 4, but the compliance route should be considered earlier. Site-specific compliance advice must be reviewed by competent professionals and the relevant building control body.</p>`,
      { html: true }
    );
    showQuickReplies([["Start a technical brief", "start"], ["RIBA stages", "riba"], ["Build over a sewer", "sewer"]]);
  };

  const routeMessage = (rawValue) => {
    const value = rawValue.trim();
    if (!value) return;

    addMessage("user", value);
    input.value = "";
    input.style.height = "";

    if (intake) {
      handleIntakeAnswer(value);
      return;
    }

    const text = value.toLowerCase();
    if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(text)) {
      addMessage("assistant", "Hello. I can help with a project brief, RIBA stages, planning, build-over checks, Party Wall matters, budget orientation or a human callback.");
      showQuickReplies();
    } else if (/(start|project brief|new project|quote|contact details|enquiry)/.test(text)) {
      beginIntake();
    } else if (/(dispute|complaint|escalat|call me|callback|call back|neighbour problem|agent)/.test(text)) {
      beginIntake("dispute", { dispute: true });
    } else if (/(riba|stage 0|stage 1|stage 2|stage 3|stage 4|stage 5|stage 6|stage 7|plan of work)/.test(text)) {
      showRiba();
    } else if (/(arb|architects code|professional standard|professional conduct|registered architect)/.test(text)) {
      showArb();
    } else if (/(planning history|planning permission|planning application|permitted development|local planning|lpa|enforcement|appeal)/.test(text)) {
      showPlanning();
    } else if (/(sewer|build over|drain|water authority|water company|manhole|lateral drain)/.test(text)) {
      showSewer();
    } else if (/(party wall|boundary wall|party structure|adjoining owner|excavat.*neighbour)/.test(text)) {
      showPartyWall();
    } else if (/(budget|cost|price|fee|afford|estimate)/.test(text)) {
      showBudget();
    } else if (/(building regulation|building control|approved document|technical design)/.test(text)) {
      showBuildingRegulations();
    } else if (/(architecture|architectural|extension|loft|conversion|new build|outbuilding|commercial|residential|drawing|survey|structure|foundation)/.test(text)) {
      addMessage("assistant", "That sounds within the project scope. I can collect the address, proposal, budget and timescale for the team, or explain the likely RIBA stage.");
      showQuickReplies([["Start a project brief", "start"], ["RIBA stages", "riba"], ["Planning and history", "planning"]]);
    } else {
      addMessage("assistant", "I am sorry, I cannot help with that. I can only assist with GT Designz project enquiries, RIBA stages, ARB standards, UK built-environment approvals, planning, build-over checks, Party Wall matters, budget orientation and related escalations.");
      showQuickReplies();
    }
  };

  launcher.addEventListener("click", () => {
    if (panel.hidden) openAssistant();
    else closeAssistant();
  });
  closeButton.addEventListener("click", closeAssistant);

  quick.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    const label = button.textContent;

    if (intake && !["reset", "start"].includes(action)) {
      addMessage("user", label);
      handleIntakeAnswer(action);
      return;
    }

    addMessage("user", label);
    if (action === "start") beginIntake();
    else if (action === "dispute") beginIntake("dispute", { dispute: true });
    else if (action === "riba") showRiba();
    else if (action === "arb") showArb();
    else if (action === "planning") showPlanning();
    else if (action === "sewer") showSewer();
    else if (action === "party-wall") showPartyWall();
    else if (action === "budget") showBudget();
    else if (action === "planning-intake") beginIntake("project", { planningHistory: true });
    else if (action === "sewer-intake") beginIntake("project", { buildOver: true });
    else if (action === "party-intake") beginIntake("project", { partyWall: true });
    else if (action === "reset") resetChat();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    routeMessage(input.value);
  });

  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 112)}px`;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) closeAssistant();
  });

  refreshIcons();
})();
