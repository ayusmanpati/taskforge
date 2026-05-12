import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { INITIAL_DATA } from "../constants.js";
import { cloneInitialData, buildId } from "../utils/helpers.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
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
    if (!currentUser) {
      return false;
    }

    return currentUser.role === "admin";
  }, [currentUser]);

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

  const appState = {
    data,
    setData,
    currentUserId,
    setCurrentUserId,
    activeView,
    setActiveView,
    activeProjectId,
    setActiveProjectId,
    projectTab,
    setProjectTab,
    taskFilter,
    setTaskFilter,
    searchQuery,
    setSearchQuery,
    theme,
    setTheme,
    authTab,
    setAuthTab,
    isAppEntering,
    setIsAppEntering,
    loginDraft,
    setLoginDraft,
    isSigning,
    setIsSigning,
    overlayPhase,
    setOverlayPhase,
    toasts,
    setToasts,
    modal,
    setModal,
    activeTaskId,
    setActiveTaskId,
    editingProjectId,
    setEditingProjectId,
    taskProjectId,
    setTaskProjectId,
    editingNoteId,
    setEditingNoteId,
    projectDraft,
    setProjectDraft,
    taskDraft,
    setTaskDraft,
    memberDraft,
    setMemberDraft,
    noteDraft,
    setNoteDraft,
    subtaskTitle,
    setSubtaskTitle,
    progressWidth,
    setProgressWidth,
    progressTimeoutsRef,
    overlayTimeoutsRef,
    currentUser,
    activeProject,
    activeTask,
    pushToast,
    runProgress,
    navigate,
    openProject,
    beginLoginTransition,
    doLogin,
    doRegister,
    doLogout,
    openCreateProjectModal,
    openEditProjectModal,
    saveProject,
    deleteCurrentProject,
    openCreateTaskModal,
    saveTask,
    openTaskDetail,
    updateTaskStatus,
    deleteTask,
    toggleSubtask,
    deleteSubtask,
    openSubtaskModal,
    saveSubtask,
    openAddMemberModal,
    addMember,
    updateMemberRole,
    removeMember,
    openCreateNoteModal,
    openEditNoteModal,
    saveNote,
    deleteNote,
    runSearch,
    topMeta,
    handleTopCta,
    myTasks,
    projectTasks,
    projectMembers,
    projectNotes,
    isProjectAdmin,
    sidebarTaskCount,
    dashboardDoneCount,
    dashboardInProgressCount,
    detailTaskProject,
    detailTaskAssignee,
    memberOptions,
    overlayClassName,
  };

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
