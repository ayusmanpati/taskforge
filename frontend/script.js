// ── DATA ──
let CU = null,
  CPJ = null,
  CTK = null,
  EPJ = null,
  ENO = null,
  SEm = "📁",
  topFn = () => openCreateProject();
const EMOJIS = [
  "📁",
  "🚀",
  "💡",
  "🎯",
  "🔥",
  "⚡",
  "🌟",
  "🛠️",
  "📊",
  "🎨",
  "🧩",
  "🔐",
  "📱",
  "🌐",
  "🤖",
];
const NC_COLORS = ["#3b5bdb", "#1a7a4a", "#854d0e", "#991b1b", "#5c7a6e"];
const EP_DATA = [
  { m: "POST", p: "/api/v1/auth/register", d: "Register user", a: false },
  { m: "POST", p: "/api/v1/auth/login", d: "Login", a: false },
  { m: "POST", p: "/api/v1/auth/logout", d: "Logout", a: true },
  {
    m: "GET",
    p: "/api/v1/auth/current-user",
    d: "Current user",
    a: true,
  },
  {
    m: "POST",
    p: "/api/v1/auth/change-password",
    d: "Change password",
    a: true,
  },
  {
    m: "POST",
    p: "/api/v1/auth/refresh-token",
    d: "Refresh token",
    a: false,
  },
  {
    m: "GET",
    p: "/api/v1/auth/verify-email/:token",
    d: "Verify email",
    a: false,
  },
  {
    m: "POST",
    p: "/api/v1/auth/forgot-password",
    d: "Forgot password",
    a: false,
  },
  {
    m: "POST",
    p: "/api/v1/auth/reset-password/:token",
    d: "Reset password",
    a: false,
  },
  { m: "GET", p: "/api/v1/projects/", d: "List projects", a: true },
  { m: "POST", p: "/api/v1/projects/", d: "Create project", a: true },
  { m: "GET", p: "/api/v1/projects/:id", d: "Get project", a: true },
  { m: "PUT", p: "/api/v1/projects/:id", d: "Update project", a: true },
  {
    m: "DELETE",
    p: "/api/v1/projects/:id",
    d: "Delete project",
    a: true,
  },
  {
    m: "GET",
    p: "/api/v1/projects/:id/members",
    d: "List members",
    a: true,
  },
  {
    m: "POST",
    p: "/api/v1/projects/:id/members",
    d: "Add member (Admin)",
    a: true,
  },
  {
    m: "PUT",
    p: "/api/v1/projects/:id/members/:uid",
    d: "Update role",
    a: true,
  },
  {
    m: "DELETE",
    p: "/api/v1/projects/:id/members/:uid",
    d: "Remove member",
    a: true,
  },
  { m: "GET", p: "/api/v1/tasks/:pid", d: "List tasks", a: true },
  { m: "POST", p: "/api/v1/tasks/:pid", d: "Create task", a: true },
  { m: "GET", p: "/api/v1/tasks/:pid/t/:tid", d: "Get task", a: true },
  { m: "PUT", p: "/api/v1/tasks/:pid/t/:tid", d: "Update task", a: true },
  {
    m: "DELETE",
    p: "/api/v1/tasks/:pid/t/:tid",
    d: "Delete task",
    a: true,
  },
  {
    m: "POST",
    p: "/api/v1/tasks/:pid/t/:tid/subtasks",
    d: "Create subtask",
    a: true,
  },
  {
    m: "PUT",
    p: "/api/v1/tasks/:pid/st/:sid",
    d: "Update subtask",
    a: true,
  },
  {
    m: "DELETE",
    p: "/api/v1/tasks/:pid/st/:sid",
    d: "Delete subtask",
    a: true,
  },
  { m: "GET", p: "/api/v1/notes/:pid", d: "List notes", a: true },
  {
    m: "POST",
    p: "/api/v1/notes/:pid",
    d: "Create note (Admin)",
    a: true,
  },
  { m: "GET", p: "/api/v1/notes/:pid/n/:nid", d: "Get note", a: true },
  { m: "PUT", p: "/api/v1/notes/:pid/n/:nid", d: "Update note", a: true },
  {
    m: "DELETE",
    p: "/api/v1/notes/:pid/n/:nid",
    d: "Delete note (Admin)",
    a: true,
  },
  { m: "GET", p: "/api/v1/healthcheck/", d: "Health status", a: false },
];
let S = {
  projects: [
    {
      _id: "p1",
      name: "Website Redesign",
      description:
        "Complete overhaul of the company website with a modern design system and improved performance.",
      emoji: "🎨",
    },
    {
      _id: "p2",
      name: "Mobile App v2",
      description:
        "Building the next-generation mobile experience for iOS and Android platforms.",
      emoji: "📱",
    },
    {
      _id: "p3",
      name: "API Infrastructure",
      description:
        "Migrating legacy services to a microservices architecture with improved security.",
      emoji: "🔐",
    },
    {
      _id: "p4",
      name: "Data Analytics",
      description:
        "A unified analytics dashboard for real-time business insights and reporting.",
      emoji: "📊",
    },
  ],
  tasks: [
    {
      _id: "t1",
      projectId: "p1",
      title: "Design homepage mockups",
      description: "Create high-fidelity mockups in Figma.",
      status: "done",
      assignedTo: "u2",
      subtasks: [
        { _id: "st1", title: "Wireframe layout", isCompleted: true },
        { _id: "st2", title: "Apply brand colors", isCompleted: true },
      ],
      attachments: [],
    },
    {
      _id: "t2",
      projectId: "p1",
      title: "Responsive navigation",
      description: "Build the mobile-first navigation component.",
      status: "in_progress",
      assignedTo: "u3",
      subtasks: [
        { _id: "st3", title: "Mobile breakpoints", isCompleted: true },
        { _id: "st4", title: "Accessibility audit", isCompleted: false },
      ],
      attachments: [],
    },
    {
      _id: "t3",
      projectId: "p1",
      title: "Performance optimization",
      description: "Achieve Lighthouse score above 90 across all pages.",
      status: "todo",
      assignedTo: "u2",
      subtasks: [],
      attachments: [],
    },
    {
      _id: "t4",
      projectId: "p2",
      title: "User authentication flow",
      description: "Implement biometric and OAuth login options.",
      status: "in_progress",
      assignedTo: "u1",
      subtasks: [
        { _id: "st5", title: "Face ID integration", isCompleted: false },
      ],
      attachments: [],
    },
    {
      _id: "t5",
      projectId: "p2",
      title: "Push notifications",
      description: "Configure FCM and APNS for both platforms.",
      status: "todo",
      assignedTo: "u2",
      subtasks: [],
      attachments: [],
    },
    {
      _id: "t6",
      projectId: "p3",
      title: "Migrate auth service",
      description: "Extract authentication into standalone microservice.",
      status: "todo",
      assignedTo: "u4",
      subtasks: [],
      attachments: [],
    },
    {
      _id: "t7",
      projectId: "p4",
      title: "Setup data pipeline",
      description: "Configure ETL pipeline from production databases.",
      status: "done",
      assignedTo: "u3",
      subtasks: [{ _id: "st6", title: "Schema design", isCompleted: true }],
      attachments: [],
    },
  ],
  members: [
    {
      _id: "u1",
      name: "Alex Rivera",
      email: "alex@camp.dev",
      role: "admin",
      initials: "AR",
    },
    {
      _id: "u2",
      name: "Sam Chen",
      email: "sam@camp.dev",
      role: "project_admin",
      initials: "SC",
    },
    {
      _id: "u3",
      name: "Jordan Lee",
      email: "jordan@camp.dev",
      role: "member",
      initials: "JL",
    },
    {
      _id: "u4",
      name: "Morgan Park",
      email: "morgan@camp.dev",
      role: "member",
      initials: "MP",
    },
  ],
  pm: {
    p1: [
      { u: "u1", r: "admin" },
      { u: "u2", r: "project_admin" },
      { u: "u3", r: "member" },
    ],
    p2: [
      { u: "u1", r: "admin" },
      { u: "u2", r: "member" },
    ],
    p3: [
      { u: "u1", r: "admin" },
      { u: "u4", r: "member" },
    ],
    p4: [
      { u: "u1", r: "admin" },
      { u: "u3", r: "project_admin" },
      { u: "u4", r: "member" },
    ],
  },
  notes: [
    {
      _id: "n1",
      projectId: "p1",
      title: "Brand Guidelines",
      content:
        "Use Plus Jakarta Sans for headings. Accent: #3b5bdb. Spacing multiples of 4px. Cards rounded 8px.",
      createdAt: new Date("2025-11-06"),
    },
    {
      _id: "n2",
      projectId: "p1",
      title: "Launch Checklist",
      content:
        "1. QA sign-off\n2. SEO audit\n3. Performance test\n4. Stakeholder approval\n5. DNS cutover\n6. Monitoring setup",
      createdAt: new Date("2025-11-14"),
    },
    {
      _id: "n3",
      projectId: "p2",
      title: "App Store Requirements",
      content:
        'iOS requires privacy policy URL and screenshots in 6.7", 6.5", and 5.5" sizes. TestFlight build due before the 15th.',
      createdAt: new Date("2025-11-21"),
    },
    {
      _id: "n4",
      projectId: "p3",
      title: "Architecture Decisions",
      content:
        "Kong as API gateway. Services via RabbitMQ. JWT secrets rotated every 7 days. Rate limit: 1000 req/min per IP.",
      createdAt: new Date("2025-12-03"),
    },
  ],
  activity: [
    {
      action: "Task marked done",
      project: "Website Redesign",
      user: "Sam Chen",
      time: "2m ago",
    },
    {
      action: "Member added",
      project: "Mobile App v2",
      user: "Alex Rivera",
      time: "18m ago",
    },
    {
      action: "Note created",
      project: "API Infrastructure",
      user: "Morgan Park",
      time: "1h ago",
    },
    {
      action: "Task created",
      project: "Data Analytics",
      user: "Jordan Lee",
      time: "2h ago",
    },
    {
      action: "Project updated",
      project: "Website Redesign",
      user: "Alex Rivera",
      time: "3h ago",
    },
  ],
};

// ── PROGRESS BAR ──
function pbar(done) {
  const b = document.getElementById("pbar");
  anime({
    targets: b,
    width: "60%",
    duration: 400,
    easing: "easeOutQuart",
    complete: () => {
      if (done)
        anime({
          targets: b,
          width: "100%",
          duration: 300,
          easing: "easeInOutQuad",
          complete: () =>
            setTimeout(() => {
              b.style.width = "0";
            }, 150),
        });
    },
  });
}

// ── STAGGER REVEAL ──
function reveal(sel, delay = 40, fromY = 6) {
  requestAnimationFrame(() => {
    const els = document.querySelectorAll(sel);
    if (!els.length) return;
    // Set initial state
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = `translateY(${fromY}px)`;
    });
    requestAnimationFrame(() => {
      anime({
        targets: Array.from(els),
        opacity: [0, 1],
        translateY: [fromY, 0],
        duration: 380,
        delay: anime.stagger(delay, { start: 0 }),
        easing: "easeOutCubic",
        complete: (anim) => {
          // Clean up inline styles after animation
          anim.animatables.forEach((a) => {
            a.target.style.opacity = "";
            a.target.style.transform = "";
          });
        },
      });
    });
  });
}

// ── COUNTER ANIMATION ──
function countUp(id, target, duration = 700) {
  anime({
    targets: { v: 0 },
    v: target,
    round: 1,
    duration,
    easing: "easeOutExpo",
    update(a) {
      document.getElementById(id).textContent = Math.round(
        a.animations[0].currentValue,
      );
    },
  });
}

// ── AUTH ──
function doLogin() {
  if (
    !document.getElementById("le").value ||
    !document.getElementById("lp").value
  ) {
    toast("Please fill in all fields.", "err");
    return;
  }
  const btn = document.getElementById("loginBtn");
  btn.textContent = "Signing in…";
  btn.disabled = true;
  anime({
    targets: btn,
    opacity: [1, 0.55, 1],
    duration: 400,
    easing: "easeInOutSine",
  });
  setTimeout(() => {
    CU = S.members[0];
    btn.textContent = "Continue";
    btn.disabled = false;
    // Start curtain FIRST — covers screen before auth disappears, no flash
    playLoginTransition(() => initApp());
    // Fade auth box out in sync with curtain sweeping in
    anime({
      targets: "#authBox",
      opacity: [1, 0],
      translateY: [0, -10],
      scale: [1, 0.97],
      duration: 320,
      easing: "easeInCubic",
    });
    // Remove auth screen only after curtain has fully covered viewport (500ms sweep)
    setTimeout(() => {
      AuthBg.stop();
      document.getElementById("authScr").classList.remove("show");
    }, 520);
  }, 440);
}
function doReg() {
  toast("Account created! Welcome aboard.", "ok");
  setTimeout(() => {
    CU = S.members[0];
    playLoginTransition(() => initApp());
    anime({
      targets: "#authBox",
      opacity: [1, 0],
      scale: [1, 0.97],
      duration: 320,
      easing: "easeInCubic",
    });
    setTimeout(() => {
      AuthBg.stop();
      document.getElementById("authScr").classList.remove("show");
    }, 520);
  }, 700);
}

// ── LOGIN TRANSITION ──
function playLoginTransition(onComplete) {
  const overlay = document.getElementById("loginOverlay");
  const topPanel = document.getElementById("loginOverlayTop");
  const botPanel = document.getElementById("loginOverlayBot");
  const seam = document.getElementById("loginOverlaySeam");
  const logoWrap = document.getElementById("loginOverlayLogo");

  // Block interaction during transition
  overlay.style.pointerEvents = "all";

  // Reset to start positions (curtains off-screen)
  topPanel.style.transform = "translateY(-100%)";
  botPanel.style.transform = "translateY(100%)";
  seam.style.transform = "translateY(-50%) scaleX(0)";
  seam.style.opacity = "0";
  logoWrap.style.opacity = "0";
  logoWrap.style.transform = "translate(-50%, -50%) scale(0.82)";

  const EASE_IN = "cubicBezier(0.76, 0, 0.24, 1)";
  const EASE_OUT = "cubicBezier(0.16, 1, 0.3, 1)";

  // ── Phase 1: Curtains sweep IN from top & bottom ──
  anime({
    targets: topPanel,
    translateY: ["-100%", "0%"],
    duration: 500,
    easing: EASE_IN,
  });
  anime({
    targets: botPanel,
    translateY: ["100%", "0%"],
    duration: 500,
    easing: EASE_IN,
    complete: () => {
      // ── Phase 2: Seam line flash ──
      anime({
        targets: seam,
        scaleX: [0, 1],
        opacity: [0, 1, 0],
        duration: 380,
        easing: "easeOutCubic",
        complete: () => {
          // ── Phase 3: Logo appears ──
          anime({
            targets: logoWrap,
            opacity: [0, 1],
            scale: [0.82, 1],
            translateX: ["-50%", "-50%"],
            translateY: ["-44%", "-50%"],
            duration: 340,
            easing: EASE_OUT,
            complete: () => {
              // ── Phase 4: Init app behind the curtain ──
              onComplete();

              // Hold on logo briefly
              setTimeout(() => {
                // ── Phase 5: Logo fades out ──
                anime({
                  targets: logoWrap,
                  opacity: [1, 0],
                  scale: [1, 1.08],
                  duration: 220,
                  easing: "easeInCubic",
                });

                // ── Phase 6: Curtains peel away (top up, bot down) with slight delay stagger ──
                setTimeout(() => {
                  anime({
                    targets: topPanel,
                    translateY: ["0%", "-100%"],
                    duration: 540,
                    easing: EASE_OUT,
                  });
                  anime({
                    targets: botPanel,
                    translateY: ["0%", "100%"],
                    duration: 540,
                    delay: 40,
                    easing: EASE_OUT,
                    complete: () => {
                      // Release interaction, reset for next time
                      overlay.style.pointerEvents = "none";
                      topPanel.style.transform = "translateY(-100%)";
                      botPanel.style.transform = "translateY(100%)";
                      logoWrap.style.opacity = "0";
                      logoWrap.style.transform =
                        "translate(-50%, -50%) scale(0.82)";
                    },
                  });
                }, 60);
              }, 380); // hold duration on logo
            },
          });
        },
      });
    },
  });
}
function doLogout() {
  const cur = document.querySelector(".view.act");
  if (cur) {
    anime({
      targets: cur,
      opacity: [1, 0],
      duration: 140,
      easing: "easeInQuad",
      complete: () => cur.classList.remove("act"),
    });
  }
  CU = null;
  // Fade out sidebar + topbar, then reset to hidden start state for next login
  const sb = document.getElementById("sidebar");
  const tb = document.querySelector(".topbar");
  anime({
    targets: [sb, tb],
    opacity: 0,
    duration: 160,
    easing: "easeInQuad",
    complete: () => {
      anime.set(sb, { opacity: 0, translateX: -12 });
      anime.set(tb, { opacity: 0, translateY: -8 });
      anime.set("#sidebar .ni, #sidebar .pni, #sidebar .user-row", {
        opacity: 0,
        translateX: 0,
      });
    },
  });
  document.getElementById("authScr").classList.add("show");
  const box = document.getElementById("authBox");
  anime.set(box, { opacity: 0, translateY: 20, scale: 0.97 });
  // Re-init background so it picks up the current theme immediately
  AuthBg.stop();
  requestAnimationFrame(() => {
    AuthBg.init();
    anime({
      targets: box,
      opacity: [0, 1],
      translateY: [20, 0],
      scale: [0.97, 1],
      duration: 360,
      easing: "easeOutCubic",
    });
  });
}
function showForgot() {
  toast("Password reset link sent to your email.", "ok");
}
function sTab(t) {
  document.getElementById("at-l").classList.toggle("act", t === "l");
  document.getElementById("at-r").classList.toggle("act", t === "r");
  document.getElementById("lf").style.display = t === "l" ? "block" : "none";
  document.getElementById("rf").style.display = t === "r" ? "block" : "none";
}

// ── INIT ──
function initApp() {
  document.getElementById("sbAv").textContent = CU.initials;
  document.getElementById("sbN").textContent = CU.name;
  document.getElementById("sbR").textContent = CU.role.replace("_", " ");
  rSbProjs();
  updCts();
  if (window.lucide) lucide.createIcons();

  // Hide sidebar + topbar NOW (they're visible by default in CSS)
  // so they stay hidden behind the curtain and only appear when it opens
  const sb = document.getElementById("sidebar");
  const tb = document.querySelector(".topbar");
  anime.set(sb, { opacity: 0, translateX: -12 });
  anime.set(tb, { opacity: 0, translateY: -8 });
  anime.set("#sidebar .ni, #sidebar .pni, #sidebar .user-row", {
    opacity: 0,
  });

  // Start rendering dashboard content behind the curtain
  go("dashboard");

  // Keep progress bar invisible until curtain has fully opened
  const pb = document.getElementById("pbar");
  if (pb) { pb.style.opacity = "0"; pb.style.width = "0"; }

  // Curtain opens ~1900ms in — reveal sidebar + topbar then
  setTimeout(() => {
    // Restore progress bar now that curtain has fully opened
    if (pb) pb.style.opacity = "";

    anime({
      targets: sb,
      opacity: [0, 1],
      translateX: [-12, 0],
      duration: 380,
      easing: "cubicBezier(0.16,1,0.3,1)",
    });
    anime({
      targets: tb,
      opacity: [0, 1],
      translateY: [-8, 0],
      duration: 340,
      delay: 50,
      easing: "cubicBezier(0.16,1,0.3,1)",
    });
    setTimeout(() => {
      anime({
        targets: "#sidebar .ni, #sidebar .pni, #sidebar .user-row",
        opacity: [0, 1],
        translateX: [-6, 0],
        duration: 240,
        delay: anime.stagger(28),
        easing: "easeOutCubic",
      });
    }, 180);
  }, 1900);
}
function rSbProjs() {
  document.getElementById("sbProjs").innerHTML = S.projects
    .map(
      (p) =>
        `<div class="pni ${CPJ === p._id ? "act" : ""}" onclick="openProject('${p._id}')"><div class="pni-dot"></div><span>${p.name}</span></div>`,
    )
    .join("");
}
function updCts() {
  document.getElementById("sbPC").textContent = S.projects.length;
  document.getElementById("sbTC").textContent = S.tasks.filter(
    (t) => t.assignedTo === CU?._id,
  ).length;
}

// ── NAVIGATE ──
function go(v) {
  pbar(false);
  document.querySelectorAll(".ni").forEach((el) => el.classList.remove("act"));
  const nEl = document.getElementById(`nav-${v}`);
  if (nEl) nEl.classList.add("act");
  const prev = document.querySelector(".view.act");

  if (prev && prev.id !== `v-${v}`) {
    // Fade out prev, then swap
    anime({
      targets: prev,
      opacity: [1, 0],
      translateY: [0, -4],
      duration: 160,
      easing: "easeInQuad",
      complete: () => {
        prev.classList.remove("act");
        prev.style.opacity = "";
        showView(v);
      },
    });
  } else if (!prev) {
    showView(v);
  } else {
    // Same view, just refresh
    showView(v);
  }
}

function showView(v) {
  const cEl = document.getElementById("topCTA");
  const tEl = document.getElementById("topT");
  const sEl = document.getElementById("topS");
  cEl.style.display = "inline-flex";
  const sh = (ti, sub, ct, fn) => {
    tEl.firstChild.textContent = ti;
    sEl.textContent = sub ? ` — ${sub}` : "";
    cEl.textContent = ct;
    topFn = fn;
  };
  if (v === "dashboard") {
    sh(
      "Dashboard",
      CU?.name.split(" ")[0] || "",
      "+ New project",
      openCreateProject,
    );
    rDash();
  } else if (v === "projects") {
    sh("Projects", "All workspaces", "+ New project", openCreateProject);
    rProjects();
  } else if (v === "tasks") {
    sh("My Tasks", "Assigned to you", "+ Add task", () => {
      if (S.projects.length) {
        CPJ = S.projects[0]._id;
        openCreateTask();
      }
    });
    rMyTasks("all");
  } else if (v === "members") {
    sh("Team", "All members", "", () => {});
    cEl.style.display = "none";
    rGMembers();
  } else if (v === "health") {
    sh("System Health", "", "");
    cEl.style.display = "none";
    rHealth();
  } else if (v === "profile") {
    sh("Profile", "Your account", "");
    cEl.style.display = "none";
    rProfile();
  }
  const view = document.getElementById(`v-${v}`);
  if (view) {
    view.classList.add("act");
    // Render content first, then animate in
    requestAnimationFrame(() => {
      anime({
        targets: view,
        opacity: [0, 1],
        translateY: [6, 0],
        duration: 320,
        easing: "easeOutCubic",
      });
    });
  }
  pbar(true);
}
function doTopCTA() {
  topFn();
}

// ── DASHBOARD ──
function rDash() {
  const done = S.tasks.filter((t) => t.status === "done").length;
  const inp = S.tasks.filter((t) => t.status === "in_progress").length;

  // Build all HTML first
  document.getElementById("stP").textContent = "0";
  document.getElementById("stD").textContent = "0";
  document.getElementById("stI").textContent = "0";
  document.getElementById("stM").textContent = "0";
  document.getElementById("dashPG").innerHTML = S.projects
    .slice(0, 4)
    .map(pCard)
    .join("");
  document.getElementById("actB").innerHTML = S.activity
    .map(
      (a) =>
        `<tr><td>${a.action}</td><td style="color:var(--ink3)">${a.project}</td><td>${a.user}</td><td style="color:var(--ink3);font-family:var(--mono);font-size:11.5px;">${a.time}</td></tr>`,
    )
    .join("");
  if (window.lucide) lucide.createIcons();

  // Two rAFs: first lets the DOM paint, second ensures layout is stable
  requestAnimationFrame(() => requestAnimationFrame(() => {
    countUp("stP", S.projects.length, 600);
    countUp("stD", done, 700);
    countUp("stI", inp, 700);
    countUp("stM", S.members.length, 600);
    reveal(".stat-strip .sc", 45, 6);
    reveal("#dashPG .pc", 55, 8);
    reveal("#actB tr", 30, 5);
    animPBars();
  }));
}

// ── PROJECTS ──
function rProjects() {
  document.getElementById("allPG").innerHTML = S.projects.map(pCard).join("");
  document.getElementById("pjCt").textContent = S.projects.length;
  if (window.lucide) lucide.createIcons();
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      reveal("#allPG .pc", 50, 8);
      animPBars();
    }),
  );
}

function pCard(p) {
  const tasks = S.tasks.filter((t) => t.projectId === p._id);
  const pct = tasks.length
    ? Math.round(
        (tasks.filter((t) => t.status === "done").length / tasks.length) * 100,
      )
    : 0;
  const mems = S.pm[p._id] || [];
  const pips = mems
    .slice(0, 4)
    .map((m) => {
      const u = S.members.find((x) => x._id === m.u);
      return u ? `<div class="mpip">${u.initials}</div>` : "";
    })
    .join("");
  return `<div class="pc" onclick="openProject('${p._id}')">
    <div class="pc-top">
      <div class="pc-emoji">${p.emoji}</div>
      <div><div class="pc-name">${p.name}</div><div class="pc-meta">${mems.length} member${mems.length !== 1 ? "s" : ""} · ${tasks.length} task${tasks.length !== 1 ? "s" : ""}</div></div>
    </div>
    <div class="pc-desc">${p.description}</div>
    <div class="pc-foot">
      <div class="pb-wrap">
        <div class="pb-label"><span>Progress</span><span>${pct}%</span></div>
        <div class="pb"><div class="pf" style="width:0%" data-pct="${pct}"></div></div>
      </div>
      <div class="mpips">${pips}</div>
    </div>
  </div>`;
}

function animPBars() {
  document.querySelectorAll(".pf[data-pct]").forEach((el) => {
    const pct = parseInt(el.getAttribute("data-pct"));
    anime({
      targets: el,
      width: pct + "%",
      duration: 750,
      easing: "easeOutExpo",
      delay: 200,
    });
  });
}

function openProject(id) {
  CPJ = id;
  const p = S.projects.find((x) => x._id === id);
  if (!p) return;
  document.getElementById("dEm").textContent = p.emoji;
  document.getElementById("dTi").textContent = p.name;
  document.getElementById("dDe").textContent = p.description;
  const tasks = S.tasks.filter((t) => t.projectId === id);
  const mems = S.pm[id] || [];
  document.getElementById("dCh").innerHTML =
    `<span class="badge b-gray">${tasks.length} task${tasks.length !== 1 ? "s" : ""}</span>
     <span class="badge b-green">${tasks.filter((t) => t.status === "done").length} done</span>
     <span class="badge b-gray">${mems.length} member${mems.length !== 1 ? "s" : ""}</span>`;
  const isAdm =
    (S.pm[id] || []).find((m) => m.u === CU?._id)?.r === "admin" ||
    CU?.role === "admin";
  ["ePjBtn", "dPjBtn"].forEach(
    (id) =>
      (document.getElementById(id).style.display = isAdm
        ? "inline-flex"
        : "none"),
  );
  ["aMBtn", "aNBtn"].forEach(
    (id) =>
      (document.getElementById(id).style.display = isAdm
        ? "inline-flex"
        : "none"),
  );

  document.querySelectorAll(".ni").forEach((el) => el.classList.remove("act"));
  document.getElementById("nav-projects").classList.add("act");

  const prev = document.querySelector(".view.act");
  const show = () => {
    document
      .querySelectorAll(".view")
      .forEach((el) => el.classList.remove("act"));
    document.getElementById("v-project-detail").classList.add("act");
    document.getElementById("topT").firstChild.textContent = p.name;
    document.getElementById("topS").textContent = "";
    document.getElementById("topCTA").textContent = "+ Add task";
    document.getElementById("topCTA").style.display = "inline-flex";
    topFn = openCreateTask;
    sDTab("tasks");
    rSbProjs();
    requestAnimationFrame(() => {
      anime({
        targets: "#v-project-detail",
        opacity: [0, 1],
        translateY: [6, 0],
        duration: 320,
        easing: "easeOutCubic",
      });
    });
    pbar(true);
  };
  pbar(false);
  if (prev) {
    anime({
      targets: prev,
      opacity: [1, 0],
      translateY: [0, -4],
      duration: 160,
      easing: "easeInQuad",
      complete: () => {
        prev.classList.remove("act");
        prev.style.opacity = "";
        show();
      },
    });
  } else show();
}

function sDTab(tab) {
  ["tasks", "members", "notes"].forEach((t) => {
    document.getElementById(
      `d${t.charAt(0).toUpperCase() + t.slice(1)}`,
    ).style.display = t === tab ? "block" : "none";
    document.getElementById(`dtab-${t}`).classList.toggle("act", t === tab);
  });
  if (tab === "tasks") {
    rBoard();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        reveal(".tc", 35, 5);
        animPBars();
      }),
    );
  }
  if (tab === "members") {
    rPMems();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => reveal("#mBody tr", 30, 4)),
    );
  }
  if (tab === "notes") {
    rNotes();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => reveal(".nc", 45, 6)),
    );
  }
}

// ── BOARD ──
function rBoard() {
  const tasks = S.tasks.filter((t) => t.projectId === CPJ);
  [
    ["todo", "cTo"],
    ["in_progress", "cIp"],
    ["done", "cDo"],
  ].forEach(([s, cid]) => {
    const col = tasks.filter((t) => t.status === s);
    document.getElementById(cid).textContent = col.length;
    document.getElementById(`col-${s}`).innerHTML = col.length
      ? col
          .map((t) => {
            const u = S.members.find((m) => m._id === t.assignedTo);
            const dc = t.subtasks.filter((x) => x.isCompleted).length;
            return `<div class="tc" onclick="openTD('${t._id}')">
            <div class="tc-t">${t.title}</div>
            <div class="tc-m">
              ${t.subtasks.length ? `<span class="tc-sc">${dc}/${t.subtasks.length}</span>` : ""}
              <div class="tc-av">${u ? u.initials : "—"}</div>
            </div>
          </div>`;
          })
          .join("")
      : `<div style="padding:14px;text-align:center;font-size:12px;color:var(--ink4);">No tasks</div>`;
  });
}

// ── MY TASKS ──
function rMyTasks(f) {
  const mine = S.tasks.filter(
    (t) => t.assignedTo === CU?._id && (f === "all" || t.status === f),
  );
  const b = document.getElementById("myTB");
  if (!mine.length) {
    b.innerHTML = `<tr><td colspan="5"><div class="empty"><div class="empty-ico">✓</div><div class="empty-t">No tasks found.</div></div></td></tr>`;
    return;
  }
  b.innerHTML = mine
    .map((t) => {
      const p = S.projects.find((x) => x._id === t.projectId);
      const sb =
        t.status === "done"
          ? "b-green"
          : t.status === "in_progress"
            ? "b-amber"
            : "b-gray";
      const dc = t.subtasks.filter((s) => s.isCompleted).length;
      return `<tr><td style="font-weight:500">${t.title}</td><td style="color:var(--ink3)">${p ? `${p.emoji} ${p.name}` : "—"}</td><td><span class="badge ${sb}">${t.status.replace("_", " ")}</span></td><td style="color:var(--ink3);font-family:var(--mono);font-size:11.5px;">${dc}/${t.subtasks.length}</td><td><button class="btn btn-b" style="font-size:12px;" onclick="openTD('${t._id}')">Open →</button></td></tr>`;
    })
    .join("");
  requestAnimationFrame(() =>
    requestAnimationFrame(() => reveal("#myTB tr", 30, 4)),
  );
}

// ── TASK CRUD ──
function openCreateTask() {
  document.getElementById("tT").value = "";
  document.getElementById("tDe").value = "";
  document.getElementById("tSt").value = "todo";
  const sel = document.getElementById("tAs");
  const mems = (S.pm[CPJ] || [])
    .map((m) => S.members.find((u) => u._id === m.u))
    .filter(Boolean);
  sel.innerHTML =
    `<option value="">Unassigned</option>` +
    mems.map((m) => `<option value="${m._id}">${m.name}</option>`).join("");
  om("mTask");
}
function saveTask() {
  const title = document.getElementById("tT").value.trim();
  if (!title) {
    toast("Task title is required.", "err");
    return;
  }
  S.tasks.push({
    _id: "t" + Date.now(),
    projectId: CPJ,
    title,
    description: document.getElementById("tDe").value,
    status: document.getElementById("tSt").value,
    assignedTo: document.getElementById("tAs").value || null,
    subtasks: [],
    attachments: [],
    createdAt: new Date(),
  });
  S.activity.unshift({
    action: "Task created",
    project: S.projects.find((p) => p._id === CPJ)?.name || "",
    user: CU.name,
    time: "just now",
  });
  cm("mTask");
  rBoard();
  updCts();
  toast("Task created successfully.", "ok");
  requestAnimationFrame(() =>
    requestAnimationFrame(() => reveal(".tc", 35, 5)),
  );
}
function openTD(id) {
  CTK = id;
  const t = S.tasks.find((x) => x._id === id);
  if (!t) return;
  const p = S.projects.find((x) => x._id === t.projectId);
  const u = S.members.find((m) => m._id === t.assignedTo);
  document.getElementById("tdT").textContent = t.title;
  document.getElementById("tdP").textContent = p ? `${p.emoji} ${p.name}` : "";
  document.getElementById("tdDe").textContent =
    t.description || "No description provided.";
  document.getElementById("tdSt").value = t.status;
  document.getElementById("tdAs").innerHTML = u
    ? `<div class="u-av" style="width:20px;height:20px;font-size:8px;">${u.initials}</div>${u.name}`
    : `<span style="color:var(--ink4)">Unassigned</span>`;
  rSts(t);
  om("mTaskD");
}
function rSts(t) {
  const el = document.getElementById("tdSts");
  if (!t.subtasks.length) {
    el.innerHTML = `<div style="color:var(--ink3);font-size:12.5px;padding:10px 0;text-align:center;">No subtasks yet.</div>`;
    return;
  }
  el.innerHTML = t.subtasks
    .map(
      (s) =>
        `<div class="str">
      <input type="checkbox" ${s.isCompleted ? "checked" : ""} onchange="togSt('${t._id}','${s._id}')"/>
      <span class="st-t ${s.isCompleted ? "done" : ""}">${s.title}</span>
      <button onclick="delSt('${t._id}','${s._id}')" style="background:none;border:none;color:var(--ink3);cursor:pointer;font-size:13px;padding:0 4px;transition:color 0.15s" onmouseenter="this.style.color='var(--red)'" onmouseleave="this.style.color='var(--ink3)'">✕</button>
    </div>`,
    )
    .join("");
  reveal(".str", 30, 4);
}
function togSt(tid, sid) {
  const t = S.tasks.find((x) => x._id === tid);
  const s = t?.subtasks.find((x) => x._id === sid);
  if (s) {
    s.isCompleted = !s.isCompleted;
    rSts(t);
  }
}
function delSt(tid, sid) {
  const t = S.tasks.find((x) => x._id === tid);
  if (t) {
    t.subtasks = t.subtasks.filter((s) => s._id !== sid);
    rSts(t);
  }
}
function updTSt() {
  const t = S.tasks.find((x) => x._id === CTK);
  if (t) {
    t.status = document.getElementById("tdSt").value;
    rBoard();
  }
}
function delCurTask() {
  if (!confirm("Delete this task? This cannot be undone.")) return;
  const m = document.querySelector("#mTaskD .md");
  anime({
    targets: m,
    opacity: 0,
    scale: 0.97,
    duration: 160,
    easing: "easeInCubic",
    complete: () => {
      S.tasks = S.tasks.filter((t) => t._id !== CTK);
      cm("mTaskD");
      rBoard();
      updCts();
      toast("Task deleted.", "ok");
    },
  });
}
function openCSt() {
  document.getElementById("stTi").value = "";
  om("mSubtask");
}
function saveSt() {
  const title = document.getElementById("stTi").value.trim();
  if (!title) {
    toast("Title is required.", "err");
    return;
  }
  const t = S.tasks.find((x) => x._id === CTK);
  if (t) {
    t.subtasks.push({
      _id: "st" + Date.now(),
      title,
      isCompleted: false,
    });
    rSts(t);
  }
  cm("mSubtask");
  toast("Subtask added.", "ok");
}

// ── MEMBERS ──
function rPMems() {
  const mems = S.pm[CPJ] || [];
  const b = document.getElementById("mBody");
  if (!mems.length) {
    b.innerHTML = `<tr><td colspan="4"><div class="empty"><div class="empty-ico"><i data-lucide="users"></i></div><div class="empty-t">No members yet.</div></div></td></tr>`;
    return;
  }
  b.innerHTML = mems
    .map((m) => {
      const u = S.members.find((x) => x._id === m.u);
      if (!u) return "";
      const isAdm = CU?.role === "admin" && m.u !== CU._id;
      const rb =
        m.r === "admin"
          ? "b-red"
          : m.r === "project_admin"
            ? "b-amber"
            : "b-gray";
      return `<tr>
      <td><div style="display:flex;align-items:center;gap:9px;"><div class="u-av" style="width:28px;height:28px;font-size:11px;">${u.initials}</div>${u.name}</div></td>
      <td style="color:var(--ink3);font-family:var(--mono);font-size:12px;">${u.email}</td>
      <td><span class="badge ${rb}">${m.r.replace("_", " ")}</span></td>
      <td>${
        isAdm
          ? `<select class="fs" style="width:auto;font-size:12px;padding:4px 8px;" onchange="updMR('${m.u}',this.value)">
            <option value="member" ${m.r === "member" ? "selected" : ""}>Member</option>
            <option value="project_admin" ${m.r === "project_admin" ? "selected" : ""}>Project Admin</option>
          </select>
          <button class="btn btn-b" style="color:var(--red);font-size:12px;" onclick="rmMem('${m.u}')">Remove</button>`
          : '<span style="color:var(--ink4);font-size:12px;">—</span>'
      }
      </td>
    </tr>`;
    })
    .join("");
}
function rGMembers() {
  document.getElementById("gmBody").innerHTML = S.members
    .map((u) => {
      const pc = Object.values(S.pm).filter((ms) =>
        ms.find((m) => m.u === u._id),
      ).length;
      const tc = S.tasks.filter((t) => t.assignedTo === u._id).length;
      const rb =
        u.role === "admin"
          ? "b-red"
          : u.role === "project_admin"
            ? "b-amber"
            : "b-gray";
      return `<tr>
      <td><div style="display:flex;align-items:center;gap:9px;"><div class="u-av" style="width:28px;height:28px;font-size:11px;">${u.initials}</div>${u.name}</div></td>
      <td style="color:var(--ink3);font-family:var(--mono);font-size:12px;">${u.email}</td>
      <td style="color:var(--ink2);font-family:var(--mono);">${pc}</td>
      <td style="color:var(--ink2);font-family:var(--mono);">${tc}</td>
      <td><span class="badge ${rb}">${u.role.replace("_", " ")}</span></td>
    </tr>`;
    })
    .join("");
  requestAnimationFrame(() =>
    requestAnimationFrame(() => reveal("#gmBody tr", 35, 4)),
  );
}
function openAddMember() {
  document.getElementById("mEm").value = "";
  om("mMember");
}
function addMember() {
  const email = document.getElementById("mEm").value.trim();
  const role = document.getElementById("mRo").value;
  if (!email) {
    toast("Email address is required.", "err");
    return;
  }
  const u = S.members.find((x) => x.email === email);
  if (!u) {
    toast("No account found with that email.", "err");
    return;
  }
  if ((S.pm[CPJ] || []).find((m) => m.u === u._id)) {
    toast("This person is already a member.", "err");
    return;
  }
  if (!S.pm[CPJ]) S.pm[CPJ] = [];
  S.pm[CPJ].push({ u: u._id, r: role });
  cm("mMember");
  rPMems();
  requestAnimationFrame(() =>
    requestAnimationFrame(() => reveal("#mBody tr", 30, 4)),
  );
  toast(`${u.name} added to the project.`, "ok");
}
function updMR(uid, role) {
  const m = (S.pm[CPJ] || []).find((x) => x.u === uid);
  if (m) {
    m.r = role;
    toast("Role updated.", "ok");
  }
}
function rmMem(uid) {
  if (!confirm("Remove this member from the project?")) return;
  S.pm[CPJ] = (S.pm[CPJ] || []).filter((m) => m.u !== uid);
  rPMems();
  toast("Member removed.", "ok");
}

// ── NOTES ──
function rNotes() {
  const notes = S.notes.filter((n) => n.projectId === CPJ);
  const grid = document.getElementById("nGrid");
  if (!notes.length) {
    grid.innerHTML = `<div class="empty"><div class="empty-ico">📝</div><div class="empty-t">No notes yet.</div><div class="empty-s">Add project documentation and references.</div></div>`;
    return;
  }
  grid.innerHTML = notes
    .map(
      (n, i) =>
        `<div class="nc" onclick="openEditNote('${n._id}')">
      <div class="nc-stripe" style="background:${NC_COLORS[i % NC_COLORS.length]};"></div>
      <div class="nc-t">${n.title}</div>
      <div class="nc-b">${n.content.replace(/\n/g, "<br>")}</div>
      <div class="nc-f">
        <span class="nc-d">${fmtD(n.createdAt)}</span>
        ${CU?.role === "admin" ? `<button class="btn btn-b" style="color:var(--red);font-size:11px;padding:2px 6px;" onclick="event.stopPropagation();delNote('${n._id}')">Delete</button>` : ""}
      </div>
    </div>`,
    )
    .join("");
}
function openCreateNote() {
  ENO = null;
  document.getElementById("mNT").textContent = "New note";
  document.getElementById("nTi").value = "";
  document.getElementById("nCo").value = "";
  om("mNote");
}
function openEditNote(id) {
  if (CU?.role !== "admin") {
    toast("Only admins can edit notes.", "err");
    return;
  }
  const n = S.notes.find((x) => x._id === id);
  if (!n) return;
  ENO = id;
  document.getElementById("mNT").textContent = "Edit note";
  document.getElementById("nTi").value = n.title;
  document.getElementById("nCo").value = n.content;
  om("mNote");
}
function saveNote() {
  const title = document.getElementById("nTi").value.trim();
  if (!title) {
    toast("Note title is required.", "err");
    return;
  }
  if (ENO) {
    const n = S.notes.find((x) => x._id === ENO);
    if (n) {
      n.title = title;
      n.content = document.getElementById("nCo").value;
    }
    toast("Note updated.", "ok");
  } else {
    S.notes.push({
      _id: "n" + Date.now(),
      projectId: CPJ,
      title,
      content: document.getElementById("nCo").value,
      createdAt: new Date(),
    });
    toast("Note created.", "ok");
  }
  cm("mNote");
  rNotes();
  requestAnimationFrame(() =>
    requestAnimationFrame(() => reveal(".nc", 45, 6)),
  );
}
function delNote(id) {
  if (!confirm("Delete this note?")) return;
  S.notes = S.notes.filter((n) => n._id !== id);
  rNotes();
  toast("Note deleted.", "ok");
}

// ── PROJECT CRUD ──
function openCreateProject() {
  EPJ = null;
  SEm = "📁";
  document.getElementById("mPjT").textContent = "New project";
  document.getElementById("pN").value = "";
  document.getElementById("pD").value = "";
  document.getElementById("savePjB").textContent = "Create project";
  buildEP();
  om("mProject");
}
function openEditProject() {
  const p = S.projects.find((x) => x._id === CPJ);
  if (!p) return;
  EPJ = CPJ;
  SEm = p.emoji;
  document.getElementById("mPjT").textContent = "Edit project";
  document.getElementById("pN").value = p.name;
  document.getElementById("pD").value = p.description;
  document.getElementById("savePjB").textContent = "Save changes";
  buildEP();
  om("mProject");
}
function buildEP() {
  document.getElementById("epick").innerHTML = EMOJIS.map(
    (e) =>
      `<div class="epi ${e === SEm ? "sel" : ""}" onclick="selEm('${e}')">${e}</div>`,
  ).join("");
}
function selEm(e) {
  SEm = e;
  buildEP();
  anime({
    targets: ".epi.sel",
    scale: [0.85, 1.08, 1],
    duration: 280,
    easing: "easeOutBack",
  });
}
function saveProject() {
  const name = document.getElementById("pN").value.trim();
  if (!name) {
    toast("Project name is required.", "err");
    return;
  }
  const desc = document.getElementById("pD").value;
  if (EPJ) {
    const p = S.projects.find((x) => x._id === EPJ);
    if (p) {
      p.name = name;
      p.description = desc;
      p.emoji = SEm;
    }
    toast("Project updated.", "ok");
    cm("mProject");
    openProject(EPJ);
  } else {
    const id = "p" + Date.now();
    S.projects.push({
      _id: id,
      name,
      description: desc,
      emoji: SEm,
      createdAt: new Date(),
    });
    S.pm[id] = [{ u: CU._id, r: "admin" }];
    S.activity.unshift({
      action: "Project created",
      project: name,
      user: CU.name,
      time: "just now",
    });
    cm("mProject");
    rProjects();
    rSbProjs();
    updCts();
    toast("Project created.", "ok");
  }
}
function delCurProj() {
  if (
    !confirm(
      "Delete this project and all its tasks and notes? This cannot be undone.",
    )
  )
    return;
  S.projects = S.projects.filter((p) => p._id !== CPJ);
  S.tasks = S.tasks.filter((t) => t.projectId !== CPJ);
  S.notes = S.notes.filter((n) => n.projectId !== CPJ);
  delete S.pm[CPJ];
  CPJ = null;
  go("projects");
  rSbProjs();
  updCts();
  toast("Project deleted.", "ok");
}

// ── HEALTH ──
function rHealth() {
  const mc = {
    GET: "b-green",
    POST: "b-acc",
    PUT: "b-amber",
    DELETE: "b-red",
  };
  document.getElementById("epCount").textContent = EP_DATA.length;
  document.getElementById("epBody").innerHTML = EP_DATA.map(
    (e) =>
      `<tr>
      <td><span class="badge ${mc[e.m] || "b-gray"}">${e.m}</span></td>
      <td><code style="font-family:var(--mono);font-size:11.5px;background:var(--surface2);padding:2px 7px;border-radius:3px;border:1px solid var(--border);">${e.p}</code></td>
      <td style="color:var(--ink3);font-size:12.5px;">${e.d}</td>
      <td>${e.a ? `<span class="badge b-amber">JWT</span>` : `<span style="color:var(--ink4);font-size:12px;">—</span>`}</td>
    </tr>`,
  ).join("");
  requestAnimationFrame(() =>
    requestAnimationFrame(() => reveal("#epBody tr", 18, 3)),
  );
}

// ── PROFILE ──
function rProfile() {
  if (!CU) return;
  document.getElementById("prAv").textContent = CU.initials;
  document.getElementById("prN").textContent = CU.name;
  document.getElementById("prE").textContent = CU.email;
  const rb =
    CU.role === "admin"
      ? "b-red"
      : CU.role === "project_admin"
        ? "b-amber"
        : "b-gray";
  document.getElementById("prRo").innerHTML =
    `<span class="badge ${rb}">${CU.role.replace("_", " ")}</span>`;
}

// ── SEARCH ──
function doSearch(q) {
  if (!q) {
    go("projects");
    return;
  }
  q = q.toLowerCase();
  const p = S.projects.find(
    (x) =>
      x.name.toLowerCase().includes(q) ||
      x.description.toLowerCase().includes(q),
  );
  if (p) openProject(p._id);
  else toast("No projects match your search.", "inf");
}

// ── MODALS ──
function om(id) {
  const el = document.getElementById(id);
  el.classList.add("open");
  const md = el.querySelector(".md");
  // Reset state before animating
  md.style.opacity = "0";
  md.style.transform = "scale(0.96) translateY(10px)";
  requestAnimationFrame(() => {
    anime({
      targets: md,
      opacity: [0, 1],
      scale: [0.96, 1],
      translateY: [10, 0],
      duration: 240,
      easing: "easeOutCubic",
    });
  });
  if (document.querySelectorAll(".mo.open").length === 1) {
    document.addEventListener("keydown", escH);
  }
}
function cm(id) {
  const el = document.getElementById(id);
  const md = el.querySelector(".md");
  anime({
    targets: md,
    opacity: 0,
    scale: 0.97,
    translateY: 6,
    duration: 180,
    easing: "easeInQuad",
    complete: () => {
      el.classList.remove("open");
      md.style.opacity = "";
      md.style.transform = "";
    },
  });
  if (!document.querySelectorAll(".mo.open").length) {
    document.removeEventListener("keydown", escH);
  }
}
function escH(e) {
  if (e.key === "Escape")
    document.querySelectorAll(".mo.open").forEach((m) => cm(m.id));
}
document.querySelectorAll(".mo").forEach((m) =>
  m.addEventListener("click", (e) => {
    if (e.target === m) cm(m.id);
  }),
);

// ── TOAST ──
function toast(msg, type = "inf") {
  const c = document.getElementById("tWrap");
  const t = document.createElement("div");
  t.className = `tst tst-${type}`;
  t.textContent = msg;
  c.appendChild(t);
  anime({
    targets: t,
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 260,
    easing: "easeOutCubic",
  });
  setTimeout(
    () =>
      anime({
        targets: t,
        opacity: 0,
        translateY: -6,
        duration: 200,
        easing: "easeInCubic",
        complete: () => t.remove(),
      }),
    2800,
  );
}

function fmtD(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
// ── THEME ──
// ── AUTH BACKGROUND — Dot Grid + Radial Spotlight ────────────────────────────
const AuthBg = (() => {
  let canvas, ctx, raf, W, H;
  let mouse = { x: -9999, y: -9999 };
  let target = { x: -9999, y: -9999 }; // lerp target
  let spotlights = [];   // animated soft glows
  let time = 0;

  const DOT_GAP   = 28;   // grid spacing
  const DOT_R     = 1.5;  // base dot radius
  const SPOT_CNT  = 3;    // background floating spotlights

  // ── helpers ──────────────────────────────────────────────────────────────
  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function theme() {
    return isDark() ? {
      bg:          '#0f0f10',
      dot:         'rgba(255,255,255,0.13)',
      dotLit:      'rgba(107,132,240,0.95)',
      spotA:       'rgba(59,91,219,0.22)',
      spotB:       'rgba(107,132,240,0.14)',
      spotC:       'rgba(139,92,246,0.12)',
      cursorSpot:  'rgba(107,132,240,0.28)',
      cursorOuter: 'rgba(59,91,219,0.08)',
    } : {
      bg:          '#f7f7f5',
      dot:         'rgba(24,24,27,0.12)',
      dotLit:      'rgba(59,91,219,0.85)',
      spotA:       'rgba(59,91,219,0.10)',
      spotB:       'rgba(107,132,240,0.07)',
      spotC:       'rgba(139,92,246,0.06)',
      cursorSpot:  'rgba(59,91,219,0.13)',
      cursorOuter: 'rgba(107,132,240,0.05)',
    };
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initSpotlights();
  }

  function initSpotlights() {
    spotlights = Array.from({ length: SPOT_CNT }, (_, i) => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 240 + 200,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      phase: (i / SPOT_CNT) * Math.PI * 2,
    }));
  }

  // ── draw loop ─────────────────────────────────────────────────────────────
  function draw() {
    raf = requestAnimationFrame(draw);
    time += 0.008;

    // Smooth-lerp mouse toward target (0.08 = gentle ease, snappy enough to feel responsive)
    mouse.x += (target.x - mouse.x) * 0.08;
    mouse.y += (target.y - mouse.y) * 0.08;

    const T = theme();
    ctx.clearRect(0, 0, W, H);

    // 1. solid background
    ctx.fillStyle = T.bg;
    ctx.fillRect(0, 0, W, H);

    // 2. floating soft blobs
    const blobColors = [T.spotA, T.spotB, T.spotC];
    spotlights.forEach((s, i) => {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < -s.r)  s.x = W + s.r;
      if (s.x > W + s.r) s.x = -s.r;
      if (s.y < -s.r)  s.y = H + s.r;
      if (s.y > H + s.r) s.y = -s.r;

      const pulse = 1 + 0.12 * Math.sin(time * 0.9 + s.phase);
      const pr = s.r * pulse;
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, pr);
      g.addColorStop(0, blobColors[i % blobColors.length]);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(s.x, s.y, pr, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. cursor radial glow
    const cx = mouse.x, cy = mouse.y;
    const cg1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180);
    cg1.addColorStop(0, T.cursorSpot);
    cg1.addColorStop(1, 'transparent');
    ctx.fillStyle = cg1;
    ctx.fillRect(0, 0, W, H);

    const cg2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 380);
    cg2.addColorStop(0, T.cursorOuter);
    cg2.addColorStop(1, 'transparent');
    ctx.fillStyle = cg2;
    ctx.fillRect(0, 0, W, H);

    // 4. dot grid — lit by cursor proximity
    const cols = Math.ceil(W / DOT_GAP) + 2;
    const rows = Math.ceil(H / DOT_GAP) + 2;
    const offX = ((W % DOT_GAP) / 2);
    const offY = ((H % DOT_GAP) / 2);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const dx = offX + c * DOT_GAP;
        const dy = offY + r * DOT_GAP;
        const dist = Math.hypot(dx - cx, dy - cy);

        // proximity factor: 1 at cursor, 0 at 220px away
        const prox = Math.max(0, 1 - dist / 220);
        // soft pulse on nearest dot
        const scale = 1 + prox * 2.2;

        // interpolate color: base dot → accent lit
        if (prox > 0) {
          ctx.save();
          ctx.globalAlpha = 0.13 + prox * 0.87;
          ctx.fillStyle = T.dotLit;
          ctx.beginPath();
          ctx.arc(dx, dy, DOT_R * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.globalAlpha = 1;
          ctx.fillStyle = T.dot;
          ctx.beginPath();
          ctx.arc(dx, dy, DOT_R, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.globalAlpha = 1;
  }

  // ── public ────────────────────────────────────────────────────────────────
  let _listenersAttached = false;

  function init() {
    canvas = document.getElementById('authBgCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();

    if (!_listenersAttached) {
      const scr = document.getElementById('authScr');
      scr.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        target.x = e.clientX - rect.left;
        target.y = e.clientY - rect.top;
      });
      scr.addEventListener('mouseleave', () => {
        // Ease back to center — no snap
        target.x = W / 2;
        target.y = H / 2;
      });
      window.addEventListener('resize', resize);
      _listenersAttached = true;
    }

    draw();
    // Warm default: start both at center so there's no sweep-in from corner
    mouse.x = target.x = W / 2;
    mouse.y = target.y = H / 2;
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
  }

  return { init, stop };
})();

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('tf-theme', next); } catch(e) {}
  // Brief scale pulse on the toggle button
  if (window.anime) {
    anime({ targets: '#themeToggle', scale: [1, 0.88, 1], duration: 300, easing: 'easeOutBack' });
  }
}

// Wait for fonts + icons before revealing anything
document.addEventListener("DOMContentLoaded", () => {
  // Restore saved theme before body is visible — no flash
  try {
    const saved = localStorage.getItem('tf-theme');
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  } catch(e) {}

  const initIcons = () => {
    if (window.lucide) {
      lucide.createIcons();
    }
    // Show body only after everything is ready to avoid FOUC/jitter
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.add("ready");
      });
    });
  };

  // Give fonts a moment to load then init
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initIcons);
  } else {
    setTimeout(initIcons, 100);
  }

  // Animate auth box in after body is visible
  document.body.addEventListener("transitionend", function onReady(e) {
    if (
      e.propertyName === "opacity" &&
      document.body.classList.contains("ready")
    ) {
      document.body.removeEventListener("transitionend", onReady);
      AuthBg.init();
      if (window.anime) {
        anime({
          targets: "#authBox",
          opacity: [0, 1],
          translateY: [20, 0],
          scale: [0.97, 1],
          duration: 400,
          easing: "easeOutCubic",
        });
      }
    }
  });
});
