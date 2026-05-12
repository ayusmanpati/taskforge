export const EMOJIS = [
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

export const NC_COLORS = [
  "#3b5bdb",
  "#1a7a4a",
  "#854d0e",
  "#991b1b",
  "#5c7a6e",
];

export const EP_DATA = [
  { m: "POST", p: "/api/v1/auth/register", d: "Register user", a: false },
  { m: "POST", p: "/api/v1/auth/login", d: "Login", a: false },
  { m: "POST", p: "/api/v1/auth/logout", d: "Logout", a: true },
  { m: "GET", p: "/api/v1/auth/current-user", d: "Current user", a: true },
  {
    m: "POST",
    p: "/api/v1/auth/change-password",
    d: "Change password",
    a: true,
  },
  { m: "POST", p: "/api/v1/auth/refresh-token", d: "Refresh token", a: false },
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
  { m: "DELETE", p: "/api/v1/projects/:id", d: "Delete project", a: true },
  { m: "GET", p: "/api/v1/projects/:id/members", d: "List members", a: true },
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
  { m: "DELETE", p: "/api/v1/tasks/:pid/t/:tid", d: "Delete task", a: true },
  {
    m: "POST",
    p: "/api/v1/tasks/:pid/t/:tid/subtasks",
    d: "Create subtask",
    a: true,
  },
  { m: "PUT", p: "/api/v1/tasks/:pid/st/:sid", d: "Update subtask", a: true },
  {
    m: "DELETE",
    p: "/api/v1/tasks/:pid/st/:sid",
    d: "Delete subtask",
    a: true,
  },
  { m: "GET", p: "/api/v1/notes/:pid", d: "List notes", a: true },
  { m: "POST", p: "/api/v1/notes/:pid", d: "Create note (Admin)", a: true },
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

export const STATUS_LABEL = {
  todo: "Todo",
  in_progress: "In progress",
  done: "Done",
};

export const STATUS_BADGE = {
  todo: "b-gray",
  in_progress: "b-amber",
  done: "b-green",
};

export const METHOD_BADGE = {
  GET: "b-green",
  POST: "b-amber",
  PUT: "b-acc",
  PATCH: "b-acc",
  DELETE: "b-red",
};

export const INITIAL_DATA = {
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
      createdAt: "2025-11-06T00:00:00.000Z",
    },
    {
      _id: "n2",
      projectId: "p1",
      title: "Launch Checklist",
      content:
        "1. QA sign-off\n2. SEO audit\n3. Performance test\n4. Stakeholder approval\n5. DNS cutover\n6. Monitoring setup",
      createdAt: "2025-11-14T00:00:00.000Z",
    },
    {
      _id: "n3",
      projectId: "p2",
      title: "App Store Requirements",
      content:
        "iOS requires privacy policy URL and screenshots in 6.7 in, 6.5 in, and 5.5 in sizes. TestFlight build due before the 15th.",
      createdAt: "2025-11-21T00:00:00.000Z",
    },
    {
      _id: "n4",
      projectId: "p3",
      title: "Architecture Decisions",
      content:
        "Kong as API gateway. Services via RabbitMQ. JWT secrets rotated every 7 days. Rate limit: 1000 req/min per IP.",
      createdAt: "2025-12-03T00:00:00.000Z",
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
