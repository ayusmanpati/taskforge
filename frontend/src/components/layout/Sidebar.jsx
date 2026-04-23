import React from 'react';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { LogoMark } from '../common/LogoMark.jsx';
import { roleLabel } from '../../utils/helpers.js';

export function Sidebar() {
  const {
    currentUser, isAppEntering, activeView, navigate, data,
    activeProjectId, openProject, sidebarTaskCount
  } = useApp();

  return (
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
  );
}
