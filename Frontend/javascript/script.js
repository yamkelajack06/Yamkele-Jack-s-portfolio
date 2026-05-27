(function () {
  const html = document.documentElement;
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animFrame;
  let W, H;
  const PARTICLE_COUNT = 80;
  const MAX_DIST = 130;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }
  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      vx: randomBetween(-0.25, 0.25),
      vy: randomBetween(-0.25, 0.25),
      r: randomBetween(1, 2),
    };
  }
  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function getParticleColor() {
    return html.getAttribute("data-theme") === "light"
      ? "rgba(8,8,8," // Near-black for light mode (blends nicely)
      : "rgba(245,166,35,"; // Bright orange for dark mode
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    const base = getParticleColor();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = base + "0.6)";
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = base + alpha + ")";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    animFrame = requestAnimationFrame(drawParticles);
  }
  resize();
  initParticles();
  drawParticles();
  window.addEventListener("resize", () => {
    resize();
    initParticles();
  });

  const navbar = document.getElementById("navbar");
  const scrollIndicator = document.getElementById("scroll-indicator");
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-links a, .mobile-menu a");

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 60) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
      if (window.scrollY > 200 && scrollIndicator) {
        scrollIndicator.style.opacity = "0";
      }
      let current = "";
      sections.forEach((section) => {
        if (section.id === "project-view") return;
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 250) {
          current = section.getAttribute("id");
        }
      });
      navItems.forEach((a) => {
        a.classList.remove("active");
        if (a.getAttribute("href") === `#${current}`) {
          a.classList.add("active");
        }
      });
    },
    { passive: true },
  );

  const savedTheme = localStorage.getItem("yj-theme") || "dark";
  html.setAttribute("data-theme", savedTheme);
  const themeBtn = document.getElementById("theme-toggle");
  themeBtn.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("yj-theme", next);
  });
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
    });
  });
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const siblings = el.parentElement.querySelectorAll(".reveal");
          let delay = 0;
          siblings.forEach((sib, i) => {
            if (sib === el) delay = i * 80;
          });
          setTimeout(() => {
            el.classList.add("visible");
          }, delay);
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
  );
  revealEls.forEach((el) => revealObserver.observe(el));
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateZ(6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)";
      card.style.transition = "transform 0.5s cubic-bezier(0.2, 0.8, 0.3, 1)";
    });
    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.1s linear";
    });
  });

  const mainView = document.getElementById("main-view");
  const projectView = document.getElementById("project-view");

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      if (projectView.style.display === "block") {
        projectView.style.display = "none";
        mainView.style.display = "block";
      }
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
      );
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  const typewriterEl = document.getElementById("typewriter-dynamic");
  const typewriterPhrases = [
    "a Computer Science student.",
    "a Full stack developer.",
    "into AI automation.",
    "always building something.",
  ];
  let twPhrase = 0;
  let twChar = 0;
  let twDeleting = false;
  function typewriterTick() {
    const current = typewriterPhrases[twPhrase];
    if (!twDeleting) {
      twChar++;
      typewriterEl.textContent = current.slice(0, twChar);
      if (twChar === current.length) {
        twDeleting = true;
        setTimeout(typewriterTick, 1800);
        return;
      }
      setTimeout(typewriterTick, 65);
    } else {
      twChar--;
      typewriterEl.textContent = current.slice(0, twChar);
      if (twChar === 0) {
        twDeleting = false;
        twPhrase = (twPhrase + 1) % typewriterPhrases.length;
        setTimeout(typewriterTick, 400);
        return;
      }
      setTimeout(typewriterTick, 35);
    }
  }
  setTimeout(() => {
    typewriterTick();
  }, 1800);
  const formSubmitBtn = document.querySelector(".form-submit");
  const formFeedback = document.getElementById("form-feedback");
  if (formSubmitBtn && formFeedback) {
    formSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      formFeedback.textContent = "Thanks, sent!";
      formFeedback.classList.add("show");
    });
  }
  const PROJECT_DATA = {
    studyflow: {
      title: "Study Flow",
      tag: "Solo · 2025",
      subtitle: "AI-powered student timetable SPA",
      stack: [
        "React 18",
        "Vite",
        "React Router v6",
        "Firebase Auth",
        "Cloud Firestore",
        "Gemini 2.5 Flash Lite",
        "html2canvas",
        "jsPDF",
        "Lucide React",
      ],
      why: `I was frustrated planning my schedule on paper. Most decent calendar apps lock the good stuff behind a subscription and as a student that felt backwards. So I built my own. Study Flow started as a "let me just solve my own problem" project, but it became the most technically challenging thing I've shipped. It features real-time conflict detection, a full auth and cloud sync layer, AI integration with context awareness, and a PDF export engine. Every feature had to earn its place.`,
      what: "A smart single-page application that lets students build and manage their weekly timetable. You can do it manually through a clean UI or by describing your week to an AI assistant in plain English. It works offline without an account and syncs to the cloud the moment you sign in.",
      features: [
        "Three timetable views: Weekly grid (Mon to Sun, 6 AM to 11 PM), Daily breakdown with free-time indicators, and Monthly calendar with click-through to daily detail",
        "One-time and recurring entries (weekly, biweekly, monthly) for lectures, labs, study blocks, and deadlines",
        "Smart conflict detection where the app blocks overlapping entries at the UI level and the AI validates against your schedule before adding anything",
        "Colour-coded categories (Lecture, Study, Assignment, Exam, Lab, Other) with a custom colour picker per entry",
        'AI Assistant powered by Gemini 2.5 Flash Lite featuring natural language commands like "Add Physics every Monday at 10am" or "Clear my Friday afternoons", bulk scheduling, schedule queries, and proactive advice on how to space study blocks',
        "AI is rate-limited at 50 req/hr and 150/day to keep the service stable",
        "Local-first persistence providing full functionality without an account via localStorage, along with automatic migration to Firestore on first Google Sign-In",
        "Strategy pattern persistence layer that switches between localStorage and Firestore transparently based on auth state",
        "PDF export for a print-optimised weekly timetable with configurable start and end times to trim to your active hours",
      ],
      rules: [
        "Conflict detection runs both in the UI and inside the AI before any entry is written",
        "AI currently supports adding and deleting entries. Editing is done via the UI edit button",
        "Cloud sync only activates on Google Sign-In and data migrates automatically from local storage",
        "All environment variables must carry the VITE_ prefix or Firebase and Gemini fail silently in production",
      ],
      demo: "https://streamable.com/i3o10v",
      links: [
        {
          label: "Live ↗",
          href: "https://study-flow-beta.vercel.app/",
          primary: true,
        },
        {
          label: "GitHub ↗",
          href: "https://github.com/yamkelajack06/Study-Flow",
          primary: false,
        },
      ],
      future: [],
    },
    mojamarket: {
      title: "Moja Market",
      tag: "Team · 2026",
      subtitle: "Campus peer-to-peer marketplace",
      stack: [
        "PHP 8.2",
        "Apache",
        "PostgreSQL",
        "Docker",
        "Cloudinary",
        "Render",
        "Java",
        "Android SDK",
        "OkHttp",
        "Material Design",
        "ViewPager2",
        "RecyclerView",
      ],
      why: `This was a university group project for Database Fundamentals and Mobile Computing. I designed and built the entire backend including the PHP REST API, the PostgreSQL schema, and the Docker deployment pipeline. It was the first time I shipped a live production API serving a real Android app. The architecture decisions like parameterised queries on every endpoint, a dual-mode Cloudinary upload pipeline, and normalised schema across five tables were all deliberate choices I made to understand what "production-ready" actually means at the data layer.`,
      what: "A peer-to-peer marketplace Android app built for university students to buy, sell, and post item requests within their campus community. I built the full backend and the team built the Android client consuming it.",
      features: [
        "Secure registration and login with bcrypt password hashing where plaintext passwords are never stored or returned",
        "Full CRUD for marketplace listings allowing multiple images per listing stored as relational records, complete with stock quantity, condition, location, and live status (Available or Sold Out)",
        "Want Requests feed where buyers post item requests with budget and status (Looking or Fulfilled)",
        "Ratings system with 1 to 5 star ratings showing average and total count exposed per listing. Duplicate ratings are prevented at database level",
        "Dual-mode image upload where in production images go directly to Cloudinary via cURL returning permanent hosted URLs to keep server storage clean",
        "Fully normalised PostgreSQL schema across users, items, images, want requests, and ratings tables",
        "15+ REST endpoints across auth, posts, users, images, and ratings with consistent JSON response formatting throughout",
        "Android app features: branded splash + multi-slide onboarding, home feed with real-time search, swipeable image detail view, tabbed post screen, profile dashboard, and light/dark theme toggle",
        "Dockerised with PHP 8.2 and Apache, mod_rewrite enabled, deployed live on Render",
      ],
      rules: [
        "Parameterised queries used on every single endpoint so SQL injection is structurally impossible",
        "All credentials managed via .env and kept out of version control",
        "Duplicate ratings prevented at the database level, not just the application layer",
        "Production images are Cloudinary-hosted so there are no binary blobs on the server",
      ],
      demo: "https://streamable.com/5hmdw6",
      links: [
        {
          label: "Backend ↗",
          href: "https://github.com/yamkelajack06/Moja-Market-Backend",
          primary: false,
        },
        {
          label: "Android ↗",
          href: "https://github.com/SamkeloSam7/Moja-Market",
          primary: false,
        },
      ],
      future: [],
    },
    mails: {
      title: "Mails",
      tag: "SaaS · In Development",
      subtitle: "AI Gmail automation tool",
      stack: [
        "Gmail API",
        "Gemini AI",
        "OAuth 2.0",
        "PostgreSQL",
        "Typescript",
        "React",
        "CSS",
      ],
      why: `I want to understand AI product architecture end to end, not just calling an API but designing the full loop: fetch, classify, act, review, digest. Mails is where I'm learning to build a system that runs autonomously without losing user trust. The confidence threshold, the dry-run mode, the rule override system aren't just features. They're the design decisions that make the difference between a tool people trust and one they uninstall. I'm also reusing the CineLog auth flow here to reinforce custom authentication as a repeatable pattern I own.`,
      what: "A personal Gmail automation tool that classifies, cleans, and prioritises inbox activity using Gemini AI. The backend runs silently to fetch, classify, and action emails while a dashboard gives you full visibility and control over what the AI is doing and why.",
      features: [
        "Gmail OAuth 2.0 connection featuring a custom auth flow, not limited to Google-only accounts",
        "AI classification into Finance, Promotions, Social, University, and custom user-defined categories where each result includes a confidence score",
        "Automatic Gmail label creation and application based on classification output",
        "Low-confidence results (below 0.7) are flagged in a manual review queue and never auto-actioned",
        "Cleaning automation where promotions older than 7 days and newsletters older than 14 days are archived automatically at high confidence",
        "Dry-run mode letting you preview every proposed action before it executes",
        "Daily AI-generated digest of high-priority emails delivered directly to your Gmail inbox",
        "Dashboard: inbox stats, category breakdowns, searchable classification history, rule manager for sender/keyword overrides, digest history, and flagged email review queue",
        "User-defined rules override AI classification results entirely",
      ],
      rules: [
        "Confidence below 0.7 triggers a flag for manual review and is never auto-actioned",
        "No emails permanently deleted in v1",
        "User rules always override AI output",
        "Daily digest runs once per day at a user-configurable time",
        "Only verified accounts can access the dashboard",
      ],
      links: [],
      future: [
        { title: "Advanced cleaning", desc: "Trash functionality in v2" },
        { title: "Multi-account", desc: "Multiple Gmail account support" },
        {
          title: "Push notifications",
          desc: "Alerts for high-priority emails",
        },
        {
          title: "ML fine-tuning",
          desc: "Personalised category models over time",
        },
      ],
    },
    cinelog: {
      title: "CineLog",
      tag: "App · In Development",
      subtitle: "Personal movie & TV show tracker",
      stack: ["REST API", "TMDB API", "Custom Auth", "SQLite"],
      why: `I watch a lot of content and I've lost count of how many times I've started something I've already seen, or forgotten a film I actually wanted to watch. Letterboxd exists but I want to build my own. Not to reinvent the wheel, but to go deep on the architecture decisions that a real content tracking product requires. CineLog is where I'm reinforcing custom authentication as a reusable pattern, working with a real third-party data API (TMDB), and thinking carefully about data integrity rules like what a user can rate, when, and how you enforce one entry per item per user cleanly at the data layer.`,
      what: "A personal movie and TV show tracking web app where you search TMDB for content, build a private watchlist, log watches with a date, leave a rating and review, and see stats about your viewing habits over time.",
      features: [
        "Custom auth letting you register with username, email, and password. All protected routes require login",
        "TMDB-powered search where title search returns poster, release year, and overview",
        "Full movie detail page to view TMDB data and add directly to your watchlist",
        'Watchlist management letting you add items with default "want to watch" status, filter by status, and remove items',
        "Watch logging to mark as watched, auto-record the date, add a 1 to 10 rating, and an optional review",
        "Edit and update ratings and reviews at any time after logging",
        "Stats dashboard displaying total watched count, average rating, most watched genre, and recent watch history",
        "Frequently accessed TMDB data is cached locally to reduce API calls",
      ],
      rules: [
        "One entry per movie per user with no duplicates allowed",
        "Only watched items can be rated",
        "Rating is required (1 to 10) when logging a watch, but review is optional",
        "Users can only read and write their own data",
        "Passwords are hashed and auth is required on all protected routes",
        "TMDB data cached locally for frequently accessed content",
      ],
      links: [],
      future: [
        { title: "Social", desc: "Public profiles, follows, activity feed" },
        { title: "Recommendations", desc: '"Because you liked X…" logic + ML' },
        { title: "Custom Lists", desc: "Public/private curated lists" },
        {
          title: "Advanced Stats",
          desc: "Total watch time, streaks, rating distribution",
        },
        {
          title: "Notifications",
          desc: "Release alerts and interaction notifications",
        },
        {
          title: "Review Discovery",
          desc: "Like reviews, trending and popular reviews",
        },
      ],
    },
    sage: {
      title: "SAGE E-Commerce",
      tag: "Solo · 2025",
      subtitle: "The Odin Project — React fundamentals",
      stack: [
        "React",
        "React Router DOM",
        "FakeStore API",
        "localStorage API",
        "Vanilla CSS",
        "React Testing Library",
      ],
      why: `This was a structured learning project from The Odin Project curriculum. I'd been writing JavaScript and building static sites, but I hadn't yet confronted the core React mental model of thinking in components, lifting state, and managing side effects properly. SAGE was where I worked through those fundamentals deliberately, not just making it work but understanding why the patterns exist. The focus wasn't the store. It was proving to myself that I understood the building blocks before moving on to more complex projects.`,
      what: "A multi-page React SPA shopping experience built using the FakeStore API. The project covers the core React fundamentals like component architecture, routing, state management with hooks, side effects with useEffect, props handling, and basic testing.",
      features: [
        "Home page, Shop page, Cart page, and a simulated Checkout page",
        "Products fetched dynamically from the FakeStore API via useEffect",
        "Real-time cart item count in the navigation bar across all pages",
        "Product quantity controls to increment, decrement, and accept direct input",
        "Cart persistence across sessions via the localStorage API",
        "Clean, responsive layout with vanilla CSS",
        "Basic component testing with React Testing Library",
      ],
      rules: [],
      links: [
        {
          label: "Live ↗",
          href: "https://sage-e-commerce-rho.vercel.app/",
          primary: true,
        },
        {
          label: "GitHub ↗",
          href: "https://github.com/yamkelajack06/SAGE-E-Commerce-",
          primary: false,
        },
      ],
      future: [],
    },
  };

  function buildProjectHTML(data) {
    const stackPills = data.stack
      .map((s) => `<span class="pill">${s}</span>`)
      .join("");
    const featureItems = data.features.map((f) => `<li>${f}</li>`).join("");
    const ruleItems = data.rules
      .map((r) => `<div class="detail-rule">${r}</div>`)
      .join("");
    const linkItems = data.links
      .map(
        (l) =>
          `<a href="${l.href}" target="_blank" rel="noopener" class="proj-link ${l.primary ? "proj-live" : "proj-gh"}">${l.label}</a>`,
      )
      .join("");
    const futureItems = data.future
      .map(
        (f) =>
          `<div class="detail-future-item"><strong>${f.title}</strong>${f.desc}</div>`,
      )
      .join("");

    const demoBlock = data.demo
      ? `
  <div class="detail-section">
    <div class="detail-section-title">Demo</div>
    <div class="detail-video-wrap">
      <video controls preload="metadata">
        <source src="${data.demo}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
`
      : "";
    return `
      <div class="detail-tag">${data.tag}</div>
      <h2 class="detail-title">${data.title}</h2>
      <p class="detail-subtitle">${data.subtitle}</p>
      <div class="detail-section">
        <div class="detail-section-title">Why I built it</div>
        <p style="font-size:0.95rem;color:var(--text-muted);line-height:1.8;">${data.why}</p>
      </div>
      <div class="detail-section">
        <div class="detail-section-title">What it does</div>
        <p style="font-size:0.95rem;color:var(--text-muted);line-height:1.8;">${data.what}</p>
      </div>
      <div class="detail-section">
        <div class="detail-section-title">Features</div>
        <ul class="detail-feature-list">${featureItems}</ul>
      </div>
      ${
        data.rules.length
          ? `
      <div class="detail-section">
        <div class="detail-section-title">Key constraints</div>
        <div class="detail-rules">${ruleItems}</div>
      </div>`
          : ""
      }
      <div class="detail-section">
        <div class="detail-section-title">Stack</div>
        <div class="detail-stack">${stackPills}</div>
      </div>
      ${
        data.future.length
          ? `
      <div class="detail-section">
        <div class="detail-section-title">What's next</div>
        <div class="detail-future">${futureItems}</div>
      </div>`
          : ""
      }
      ${demoBlock}
      ${data.links.length ? `<div class="detail-links">${linkItems}</div>` : ""}
    `;
  }

  const projectContent = document.getElementById("project-content");
  const backBtn = document.getElementById("back-btn");
  let lastScrollY = 0;

  function openProject(projectKey) {
    const data = PROJECT_DATA[projectKey];
    if (!data) return;
    lastScrollY = window.scrollY;
    projectContent.innerHTML = buildProjectHTML(data);
    mainView.style.display = "none";
    projectView.style.display = "block";
    window.scrollTo(0, 0);
  }

  backBtn.addEventListener("click", () => {
    const video = projectContent.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    projectView.style.display = "none";
    mainView.style.display = "block";
    window.scrollTo(0, lastScrollY);
  });

  document.querySelectorAll(".project-card[data-project]").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      openProject(card.dataset.project);
    });
  });
})();
