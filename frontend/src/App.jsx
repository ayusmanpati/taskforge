import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Activity,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Moon,
  Search,
  Sun,
  Users,
} from "lucide-react";
import { EMOJIS, EP_DATA, INITIAL_DATA, NC_COLORS } from "./constants.js";

const STATUS_LABEL = {
  todo: "todo",
  in_progress: "in progress",
  done: "done",
};

const STATUS_BADGE = {
  todo: "b-gray",
  in_progress: "b-amber",
  done: "b-green",
};

const METHOD_BADGE = {
  GET: "b-green",
  POST: "b-acc",
  PUT: "b-amber",
  DELETE: "b-red",
};

function cloneInitialData() {
  if (typeof structuredClone === "function") {
    return structuredClone(INITIAL_DATA);
  }

  return JSON.parse(JSON.stringify(INITIAL_DATA));
}

function buildId(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function fmtDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function roleLabel(role) {
  return role.replaceAll("_", " ");
}

function LogoMark({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="7" fill="#18181b" />
      <rect
        x="5"
        y="12"
        width="4.5"
        height="11"
        rx="1.5"
        fill="white"
        opacity="0.45"
      />
      <rect
        x="11.75"
        y="7"
        width="4.5"
        height="16"
        rx="1.5"
        fill="white"
        opacity="0.9"
      />
      <rect x="18.5" y="10" width="4.5" height="13" rx="1.5" fill="#3b5bdb" />
    </svg>
  );
}

function AuthBackground({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    const parent = canvas.closest("#authScr");
    const motionReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const DOT_GAP = motionReduced ? 34 : 28;
    const DOT_R = motionReduced ? 1.2 : 1.5;
    const SPOT_COUNT = motionReduced ? 2 : 3;
    const FOLLOW_EASE = motionReduced ? 0.05 : 0.08;

    const bounds = { w: 0, h: 0 };
    const target = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    let rafId = 0;
    let frame = 0;
    let points = [];
    let spots = [];

    const palette = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        return {
          bg: "#0f0f10",
          dot: "rgba(255,255,255,0.13)",
          dotLit: "rgba(107,132,240,0.95)",
          spotA: "rgba(59,91,219,0.22)",
          spotB: "rgba(107,132,240,0.14)",
          spotC: "rgba(139,92,246,0.12)",
          cursorSpot: "rgba(107,132,240,0.28)",
          cursorOuter: "rgba(59,91,219,0.08)",
        };
      }

      return {
        bg: "#f7f7f5",
        dot: "rgba(24,24,27,0.12)",
        dotLit: "rgba(59,91,219,0.85)",
        spotA: "rgba(59,91,219,0.10)",
        spotB: "rgba(107,132,240,0.07)",
        spotC: "rgba(139,92,246,0.06)",
        cursorSpot: "rgba(59,91,219,0.13)",
        cursorOuter: "rgba(107,132,240,0.05)",
      };
    };

    const rebuildPoints = () => {
      const cols = Math.ceil(bounds.w / DOT_GAP) + 2;
      const rows = Math.ceil(bounds.h / DOT_GAP) + 2;
      const offX = (bounds.w % DOT_GAP) / 2;
      const offY = (bounds.h % DOT_GAP) / 2;
      const next = [];

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          next.push({ x: offX + c * DOT_GAP, y: offY + r * DOT_GAP });
        }
      }

      points = next;
    };

    const rebuildSpots = () => {
      spots = Array.from({ length: SPOT_COUNT }, (_, i) => ({
        x: Math.random() * bounds.w,
        y: Math.random() * bounds.h,
        r: Math.random() * 240 + 200,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        phase: (i / SPOT_COUNT) * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

      bounds.w = rect.width;
      bounds.h = rect.height;

      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      target.x = rect.width / 2;
      target.y = rect.height / 2;
      mouse.x = rect.width / 2;
      mouse.y = rect.height / 2;

      rebuildPoints();
      rebuildSpots();
    };

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
    };

    const onLeave = () => {
      target.x = bounds.w / 2;
      target.y = bounds.h / 2;
    };

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      frame += 1;

      mouse.x += (target.x - mouse.x) * FOLLOW_EASE;
      mouse.y += (target.y - mouse.y) * FOLLOW_EASE;

      const t = frame * 0.008;
      const colors = palette();

      ctx.clearRect(0, 0, bounds.w, bounds.h);

      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, bounds.w, bounds.h);

      const blobs = [colors.spotA, colors.spotB, colors.spotC];
      spots.forEach((spot, index) => {
        spot.x += spot.vx;
        spot.y += spot.vy;

        if (spot.x < -spot.r) spot.x = bounds.w + spot.r;
        if (spot.x > bounds.w + spot.r) spot.x = -spot.r;
        if (spot.y < -spot.r) spot.y = bounds.h + spot.r;
        if (spot.y > bounds.h + spot.r) spot.y = -spot.r;

        const pulse = 1 + 0.12 * Math.sin(t * 0.9 + spot.phase);
        const radius = spot.r * pulse;
        const gradient = ctx.createRadialGradient(
          spot.x,
          spot.y,
          0,
          spot.x,
          spot.y,
          radius,
        );
        gradient.addColorStop(0, blobs[index % blobs.length]);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      const glow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        180,
      );
      glow.addColorStop(0, colors.cursorSpot);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, bounds.w, bounds.h);

      const outerGlow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        380,
      );
      outerGlow.addColorStop(0, colors.cursorOuter);
      outerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, bounds.w, bounds.h);

      for (const point of points) {
        const dist = Math.hypot(point.x - mouse.x, point.y - mouse.y);
        const prox = Math.max(0, 1 - dist / 220);
        const scale = 1 + prox * 2.2;

        if (prox > 0) {
          ctx.save();
          ctx.globalAlpha = 0.13 + prox * 0.87;
          ctx.fillStyle = colors.dotLit;
          ctx.beginPath();
          ctx.arc(point.x, point.y, DOT_R * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = colors.dot;
          ctx.beginPath();
          ctx.arc(point.x, point.y, DOT_R, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    resize();
    draw();

    if (parent) {
      parent.addEventListener("mousemove", onMove, { passive: true });
      parent.addEventListener("mouseleave", onLeave, { passive: true });
    }

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      if (parent) {
        parent.removeEventListener("mousemove", onMove);
        parent.removeEventListener("mouseleave", onLeave);
      }
    };
  }, [active]);

  return <canvas id="authBgCanvas" ref={canvasRef} />;
}

function ProjectCard({ project, data, onOpen }) {
  const tasks = data.tasks.filter((task) => task.projectId === project._id);
  const projectMembers = (data.pm[project._id] || []).map((member) =>
    data.members.find((user) => user._id === member.u),
  );

  const doneCount = tasks.filter((task) => task.status === "done").length;
  const progress = tasks.length
    ? Math.round((doneCount / tasks.length) * 100)
    : 0;

  return (
    <div className="pc" onClick={() => onOpen(project._id)}>
      <div className="pc-top">
        <div className="pc-emoji">{project.emoji}</div>
        <div>
          <div className="pc-name">{project.name}</div>
          <div className="pc-meta">
            {projectMembers.length} member
            {projectMembers.length !== 1 ? "s" : ""} · {tasks.length} task
            {tasks.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
      <div className="pc-desc">{project.description}</div>
      <div className="pc-foot">
        <div className="pb-wrap">
          <div className="pb-label">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="pb">
            <div className="pf" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="mpips">
          {projectMembers.slice(0, 4).map((member) =>
            member ? (
              <div key={member._id} className="mpip" title={member.name}>
                {member.initials}
              </div>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState(() => cloneInitialData());
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [activeProjectId, setActiveProjectId] = useState(
    INITIAL_DATA.projects[0]?._id || null,
  );
  const [projectTab, setProjectTab] = useState("tasks");
  const [taskFilter, setTaskFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("tf-theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  const [authTab, setAuthTab] = useState("login");
  const [isAppEntering, setIsAppEntering] = useState(false);
  const [loginDraft, setLoginDraft] = useState({
    email: "admin@camp.dev",
    password: "password123",
  });
  const [isSigning, setIsSigning] = useState(false);
  const [overlayPhase, setOverlayPhase] = useState("idle");

  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [taskProjectId, setTaskProjectId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [projectDraft, setProjectDraft] = useState({
    name: "",
    description: "",
    emoji: "📁",
  });
  const [taskDraft, setTaskDraft] = useState({
    title: "",
    description: "",
    status: "todo",
    assignedTo: "",
  });
  const [memberDraft, setMemberDraft] = useState({
    email: "",
    role: "member",
  });
  const [noteDraft, setNoteDraft] = useState({
    title: "",
    content: "",
  });
  const [subtaskTitle, setSubtaskTitle] = useState("");

  const [progressWidth, setProgressWidth] = useState(0);
  const progressTimeoutsRef = useRef([]);
  const overlayTimeoutsRef = useRef([]);

  const currentUser = useMemo(
    () => data.members.find((member) => member._id === currentUserId) || null,
    [data.members, currentUserId],
  );

  const activeProject = useMemo(
    () =>
      data.projects.find((project) => project._id === activeProjectId) || null,
    [data.projects, activeProjectId],
  );

  const activeTask = useMemo(
    () => data.tasks.find((task) => task._id === activeTaskId) || null,
    [data.tasks, activeTaskId],
  );

  useEffect(() => {
    document.body.classList.add("ready");

    return () => {
      document.body.classList.remove("ready");
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    try {
      localStorage.setItem("tf-theme", theme);
    } catch {
      // ignore quota/storage failures
    }
  }, [theme]);

  useEffect(() => {
    if (!modal) {
      return undefined;
    }

    const onEsc = (event) => {
      if (event.key === "Escape") {
        if (modal === "subtask") {
          setModal("task-detail");
          return;
        }
        setModal(null);
      }
    };

    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [modal]);

  useEffect(
    () => () => {
      progressTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      overlayTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    },
    [],
  );

  useEffect(() => {
    if (!data.projects.length) {
      setActiveProjectId(null);
      return;
    }

    const exists = data.projects.some(
      (project) => project._id === activeProjectId,
    );
    if (!exists) {
      setActiveProjectId(data.projects[0]._id);
    }
  }, [data.projects, activeProjectId]);

  const pushToast = useCallback((message, type = "inf") => {
    const id = buildId("toast");
    setToasts((prev) => [...prev, { id, message, type }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  const runProgress = useCallback(() => {
    progressTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    progressTimeoutsRef.current = [];

    setProgressWidth(0);
    requestAnimationFrame(() => {
      setProgressWidth(60);
    });

    progressTimeoutsRef.current.push(
      window.setTimeout(() => setProgressWidth(100), 220),
      window.setTimeout(() => setProgressWidth(0), 620),
    );
  }, []);

  const navigate = useCallback(
    (view) => {
      setActiveView(view);
      if (view !== "project-detail") {
        setProjectTab("tasks");
      }
      runProgress();
    },
    [runProgress],
  );

  const openProject = useCallback(
    (projectId) => {
      setActiveProjectId(projectId);
      setActiveView("project-detail");
      setProjectTab("tasks");
      runProgress();
    },
    [runProgress],
  );

  const beginLoginTransition = useCallback(() => {
    overlayTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    overlayTimeoutsRef.current = [];

    setOverlayPhase("closing");
    setIsAppEntering(true);

    overlayTimeoutsRef.current.push(
      window.setTimeout(() => {
        setCurrentUserId(data.members[0]._id);
        setActiveView("dashboard");
      }, 520),
      window.setTimeout(() => setOverlayPhase("opening"), 1060),
      window.setTimeout(() => {
        setOverlayPhase("idle");
        setIsAppEntering(false);
      }, 2000),
    );
  }, [data.members]);

  const doLogin = useCallback(() => {
    if (!loginDraft.email.trim() || !loginDraft.password.trim()) {
      pushToast("Please fill in all fields.", "err");
      return;
    }

    setIsSigning(true);
    window.setTimeout(() => {
      setIsSigning(false);
      beginLoginTransition();
    }, 420);
  }, [beginLoginTransition, loginDraft.email, loginDraft.password, pushToast]);

  const doRegister = useCallback(() => {
    pushToast("Account created! Welcome aboard.", "ok");
    setIsSigning(true);

    window.setTimeout(() => {
      setIsSigning(false);
      beginLoginTransition();
    }, 700);
  }, [beginLoginTransition, pushToast]);

  const doLogout = useCallback(() => {
    setCurrentUserId(null);
    setActiveView("dashboard");
    setSearchQuery("");
    setModal(null);
    setOverlayPhase("idle");
    pushToast("Signed out successfully.", "inf");
  }, [pushToast]);

  const openCreateProjectModal = useCallback(() => {
    setEditingProjectId(null);
    setProjectDraft({ name: "", description: "", emoji: "📁" });
    setModal("project");
  }, []);

  const openEditProjectModal = useCallback(() => {
    if (!activeProject) {
      return;
    }

    setEditingProjectId(activeProject._id);
    setProjectDraft({
      name: activeProject.name,
      description: activeProject.description,
      emoji: activeProject.emoji,
    });
    setModal("project");
  }, [activeProject]);

  const saveProject = useCallback(() => {
    const name = projectDraft.name.trim();
    if (!name) {
      pushToast("Project name is required.", "err");
      return;
    }

    const desc = projectDraft.description.trim();

    if (editingProjectId) {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.map((project) =>
          project._id === editingProjectId
            ? { ...project, name, description: desc, emoji: projectDraft.emoji }
            : project,
        ),
      }));
      pushToast("Project updated.", "ok");
      setModal(null);
      return;
    }

    const nextId = buildId("p");

    setData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          _id: nextId,
          name,
          description: desc,
          emoji: projectDraft.emoji,
          createdAt: new Date().toISOString(),
        },
      ],
      pm: {
        ...prev.pm,
        [nextId]: [{ u: currentUserId, r: "admin" }],
      },
      activity: [
        {
          action: "Project created",
          project: name,
          user: currentUser?.name || "You",
          time: "just now",
        },
        ...prev.activity,
      ].slice(0, 8),
    }));

    setActiveProjectId(nextId);
    setModal(null);
    pushToast("Project created.", "ok");
  }, [
    currentUser?.name,
    currentUserId,
    editingProjectId,
    projectDraft,
    pushToast,
  ]);

  const deleteCurrentProject = useCallback(() => {
    if (!activeProject) {
      return;
    }

    if (
      !window.confirm(
        "Delete this project and all its tasks and notes? This cannot be undone.",
      )
    ) {
      return;
    }

    const nextProjects = data.projects.filter(
      (project) => project._id !== activeProject._id,
    );

    setData((prev) => ({
      ...prev,
      projects: nextProjects,
      tasks: prev.tasks.filter((task) => task.projectId !== activeProject._id),
      notes: prev.notes.filter((note) => note.projectId !== activeProject._id),
      pm: Object.fromEntries(
        Object.entries(prev.pm).filter(
          ([projectId]) => projectId !== activeProject._id,
        ),
      ),
    }));

    setActiveProjectId(nextProjects[0]?._id || null);
    setActiveView("projects");
    setModal(null);
    pushToast("Project deleted.", "ok");
  }, [activeProject, data.projects, pushToast]);

  const openCreateTaskModal = useCallback(
    (projectId = activeProjectId) => {
      const targetProjectId = projectId || data.projects[0]?._id || null;
      if (!targetProjectId) {
        pushToast("Create a project first.", "err");
        return;
      }

      setTaskProjectId(targetProjectId);
      setTaskDraft({
        title: "",
        description: "",
        status: "todo",
        assignedTo: "",
      });
      setModal("task");
    },
    [activeProjectId, data.projects, pushToast],
  );

  const saveTask = useCallback(() => {
    const title = taskDraft.title.trim();
    if (!title) {
      pushToast("Task title is required.", "err");
      return;
    }

    if (!taskProjectId) {
      pushToast("Select a project for this task.", "err");
      return;
    }

    const projectName =
      data.projects.find((project) => project._id === taskProjectId)?.name ||
      "";

    setData((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          _id: buildId("t"),
          projectId: taskProjectId,
          title,
          description: taskDraft.description.trim(),
          status: taskDraft.status,
          assignedTo: taskDraft.assignedTo || null,
          subtasks: [],
          attachments: [],
          createdAt: new Date().toISOString(),
        },
      ],
      activity: [
        {
          action: "Task created",
          project: projectName,
          user: currentUser?.name || "You",
          time: "just now",
        },
        ...prev.activity,
      ].slice(0, 8),
    }));

    setModal(null);
    pushToast("Task created successfully.", "ok");
  }, [currentUser?.name, data.projects, pushToast, taskDraft, taskProjectId]);

  const openTaskDetail = useCallback((taskId) => {
    setActiveTaskId(taskId);
    setModal("task-detail");
  }, []);

  const updateTaskStatus = useCallback((taskId, nextStatus) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              status: nextStatus,
            }
          : task,
      ),
    }));
  }, []);

  const deleteTask = useCallback(() => {
    if (!activeTask) {
      return;
    }

    if (!window.confirm("Delete this task? This cannot be undone.")) {
      return;
    }

    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task._id !== activeTask._id),
    }));

    setModal(null);
    pushToast("Task deleted.", "ok");
  }, [activeTask, pushToast]);

  const toggleSubtask = useCallback((taskId, subtaskId) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask._id === subtaskId
                  ? { ...subtask, isCompleted: !subtask.isCompleted }
                  : subtask,
              ),
            }
          : task,
      ),
    }));
  }, []);

  const deleteSubtask = useCallback((taskId, subtaskId) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.filter(
                (subtask) => subtask._id !== subtaskId,
              ),
            }
          : task,
      ),
    }));
  }, []);

  const openSubtaskModal = useCallback(() => {
    setSubtaskTitle("");
    setModal("subtask");
  }, []);

  const saveSubtask = useCallback(() => {
    const title = subtaskTitle.trim();
    if (!title) {
      pushToast("Title is required.", "err");
      return;
    }

    if (!activeTaskId) {
      pushToast("Open a task before adding subtasks.", "err");
      return;
    }

    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task._id === activeTaskId
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                {
                  _id: buildId("st"),
                  title,
                  isCompleted: false,
                },
              ],
            }
          : task,
      ),
    }));

    setModal("task-detail");
    pushToast("Subtask added.", "ok");
  }, [activeTaskId, pushToast, subtaskTitle]);

  const openAddMemberModal = useCallback(() => {
    setMemberDraft({ email: "", role: "member" });
    setModal("member");
  }, []);

  const addMember = useCallback(() => {
    if (!activeProjectId) {
      pushToast("Select a project first.", "err");
      return;
    }

    const email = memberDraft.email.trim().toLowerCase();
    if (!email) {
      pushToast("Email address is required.", "err");
      return;
    }

    const user = data.members.find(
      (member) => member.email.toLowerCase() === email,
    );
    if (!user) {
      pushToast("No account found with that email.", "err");
      return;
    }

    const members = data.pm[activeProjectId] || [];
    if (members.some((member) => member.u === user._id)) {
      pushToast("This person is already a member.", "err");
      return;
    }

    setData((prev) => ({
      ...prev,
      pm: {
        ...prev.pm,
        [activeProjectId]: [
          ...(prev.pm[activeProjectId] || []),
          { u: user._id, r: memberDraft.role },
        ],
      },
    }));

    setModal(null);
    pushToast(`${user.name} added to the project.`, "ok");
  }, [activeProjectId, data.members, data.pm, memberDraft, pushToast]);

  const updateMemberRole = useCallback(
    (userId, role) => {
      if (!activeProjectId) {
        return;
      }

      setData((prev) => ({
        ...prev,
        pm: {
          ...prev.pm,
          [activeProjectId]: (prev.pm[activeProjectId] || []).map((member) =>
            member.u === userId ? { ...member, r: role } : member,
          ),
        },
      }));

      pushToast("Role updated.", "ok");
    },
    [activeProjectId, pushToast],
  );

  const removeMember = useCallback(
    (userId) => {
      if (!activeProjectId) {
        return;
      }

      if (!window.confirm("Remove this member from the project?")) {
        return;
      }

      setData((prev) => ({
        ...prev,
        pm: {
          ...prev.pm,
          [activeProjectId]: (prev.pm[activeProjectId] || []).filter(
            (member) => member.u !== userId,
          ),
        },
      }));

      pushToast("Member removed.", "ok");
    },
    [activeProjectId, pushToast],
  );

  const openCreateNoteModal = useCallback(() => {
    setEditingNoteId(null);
    setNoteDraft({ title: "", content: "" });
    setModal("note");
  }, []);

  const openEditNoteModal = useCallback(
    (noteId) => {
      if (currentUser?.role !== "admin") {
        pushToast("Only admins can edit notes.", "err");
        return;
      }

      const note = data.notes.find((item) => item._id === noteId);
      if (!note) {
        return;
      }

      setEditingNoteId(noteId);
      setNoteDraft({ title: note.title, content: note.content });
      setModal("note");
    },
    [currentUser?.role, data.notes, pushToast],
  );

  const saveNote = useCallback(() => {
    const title = noteDraft.title.trim();
    if (!title) {
      pushToast("Note title is required.", "err");
      return;
    }

    if (!activeProjectId) {
      pushToast("Select a project first.", "err");
      return;
    }

    if (editingNoteId) {
      setData((prev) => ({
        ...prev,
        notes: prev.notes.map((note) =>
          note._id === editingNoteId
            ? {
                ...note,
                title,
                content: noteDraft.content,
              }
            : note,
        ),
      }));
      pushToast("Note updated.", "ok");
      setModal(null);
      return;
    }

    setData((prev) => ({
      ...prev,
      notes: [
        ...prev.notes,
        {
          _id: buildId("n"),
          projectId: activeProjectId,
          title,
          content: noteDraft.content,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    setModal(null);
    pushToast("Note created.", "ok");
  }, [activeProjectId, editingNoteId, noteDraft, pushToast]);

  const deleteNote = useCallback(
    (noteId) => {
      if (!window.confirm("Delete this note?")) {
        return;
      }

      setData((prev) => ({
        ...prev,
        notes: prev.notes.filter((note) => note._id !== noteId),
      }));

      pushToast("Note deleted.", "ok");
    },
    [pushToast],
  );

  const runSearch = useCallback(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      navigate("projects");
      return;
    }

    const project = data.projects.find(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query),
    );

    if (project) {
      openProject(project._id);
      return;
    }

    pushToast("No projects match your search.", "inf");
  }, [data.projects, navigate, openProject, pushToast, searchQuery]);

  const topMeta = useMemo(() => {
    if (!currentUser) {
      return {
        title: "Dashboard",
        sub: "",
        cta: "+ New project",
        showCta: true,
      };
    }

    if (activeView === "dashboard") {
      return {
        title: "Dashboard",
        sub: currentUser.name.split(" ")[0],
        cta: "+ New project",
        showCta: true,
      };
    }

    if (activeView === "projects") {
      return {
        title: "Projects",
        sub: "All workspaces",
        cta: "+ New project",
        showCta: true,
      };
    }

    if (activeView === "project-detail") {
      return {
        title: activeProject?.name || "Project",
        sub: "",
        cta: "+ Add task",
        showCta: true,
      };
    }

    if (activeView === "tasks") {
      return {
        title: "My Tasks",
        sub: "Assigned to you",
        cta: "+ Add task",
        showCta: true,
      };
    }

    if (activeView === "members") {
      return {
        title: "Team",
        sub: "All members",
        cta: "",
        showCta: false,
      };
    }

    if (activeView === "health") {
      return {
        title: "System Health",
        sub: "",
        cta: "",
        showCta: false,
      };
    }

    return {
      title: "Profile",
      sub: "Your account",
      cta: "",
      showCta: false,
    };
  }, [activeProject?.name, activeView, currentUser]);

  const handleTopCta = useCallback(() => {
    if (activeView === "dashboard" || activeView === "projects") {
      openCreateProjectModal();
      return;
    }

    if (activeView === "project-detail") {
      openCreateTaskModal(activeProjectId);
      return;
    }

    if (activeView === "tasks") {
      const projectId = activeProjectId || data.projects[0]?._id || null;
      openCreateTaskModal(projectId);
    }
  }, [
    activeProjectId,
    activeView,
    data.projects,
    openCreateProjectModal,
    openCreateTaskModal,
  ]);

  const myTasks = useMemo(() => {
    if (!currentUserId) {
      return [];
    }

    return data.tasks.filter(
      (task) =>
        task.assignedTo === currentUserId &&
        (taskFilter === "all" || task.status === taskFilter),
    );
  }, [currentUserId, data.tasks, taskFilter]);

  const projectTasks = useMemo(
    () => data.tasks.filter((task) => task.projectId === activeProjectId),
    [data.tasks, activeProjectId],
  );

  const projectMembers = useMemo(() => {
    return (data.pm[activeProjectId] || [])
      .map((member) => {
        const user = data.members.find((item) => item._id === member.u);
        if (!user) {
          return null;
        }

        return {
          ...member,
          user,
        };
      })
      .filter(Boolean);
  }, [activeProjectId, data.members, data.pm]);

  const projectNotes = useMemo(
    () => data.notes.filter((note) => note.projectId === activeProjectId),
    [data.notes, activeProjectId],
  );

  const isProjectAdmin = useMemo(() => {
    if (!currentUser || !activeProjectId) {
      return false;
    }

    if (currentUser.role === "admin") {
      return true;
    }

    return (data.pm[activeProjectId] || []).some(
      (member) => member.u === currentUser._id && member.r === "admin",
    );
  }, [activeProjectId, currentUser, data.pm]);

  const sidebarTaskCount = useMemo(
    () => data.tasks.filter((task) => task.assignedTo === currentUserId).length,
    [data.tasks, currentUserId],
  );

  const dashboardDoneCount = useMemo(
    () => data.tasks.filter((task) => task.status === "done").length,
    [data.tasks],
  );

  const dashboardInProgressCount = useMemo(
    () => data.tasks.filter((task) => task.status === "in_progress").length,
    [data.tasks],
  );

  const detailTaskProject = useMemo(
    () =>
      data.projects.find((project) => project._id === activeTask?.projectId) ||
      null,
    [activeTask?.projectId, data.projects],
  );

  const detailTaskAssignee = useMemo(
    () =>
      data.members.find((member) => member._id === activeTask?.assignedTo) ||
      null,
    [activeTask?.assignedTo, data.members],
  );

  const memberOptions = useMemo(() => {
    if (!taskProjectId) {
      return [];
    }

    return (data.pm[taskProjectId] || [])
      .map((member) => data.members.find((user) => user._id === member.u))
      .filter(Boolean);
  }, [data.members, data.pm, taskProjectId]);

  const overlayClassName = useMemo(() => {
    if (overlayPhase === "idle") {
      return "";
    }

    return `react-active phase-${overlayPhase}`;
  }, [overlayPhase]);

  return (
    <>
      <div id="pbar" style={{ width: `${progressWidth}%` }} />

      <div className="tc-wr" id="tWrap" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`tst tst-${toast.type} tf-toast-enter`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <div id="loginOverlay" className={overlayClassName}>
        <div id="loginOverlayTop" />
        <div id="loginOverlayBot" />
        <div id="loginOverlaySeam" />
        <div id="loginOverlayLogo">
          <LogoMark size={52} />
          <span id="loginOverlayWord">TaskForge</span>
        </div>
      </div>

      <div className={`auth-scr ${!currentUser ? "show" : ""}`} id="authScr">
        <AuthBackground active={!currentUser} />
        <div className={`auth-box ${overlayPhase !== "idle" ? "fade-out" : ""}`} id="authBox">
          <div className="auth-logo">
            <LogoMark size={28} />
            <span
              style={{
                fontFamily: "var(--head)",
                fontSize: "15px",
                fontWeight: 800,
                letterSpacing: "-0.3px",
                paddingTop: "6px",
              }}
            >
              TaskForge
            </span>
          </div>

          <div className="auth-h">Sign in to your workspace.</div>
          <div className="auth-s">Manage projects, tasks, and your team.</div>

          <div className="auth-tabs">
            <div
              className={`auth-tab ${authTab === "login" ? "act" : ""}`}
              onClick={() => setAuthTab("login")}
            >
              Sign in
            </div>
            <div
              className={`auth-tab ${authTab === "register" ? "act" : ""}`}
              onClick={() => setAuthTab("register")}
            >
              Register
            </div>
          </div>

          {authTab === "login" ? (
            <div>
              <div className="fg">
                <label className="fl">Email address</label>
                <input
                  className="fi"
                  type="email"
                  value={loginDraft.email}
                  placeholder="you@company.com"
                  onChange={(event) =>
                    setLoginDraft((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="fg">
                <label className="fl">Password</label>
                <input
                  className="fi"
                  type="password"
                  value={loginDraft.password}
                  placeholder="••••••••"
                  onChange={(event) =>
                    setLoginDraft((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                />
              </div>

              <button
                className="btn btn-p"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "9px 13px",
                }}
                onClick={doLogin}
                disabled={isSigning}
              >
                {isSigning ? "Signing in..." : "Continue"}
              </button>
              <div className="auth-lnk">
                <a
                  onClick={() =>
                    pushToast("Password reset link sent to your email.", "ok")
                  }
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          ) : (
            <div>
              <div className="g2">
                <div className="fg">
                  <label className="fl">First name</label>
                  <input className="fi" type="text" placeholder="Ada" />
                </div>
                <div className="fg">
                  <label className="fl">Last name</label>
                  <input className="fi" type="text" placeholder="Lovelace" />
                </div>
              </div>

              <div className="fg">
                <label className="fl">Email address</label>
                <input
                  className="fi"
                  type="email"
                  placeholder="you@company.com"
                />
              </div>

              <div className="fg">
                <label className="fl">Password</label>
                <input
                  className="fi"
                  type="password"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <button
                className="btn btn-p"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "9px 13px",
                }}
                onClick={doRegister}
                disabled={isSigning}
              >
                {isSigning ? "Creating..." : "Create account"}
              </button>
            </div>
          )}
        </div>
      </div>

      {currentUser ? (
        <>
          <aside className={`sb ${isAppEntering ? "entering" : ""}`} id="sidebar">
            <div className="sb-logo">
              <div className="logo-mark">
                <LogoMark size={28} />
              </div>
              <span className="logo-name">TaskForge</span>
            </div>

            <div style={{ padding: "8px 6px 4px" }}>
              <div
                className={`ni ${activeView === "dashboard" ? "act" : ""}`}
                id="nav-dashboard"
                onClick={() => navigate("dashboard")}
              >
                <span className="ni-ico">
                  <LayoutDashboard size={16} />
                </span>
                <span className="ni-text">Dashboard</span>
              </div>

              <div
                className={`ni ${activeView === "projects" || activeView === "project-detail" ? "act" : ""}`}
                id="nav-projects"
                onClick={() => navigate("projects")}
              >
                <span className="ni-ico">
                  <FolderKanban size={16} />
                </span>
                <span className="ni-text">Projects</span>
                <span className="ni-ct" id="sbPC">
                  {data.projects.length}
                </span>
              </div>

              <div
                className={`ni ${activeView === "tasks" ? "act" : ""}`}
                id="nav-tasks"
                onClick={() => navigate("tasks")}
              >
                <span className="ni-ico">
                  <CheckSquare size={16} />
                </span>
                <span className="ni-text">My Tasks</span>
                <span className="ni-ct" id="sbTC">
                  {sidebarTaskCount}
                </span>
              </div>

              <div
                className={`ni ${activeView === "members" ? "act" : ""}`}
                id="nav-members"
                onClick={() => navigate("members")}
              >
                <span className="ni-ico">
                  <Users size={16} />
                </span>
                <span className="ni-text">Team</span>
              </div>
            </div>

            <div className="sb-sec">Workspaces</div>
            <div className="sb-projs" id="sbProjs">
              {data.projects.map((project) => (
                <div
                  key={project._id}
                  className={`pni ${activeProjectId === project._id ? "act" : ""}`}
                  onClick={() => openProject(project._id)}
                >
                  <div className="pni-dot" />
                  <span>{project.name}</span>
                </div>
              ))}
            </div>

            <div className="sb-foot">
              <div
                className={`ni ${activeView === "health" ? "act" : ""}`}
                id="nav-health"
                onClick={() => navigate("health")}
              >
                <span className="ni-ico">
                  <Activity size={16} />
                </span>
                <span>Health</span>
              </div>

              <div className="user-row" onClick={() => navigate("profile")}>
                <div className="u-av" id="sbAv">
                  {currentUser.initials}
                </div>
                <div>
                  <div className="u-name" id="sbN">
                    {currentUser.name}
                  </div>
                  <div className="u-role" id="sbR">
                    {roleLabel(currentUser.role)}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="main">
            <div className={`topbar ${isAppEntering ? "entering" : ""}`}>
              <div className="top-title" id="topT">
                {topMeta.title}
                <span className="top-sub" id="topS">
                  {topMeta.sub ? ` — ${topMeta.sub}` : ""}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="sw">
                  <span className="si">
                    <Search size={14} />
                  </span>
                  <input
                    className="sf"
                    type="text"
                    autoComplete="off"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        runSearch();
                      }
                    }}
                  />
                </div>

                <button
                  className="theme-toggle"
                  id="themeToggle"
                  onClick={() =>
                    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                  }
                  title="Toggle dark mode"
                >
                  <Moon className="icon-moon" />
                  <Sun className="icon-sun" />
                </button>

                <button
                  className="btn btn-p"
                  id="topCTA"
                  onClick={handleTopCta}
                  style={{ display: topMeta.showCta ? "inline-flex" : "none" }}
                >
                  {topMeta.cta}
                </button>
              </div>
            </div>

            <div className={`content ${isAppEntering ? "entering" : ""}`} id="contentArea">
              {activeView === "dashboard" ? (
                <div className="view act" id="v-dashboard">
                  <div className="stat-strip" id="statStrip">
                    <div className="sc">
                      <div className="sc-n" id="stP">
                        {data.projects.length}
                      </div>
                      <div className="sc-l">Total projects</div>
                    </div>
                    <div className="sc">
                      <div className="sc-n" id="stD">
                        {dashboardDoneCount}
                      </div>
                      <div className="sc-l">Tasks done</div>
                    </div>
                    <div className="sc">
                      <div className="sc-n" id="stI">
                        {dashboardInProgressCount}
                      </div>
                      <div className="sc-l">In progress</div>
                    </div>
                    <div className="sc">
                      <div className="sc-n" id="stM">
                        {data.members.length}
                      </div>
                      <div className="sc-l">Team members</div>
                    </div>
                  </div>

                  <div className="sh">
                    <span className="sh-t">Recent projects</span>
                    <span className="sh-a" onClick={() => navigate("projects")}>
                      View all →
                    </span>
                  </div>

                  <div className="proj-grid" id="dashPG">
                    {data.projects.slice(0, 4).map((project) => (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        data={data}
                        onOpen={openProject}
                      />
                    ))}
                  </div>

                  <div className="sh mt">
                    <span className="sh-t">Recent activity</span>
                  </div>

                  <div className="tw">
                    <table>
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>Project</th>
                          <th>By</th>
                          <th>When</th>
                        </tr>
                      </thead>
                      <tbody id="actB">
                        {data.activity.map((item, index) => (
                          <tr key={`${item.action}-${item.time}-${index}`}>
                            <td>{item.action}</td>
                            <td style={{ color: "var(--ink3)" }}>
                              {item.project}
                            </td>
                            <td>{item.user}</td>
                            <td
                              style={{
                                color: "var(--ink3)",
                                fontFamily: "var(--mono)",
                                fontSize: "11.5px",
                              }}
                            >
                              {item.time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {activeView === "projects" ? (
                <div className="view act" id="v-projects">
                  <div className="sh">
                    <span className="sh-t">All projects</span>
                    <span
                      className="badge b-gray"
                      id="pjCt"
                      style={{ fontFamily: "var(--mono)" }}
                    >
                      {data.projects.length}
                    </span>
                  </div>

                  <div className="proj-grid" id="allPG">
                    {data.projects.map((project) => (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        data={data}
                        onOpen={openProject}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {activeView === "project-detail" && activeProject ? (
                <div className="view act" id="v-project-detail">
                  <div className="dback" onClick={() => navigate("projects")}>
                    ← Back to projects
                  </div>

                  <div className="dhead" id="dhead">
                    <div className="d-em" id="dEm">
                      {activeProject.emoji}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="d-title" id="dTi">
                        {activeProject.name}
                      </div>
                      <div className="d-desc" id="dDe">
                        {activeProject.description}
                      </div>
                      <div className="d-chips" id="dCh">
                        <span className="badge b-gray">
                          {projectTasks.length} task
                          {projectTasks.length !== 1 ? "s" : ""}
                        </span>
                        <span className="badge b-green">
                          {
                            projectTasks.filter(
                              (task) => task.status === "done",
                            ).length
                          }{" "}
                          done
                        </span>
                        <span className="badge b-gray">
                          {projectMembers.length} member
                          {projectMembers.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                      <button
                        className="btn btn-g"
                        id="ePjBtn"
                        onClick={openEditProjectModal}
                        style={{
                          display: isProjectAdmin ? "inline-flex" : "none",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-g"
                        id="dPjBtn"
                        style={{
                          color: "var(--red)",
                          borderColor: "var(--red-br)",
                          display: isProjectAdmin ? "inline-flex" : "none",
                        }}
                        onClick={deleteCurrentProject}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="dtabs">
                    <div
                      className={`dt ${projectTab === "tasks" ? "act" : ""}`}
                      id="dtab-tasks"
                      onClick={() => setProjectTab("tasks")}
                    >
                      Tasks
                    </div>
                    <div
                      className={`dt ${projectTab === "members" ? "act" : ""}`}
                      id="dtab-members"
                      onClick={() => setProjectTab("members")}
                    >
                      Members
                    </div>
                    <div
                      className={`dt ${projectTab === "notes" ? "act" : ""}`}
                      id="dtab-notes"
                      onClick={() => setProjectTab("notes")}
                    >
                      Notes
                    </div>
                  </div>

                  {projectTab === "tasks" ? (
                    <div id="dTasks">
                      <div className="sh">
                        <span className="sh-t">Task board</span>
                        <button
                          className="btn btn-p"
                          onClick={() => openCreateTaskModal(activeProjectId)}
                        >
                          + Add task
                        </button>
                      </div>

                      <div className="board">
                        {[
                          {
                            status: "todo",
                            label: "Todo",
                            color: "var(--ink3)",
                            counterId: "cTo",
                          },
                          {
                            status: "in_progress",
                            label: "In Progress",
                            color: "var(--amber)",
                            counterId: "cIp",
                          },
                          {
                            status: "done",
                            label: "Done",
                            color: "var(--green)",
                            counterId: "cDo",
                          },
                        ].map((column) => {
                          const tasksInColumn = projectTasks.filter(
                            (task) => task.status === column.status,
                          );

                          return (
                            <div key={column.status} className="bc">
                              <div className="bc-h">
                                <div
                                  className="bc-dot"
                                  style={{ background: column.color }}
                                />
                                <span className="bc-l">{column.label}</span>
                                <span className="bc-n" id={column.counterId}>
                                  {tasksInColumn.length}
                                </span>
                              </div>
                              <div className="bc-b" id={`col-${column.status}`}>
                                {tasksInColumn.length ? (
                                  tasksInColumn.map((task) => {
                                    const assignee = data.members.find(
                                      (member) =>
                                        member._id === task.assignedTo,
                                    );
                                    const doneSubtasks = task.subtasks.filter(
                                      (subtask) => subtask.isCompleted,
                                    ).length;

                                    return (
                                      <div
                                        key={task._id}
                                        className="tc"
                                        onClick={() => openTaskDetail(task._id)}
                                      >
                                        <div className="tc-t">{task.title}</div>
                                        <div className="tc-m">
                                          {task.subtasks.length ? (
                                            <span className="tc-sc">
                                              {doneSubtasks}/
                                              {task.subtasks.length}
                                            </span>
                                          ) : null}
                                          <div className="tc-av">
                                            {assignee ? assignee.initials : "—"}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div
                                    style={{
                                      padding: 14,
                                      textAlign: "center",
                                      fontSize: 12,
                                      color: "var(--ink4)",
                                    }}
                                  >
                                    No tasks
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {projectTab === "members" ? (
                    <div id="dMembers">
                      <div className="sh">
                        <span className="sh-t">Project members</span>
                        <button
                          className="btn btn-p"
                          id="aMBtn"
                          style={{
                            display: isProjectAdmin ? "inline-flex" : "none",
                          }}
                          onClick={openAddMemberModal}
                        >
                          + Add member
                        </button>
                      </div>

                      <div className="tw">
                        <table>
                          <thead>
                            <tr>
                              <th>Member</th>
                              <th>Email</th>
                              <th>Role</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody id="mBody">
                            {projectMembers.length ? (
                              projectMembers.map((member) => {
                                const canEditRole =
                                  currentUser?.role === "admin" &&
                                  member.user._id !== currentUser._id;
                                const roleBadge =
                                  member.r === "admin"
                                    ? "b-red"
                                    : member.r === "project_admin"
                                      ? "b-amber"
                                      : "b-gray";

                                return (
                                  <tr key={member.user._id}>
                                    <td>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 9,
                                        }}
                                      >
                                        <div
                                          className="u-av"
                                          style={{
                                            width: 28,
                                            height: 28,
                                            fontSize: 11,
                                          }}
                                        >
                                          {member.user.initials}
                                        </div>
                                        {member.user.name}
                                      </div>
                                    </td>
                                    <td
                                      style={{
                                        color: "var(--ink3)",
                                        fontFamily: "var(--mono)",
                                        fontSize: 12,
                                      }}
                                    >
                                      {member.user.email}
                                    </td>
                                    <td>
                                      <span className={`badge ${roleBadge}`}>
                                        {member.r === "admin"
                                          ? "admin"
                                          : member.r === "project_admin"
                                            ? "project admin"
                                            : "member"}
                                      </span>
                                    </td>
                                    <td>
                                      {canEditRole ? (
                                        <>
                                          <select
                                            className="fs"
                                            style={{
                                              width: "auto",
                                              fontSize: 12,
                                              padding: "4px 8px",
                                            }}
                                            value={member.r}
                                            onChange={(event) =>
                                              updateMemberRole(
                                                member.user._id,
                                                event.target.value,
                                              )
                                            }
                                          >
                                            <option value="member">
                                              Member
                                            </option>
                                            <option value="project_admin">
                                              Project Admin
                                            </option>
                                          </select>
                                          <button
                                            className="btn btn-b"
                                            style={{
                                              color: "var(--red)",
                                              fontSize: 12,
                                            }}
                                            onClick={() =>
                                              removeMember(member.user._id)
                                            }
                                          >
                                            Remove
                                          </button>
                                        </>
                                      ) : (
                                        <span
                                          style={{
                                            color: "var(--ink4)",
                                            fontSize: 12,
                                          }}
                                        >
                                          —
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="4">
                                  <div className="empty">
                                    <div className="empty-ico">👥</div>
                                    <div className="empty-t">
                                      No members yet.
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}

                  {projectTab === "notes" ? (
                    <div id="dNotes">
                      <div className="sh">
                        <span className="sh-t">Project notes</span>
                        <button
                          className="btn btn-p"
                          id="aNBtn"
                          style={{
                            display: isProjectAdmin ? "inline-flex" : "none",
                          }}
                          onClick={openCreateNoteModal}
                        >
                          + Add note
                        </button>
                      </div>

                      <div className="ng" id="nGrid">
                        {projectNotes.length ? (
                          projectNotes.map((note, index) => (
                            <div
                              key={note._id}
                              className="nc"
                              onClick={() => openEditNoteModal(note._id)}
                            >
                              <div
                                className="nc-stripe"
                                style={{
                                  background:
                                    NC_COLORS[index % NC_COLORS.length],
                                }}
                              />
                              <div className="nc-t">{note.title}</div>
                              <div
                                className="nc-b"
                                style={{ whiteSpace: "pre-line" }}
                              >
                                {note.content}
                              </div>
                              <div className="nc-f">
                                <span className="nc-d">
                                  {fmtDate(note.createdAt)}
                                </span>
                                {currentUser?.role === "admin" ? (
                                  <button
                                    className="btn btn-b"
                                    style={{
                                      color: "var(--red)",
                                      fontSize: 11,
                                      padding: "2px 6px",
                                    }}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      deleteNote(note._id);
                                    }}
                                  >
                                    Delete
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="empty">
                            <div className="empty-ico">📝</div>
                            <div className="empty-t">No notes yet.</div>
                            <div className="empty-s">
                              Add project documentation and references.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {activeView === "tasks" ? (
                <div className="view act" id="v-tasks">
                  <div className="sh">
                    <span className="sh-t">My tasks</span>
                    <select
                      className="fi"
                      style={{
                        width: "auto",
                        fontSize: 12.5,
                        padding: "5px 10px",
                      }}
                      value={taskFilter}
                      onChange={(event) => setTaskFilter(event.target.value)}
                    >
                      <option value="all">All status</option>
                      <option value="todo">Todo</option>
                      <option value="in_progress">In progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div className="tw">
                    <table>
                      <thead>
                        <tr>
                          <th>Task</th>
                          <th>Project</th>
                          <th>Status</th>
                          <th>Subtasks</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody id="myTB">
                        {myTasks.length ? (
                          myTasks.map((task) => {
                            const project = data.projects.find(
                              (item) => item._id === task.projectId,
                            );
                            const doneSubtasks = task.subtasks.filter(
                              (subtask) => subtask.isCompleted,
                            ).length;

                            return (
                              <tr key={task._id}>
                                <td style={{ fontWeight: 500 }}>
                                  {task.title}
                                </td>
                                <td style={{ color: "var(--ink3)" }}>
                                  {project
                                    ? `${project.emoji} ${project.name}`
                                    : "—"}
                                </td>
                                <td>
                                  <span
                                    className={`badge ${STATUS_BADGE[task.status]}`}
                                  >
                                    {STATUS_LABEL[task.status]}
                                  </span>
                                </td>
                                <td
                                  style={{
                                    color: "var(--ink3)",
                                    fontFamily: "var(--mono)",
                                    fontSize: "11.5px",
                                  }}
                                >
                                  {doneSubtasks}/{task.subtasks.length}
                                </td>
                                <td>
                                  <button
                                    className="btn btn-b"
                                    style={{ fontSize: 12 }}
                                    onClick={() => openTaskDetail(task._id)}
                                  >
                                    Open →
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5">
                              <div className="empty">
                                <div className="empty-ico">✓</div>
                                <div className="empty-t">No tasks found.</div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {activeView === "members" ? (
                <div className="view act" id="v-members">
                  <div className="sh">
                    <span className="sh-t">Team overview</span>
                  </div>

                  <div className="tw">
                    <table>
                      <thead>
                        <tr>
                          <th>Member</th>
                          <th>Email</th>
                          <th>Projects</th>
                          <th>Tasks</th>
                          <th>Role</th>
                        </tr>
                      </thead>
                      <tbody id="gmBody">
                        {data.members.map((member) => {
                          const projectCount = Object.values(data.pm).filter(
                            (projectMembersList) =>
                              projectMembersList.some(
                                (projectMember) =>
                                  projectMember.u === member._id,
                              ),
                          ).length;
                          const assignedTasks = data.tasks.filter(
                            (task) => task.assignedTo === member._id,
                          ).length;

                          return (
                            <tr key={member._id}>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 9,
                                  }}
                                >
                                  <div
                                    className="u-av"
                                    style={{
                                      width: 28,
                                      height: 28,
                                      fontSize: 11,
                                    }}
                                  >
                                    {member.initials}
                                  </div>
                                  {member.name}
                                </div>
                              </td>
                              <td
                                style={{
                                  color: "var(--ink3)",
                                  fontFamily: "var(--mono)",
                                  fontSize: 12,
                                }}
                              >
                                {member.email}
                              </td>
                              <td
                                style={{
                                  color: "var(--ink2)",
                                  fontFamily: "var(--mono)",
                                }}
                              >
                                {projectCount}
                              </td>
                              <td
                                style={{
                                  color: "var(--ink2)",
                                  fontFamily: "var(--mono)",
                                }}
                              >
                                {assignedTasks}
                              </td>
                              <td>
                                <span
                                  className={`badge ${
                                    member.role === "admin"
                                      ? "b-red"
                                      : member.role === "project_admin"
                                        ? "b-amber"
                                        : "b-gray"
                                  }`}
                                >
                                  {roleLabel(member.role)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {activeView === "health" ? (
                <div className="view act" id="v-health">
                  <div className="sh">
                    <span className="sh-t">System health</span>
                  </div>

                  <div className="health-banner">
                    <div className="hpulse" />
                    <div>
                      <div className="hl">
                        API server — all systems operational
                      </div>
                      <div className="hs">
                        GET /api/v1/healthcheck · v1.0.0 · ~12ms
                      </div>
                    </div>
                    <span
                      className="badge b-green"
                      style={{ marginLeft: "auto" }}
                    >
                      <span className="b-dot" />
                      Online
                    </span>
                  </div>

                  <div className="stat-strip" style={{ marginBottom: 24 }}>
                    <div className="sc">
                      <div className="sc-n" style={{ fontSize: 24 }}>
                        12ms
                      </div>
                      <div className="sc-l">Response time</div>
                    </div>
                    <div className="sc">
                      <div className="sc-n" style={{ fontSize: 24 }}>
                        99.9%
                      </div>
                      <div className="sc-l">Uptime</div>
                    </div>
                    <div className="sc">
                      <div
                        className="sc-n"
                        style={{ fontSize: 24 }}
                        id="epCount"
                      >
                        {EP_DATA.length}
                      </div>
                      <div className="sc-l">Endpoints</div>
                    </div>
                    <div className="sc">
                      <div className="sc-n" style={{ fontSize: 24 }}>
                        1.0.0
                      </div>
                      <div className="sc-l">API version</div>
                    </div>
                  </div>

                  <div className="sh">
                    <span className="sh-t">API endpoints</span>
                  </div>

                  <div className="tw">
                    <table>
                      <thead>
                        <tr>
                          <th>Method</th>
                          <th>Path</th>
                          <th>Description</th>
                          <th>Auth</th>
                        </tr>
                      </thead>
                      <tbody id="epBody">
                        {EP_DATA.map((endpoint) => (
                          <tr key={`${endpoint.m}-${endpoint.p}`}>
                            <td>
                              <span
                                className={`badge ${METHOD_BADGE[endpoint.m] || "b-gray"}`}
                              >
                                {endpoint.m}
                              </span>
                            </td>
                            <td>
                              <code
                                style={{
                                  fontFamily: "var(--mono)",
                                  fontSize: "11.5px",
                                  background: "var(--surface2)",
                                  padding: "2px 7px",
                                  borderRadius: 3,
                                  border: "1px solid var(--border)",
                                }}
                              >
                                {endpoint.p}
                              </code>
                            </td>
                            <td
                              style={{
                                color: "var(--ink3)",
                                fontSize: "12.5px",
                              }}
                            >
                              {endpoint.d}
                            </td>
                            <td>
                              {endpoint.a ? (
                                <span className="badge b-amber">JWT</span>
                              ) : (
                                <span
                                  style={{ color: "var(--ink4)", fontSize: 12 }}
                                >
                                  —
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {activeView === "profile" ? (
                <div className="view act" id="v-profile">
                  <div style={{ maxWidth: 500 }}>
                    <div className="sh">
                      <span className="sh-t">Your profile</span>
                    </div>

                    <div className="pcard">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 13,
                          marginBottom: 16,
                        }}
                      >
                        <div
                          className="u-av"
                          style={{ width: 40, height: 40, fontSize: 15 }}
                          id="prAv"
                        >
                          {currentUser.initials}
                        </div>
                        <div>
                          <div
                            style={{ fontWeight: 700, fontSize: 14 }}
                            id="prN"
                          >
                            {currentUser.name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--ink3)",
                              fontFamily: "var(--mono)",
                            }}
                            id="prE"
                          >
                            {currentUser.email}
                          </div>
                          <div style={{ marginTop: 5 }} id="prRo">
                            <span
                              className={`badge ${
                                currentUser.role === "admin"
                                  ? "b-red"
                                  : currentUser.role === "project_admin"
                                    ? "b-amber"
                                    : "b-gray"
                              }`}
                            >
                              {roleLabel(currentUser.role)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <hr className="div" />

                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          marginBottom: 12,
                        }}
                      >
                        Change password
                      </div>

                      <div className="fg">
                        <label className="fl">Current password</label>
                        <input
                          className="fi"
                          type="password"
                          autoComplete="current-password"
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="fg">
                        <label className="fl">New password</label>
                        <input
                          className="fi"
                          type="password"
                          autoComplete="new-password"
                          placeholder="Minimum 8 characters"
                        />
                      </div>

                      <button
                        className="btn btn-p"
                        onClick={() =>
                          pushToast("Password updated successfully.", "ok")
                        }
                      >
                        Update password
                      </button>
                    </div>

                    <button
                      className="btn btn-g"
                      style={{
                        color: "var(--red)",
                        borderColor: "var(--red-br)",
                      }}
                      onClick={doLogout}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </main>
        </>
      ) : null}

      <div
        className={`mo ${modal === "project" ? "open" : ""}`}
        id="mProject"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setModal(null);
          }
        }}
      >
        <div className="md">
          <div className="mh">
            <div className="m-title" id="mPjT">
              {editingProjectId ? "Edit project" : "New project"}
            </div>
            <button className="btn btn-b" onClick={() => setModal(null)}>
              ✕
            </button>
          </div>
          <div className="mb">
            <div className="fg">
              <label className="fl">Project name</label>
              <input
                className="fi"
                id="pN"
                placeholder="e.g. Website Redesign"
                value={projectDraft.name}
                onChange={(event) =>
                  setProjectDraft((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </div>

            <div className="fg">
              <label className="fl">Description</label>
              <textarea
                className="ft"
                id="pD"
                placeholder="What is this project about?"
                value={projectDraft.description}
                onChange={(event) =>
                  setProjectDraft((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </div>

            <div className="fg">
              <label className="fl">Icon</label>
              <div className="ep" id="epick">
                {EMOJIS.map((emoji) => (
                  <div
                    key={emoji}
                    className={`epi ${emoji === projectDraft.emoji ? "sel" : ""}`}
                    onClick={() =>
                      setProjectDraft((prev) => ({
                        ...prev,
                        emoji,
                      }))
                    }
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-g" onClick={() => setModal(null)}>
              Cancel
            </button>
            <button className="btn btn-p" id="savePjB" onClick={saveProject}>
              {editingProjectId ? "Save changes" : "Create project"}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`mo ${modal === "task" ? "open" : ""}`}
        id="mTask"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setModal(null);
          }
        }}
      >
        <div className="md lg">
          <div className="mh">
            <div className="m-title">New task</div>
            <button className="btn btn-b" onClick={() => setModal(null)}>
              ✕
            </button>
          </div>
          <div className="mb">
            <div className="fg">
              <label className="fl">Task title</label>
              <input
                className="fi"
                id="tT"
                placeholder="What needs to be done?"
                value={taskDraft.title}
                onChange={(event) =>
                  setTaskDraft((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
              />
            </div>
            <div className="fg">
              <label className="fl">Description</label>
              <textarea
                className="ft"
                id="tDe"
                placeholder="Add more context..."
                value={taskDraft.description}
                onChange={(event) =>
                  setTaskDraft((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </div>
            <div className="g2">
              <div className="fg">
                <label className="fl">Status</label>
                <select
                  className="fs"
                  id="tSt"
                  value={taskDraft.status}
                  onChange={(event) =>
                    setTaskDraft((prev) => ({
                      ...prev,
                      status: event.target.value,
                    }))
                  }
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="fg">
                <label className="fl">Assign to</label>
                <select
                  className="fs"
                  id="tAs"
                  value={taskDraft.assignedTo}
                  onChange={(event) =>
                    setTaskDraft((prev) => ({
                      ...prev,
                      assignedTo: event.target.value,
                    }))
                  }
                >
                  <option value="">Unassigned</option>
                  {memberOptions.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-g" onClick={() => setModal(null)}>
              Cancel
            </button>
            <button className="btn btn-p" onClick={saveTask}>
              Create task
            </button>
          </div>
        </div>
      </div>

      <div
        className={`mo ${modal === "task-detail" ? "open" : ""}`}
        id="mTaskD"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setModal(null);
          }
        }}
      >
        <div className="md lg">
          <div className="mh">
            <div>
              <div className="m-title" id="tdT">
                {activeTask?.title || "—"}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--ink3)",
                  marginTop: 3,
                  fontFamily: "var(--mono)",
                }}
                id="tdP"
              >
                {detailTaskProject
                  ? `${detailTaskProject.emoji} ${detailTaskProject.name}`
                  : ""}
              </div>
            </div>
            <button className="btn btn-b" onClick={() => setModal(null)}>
              ✕
            </button>
          </div>
          <div className="mb">
            <div
              style={{
                fontSize: 13,
                color: "var(--ink3)",
                marginBottom: 14,
                lineHeight: 1.6,
              }}
              id="tdDe"
            >
              {activeTask?.description || "No description provided."}
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 18,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <select
                className="fs"
                style={{ width: "auto" }}
                id="tdSt"
                value={activeTask?.status || "todo"}
                onChange={(event) => {
                  if (!activeTask) {
                    return;
                  }
                  updateTaskStatus(activeTask._id, event.target.value);
                }}
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
              <span
                id="tdAs"
                style={{
                  fontSize: 12.5,
                  color: "var(--ink3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {detailTaskAssignee ? (
                  <>
                    <div
                      className="u-av"
                      style={{ width: 20, height: 20, fontSize: 8 }}
                    >
                      {detailTaskAssignee.initials}
                    </div>
                    {detailTaskAssignee.name}
                  </>
                ) : (
                  <span style={{ color: "var(--ink4)" }}>Unassigned</span>
                )}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 9,
              }}
            >
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "var(--ink2)",
                }}
              >
                Subtasks
              </div>
              <button
                className="btn btn-b"
                style={{ fontSize: 12 }}
                onClick={openSubtaskModal}
              >
                + Add subtask
              </button>
            </div>

            <div
              id="tdSts"
              style={{ display: "flex", flexDirection: "column", gap: 5 }}
            >
              {activeTask?.subtasks?.length ? (
                activeTask.subtasks.map((subtask) => (
                  <div className="str" key={subtask._id}>
                    <input
                      type="checkbox"
                      checked={subtask.isCompleted}
                      onChange={() =>
                        toggleSubtask(activeTask._id, subtask._id)
                      }
                    />
                    <span
                      className={`st-t ${subtask.isCompleted ? "done" : ""}`}
                    >
                      {subtask.title}
                    </span>
                    <button
                      onClick={() => deleteSubtask(activeTask._id, subtask._id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--ink3)",
                        cursor: "pointer",
                        fontSize: 13,
                        padding: "0 4px",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    color: "var(--ink3)",
                    fontSize: 12.5,
                    padding: "10px 0",
                    textAlign: "center",
                  }}
                >
                  No subtasks yet.
                </div>
              )}
            </div>
          </div>
          <div className="mf">
            <button
              className="btn btn-b"
              style={{ color: "var(--red)", marginRight: "auto" }}
              onClick={deleteTask}
            >
              Delete task
            </button>
            <button className="btn btn-g" onClick={() => setModal(null)}>
              Close
            </button>
          </div>
        </div>
      </div>

      <div
        className={`mo ${modal === "member" ? "open" : ""}`}
        id="mMember"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setModal(null);
          }
        }}
      >
        <div className="md">
          <div className="mh">
            <div className="m-title">Add team member</div>
            <button className="btn btn-b" onClick={() => setModal(null)}>
              ✕
            </button>
          </div>
          <div className="mb">
            <div className="fg">
              <label className="fl">Email address</label>
              <input
                className="fi"
                id="mEm"
                type="email"
                placeholder="member@company.com"
                value={memberDraft.email}
                onChange={(event) =>
                  setMemberDraft((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
              />
              <div className="fh">The user must already have an account.</div>
            </div>
            <div className="fg">
              <label className="fl">Role</label>
              <select
                className="fs"
                id="mRo"
                value={memberDraft.role}
                onChange={(event) =>
                  setMemberDraft((prev) => ({
                    ...prev,
                    role: event.target.value,
                  }))
                }
              >
                <option value="member">Member</option>
                <option value="project_admin">Project Admin</option>
              </select>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-g" onClick={() => setModal(null)}>
              Cancel
            </button>
            <button className="btn btn-p" onClick={addMember}>
              Add member
            </button>
          </div>
        </div>
      </div>

      <div
        className={`mo ${modal === "note" ? "open" : ""}`}
        id="mNote"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setModal(null);
          }
        }}
      >
        <div className="md lg">
          <div className="mh">
            <div className="m-title" id="mNT">
              {editingNoteId ? "Edit note" : "New note"}
            </div>
            <button className="btn btn-b" onClick={() => setModal(null)}>
              ✕
            </button>
          </div>
          <div className="mb">
            <div className="fg">
              <label className="fl">Title</label>
              <input
                className="fi"
                id="nTi"
                placeholder="Note title"
                value={noteDraft.title}
                onChange={(event) =>
                  setNoteDraft((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
              />
            </div>
            <div className="fg">
              <label className="fl">Content</label>
              <textarea
                className="ft"
                style={{ minHeight: 150 }}
                id="nCo"
                placeholder="Write your note..."
                value={noteDraft.content}
                onChange={(event) =>
                  setNoteDraft((prev) => ({
                    ...prev,
                    content: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-g" onClick={() => setModal(null)}>
              Cancel
            </button>
            <button className="btn btn-p" onClick={saveNote}>
              Save note
            </button>
          </div>
        </div>
      </div>

      <div
        className={`mo ${modal === "subtask" ? "open" : ""}`}
        id="mSubtask"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setModal("task-detail");
          }
        }}
      >
        <div className="md">
          <div className="mh">
            <div className="m-title">Add subtask</div>
            <button
              className="btn btn-b"
              onClick={() => setModal("task-detail")}
            >
              ✕
            </button>
          </div>
          <div className="mb">
            <div className="fg">
              <label className="fl">Subtask title</label>
              <input
                className="fi"
                id="stTi"
                placeholder="What needs to be done?"
                value={subtaskTitle}
                onChange={(event) => setSubtaskTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="mf">
            <button
              className="btn btn-g"
              onClick={() => setModal("task-detail")}
            >
              Cancel
            </button>
            <button className="btn btn-p" onClick={saveSubtask}>
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
