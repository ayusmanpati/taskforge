import React from "react";
import { useApp } from "../../context/AppContext.jsx";
import { ProjectCard } from "../common/ProjectCard.jsx";
import { roleLabel, fmtDate } from "../../utils/helpers.js";
import {
  EP_DATA,
  METHOD_BADGE,
  NC_COLORS,
  STATUS_BADGE,
  STATUS_LABEL,
} from "../../constants.js";
import { FileText, MoreVertical, MessageSquare } from "lucide-react";

export function MainView() {
  const {
    isAppEntering,
    activeView,
    data,
    dashboardDoneCount,
    dashboardInProgressCount,
    navigate,
    openProject,
    currentUser,
    activeProject,
    openEditProjectModal,
    handleTopCta,
    projectTab,
    setProjectTab,
    projectMembers,
    openAddMemberModal,
    projectTasks,
    taskFilter,
    setTaskFilter,
    toggleSubtask,
    updateTaskStatus,
    openTaskDetail,
    projectNotes,
    openCreateNoteModal,
    openEditNoteModal,
    deleteNote,
    myTasks,
    modal,
    setModal,
    deleteCurrentProject,
    openCreateTaskModal,
    updateMemberRole,
    removeMember,
    isProjectAdmin,
    pushToast,
    doLogout,
  } = useApp();

  return (
    <div
      className={`content ${isAppEntering ? "entering" : ""}`}
      id="contentArea"
    >
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
                    <td style={{ color: "var(--ink3)" }}>{item.project}</td>
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
                  {projectTasks.filter((task) => task.status === "done").length}{" "}
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
                              (member) => member._id === task.assignedTo,
                            );
                            const taskSubtasks = task.subtasks || [];
                            const doneSubtasks = taskSubtasks.filter(
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
                                  {taskSubtasks.length ? (
                                    <span className="tc-sc">
                                      {doneSubtasks}/{taskSubtasks.length}
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
                                    <option value="member">Member</option>
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
                            <div className="empty-t">No members yet.</div>
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
                          background: NC_COLORS[index % NC_COLORS.length],
                        }}
                      />
                      <div className="nc-t">{note.title}</div>
                      <div className="nc-b" style={{ whiteSpace: "pre-line" }}>
                        {note.content}
                      </div>
                      <div className="nc-f">
                        <span className="nc-d">{fmtDate(note.createdAt)}</span>
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
                    const taskSubtasks = task.subtasks || [];
                    const doneSubtasks = taskSubtasks.filter(
                      (subtask) => subtask.isCompleted,
                    ).length;

                    return (
                      <tr key={task._id}>
                        <td style={{ fontWeight: 500 }}>{task.title}</td>
                        <td style={{ color: "var(--ink3)" }}>
                          {project ? `${project.emoji} ${project.name}` : "—"}
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
                          {doneSubtasks}/{taskSubtasks.length}
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
                        (projectMember) => projectMember.u === member._id,
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
              <div className="hl">API server — all systems operational</div>
              <div className="hs">GET /api/v1/healthcheck · v1.0.0 · ~12ms</div>
            </div>
            <span className="badge b-green" style={{ marginLeft: "auto" }}>
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
              <div className="sc-n" style={{ fontSize: 24 }} id="epCount">
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
                        <span style={{ color: "var(--ink4)", fontSize: 12 }}>
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
                  <div style={{ fontWeight: 700, fontSize: 14 }} id="prN">
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
  );
}
