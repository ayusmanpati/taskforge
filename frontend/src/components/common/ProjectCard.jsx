import React from "react";

export function ProjectCard({ project, data, onOpen }) {
  const tasks = data.tasks.filter((task) => task.projectId === project._id);
  const projectMembers = (data.pm[project._id] || []).map((member) =>
    data.members.find((user) => user._id === member.u)
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
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
