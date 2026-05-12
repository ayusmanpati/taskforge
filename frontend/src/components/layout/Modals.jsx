import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { X, Check } from 'lucide-react';
import { roleLabel, fmtDate } from '../../utils/helpers.js';
import { EMOJIS } from '../../constants.js';

export function Modals() {
  const {
    modal, setModal, projectDraft, setProjectDraft, saveProject, editingProjectId,
    deleteCurrentProject, taskDraft, setTaskDraft, memberOptions, saveTask,
    activeTask, detailTaskProject, detailTaskAssignee, openSubtaskModal,
    deleteTask, subtaskTitle, setSubtaskTitle, saveSubtask, deleteSubtask,
    memberDraft, setMemberDraft, data, addMember, updateMemberRole, removeMember,
    noteDraft, setNoteDraft, saveNote, activeProject, currentUser,
    toggleSubtask, updateTaskStatus, taskProjectId, activeProjectId
  } = useApp();

  // Helper to close modals
  const closeModal = () => setModal(null);

  // We render all modals, but only give the 'open' class to the active one
  return (
    <>
      {/* ── PROJECT MODAL ── */}
      <div className={`mo ${modal === 'project' ? 'open' : ''}`} onClick={closeModal}>
        <div className="md" onClick={(e) => e.stopPropagation()}>
          <div className="mh">
            <span id="mPjT">{editingProjectId ? "Edit project" : "New project"}</span>
          </div>
          <div className="mb">
            <div className="fg">
              <label className="fl">Project name</label>
              <input
                className="fi"
                type="text"
                placeholder="e.g. Website Redesign"
                value={projectDraft?.name || ''}
                onChange={(e) => setProjectDraft({ ...projectDraft, name: e.target.value })}
              />
            </div>
            <div className="fg">
              <label className="fl">Description</label>
              <textarea
                className="fi"
                rows={2}
                placeholder="Briefly describe the goal..."
                value={projectDraft?.description || ''}
                onChange={(e) => setProjectDraft({ ...projectDraft, description: e.target.value })}
              />
            </div>
            <div className="fg">
              <label className="fl">Icon</label>
              <div className="epick" id="epick" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {EMOJIS.map((e) => (
                  <div
                    key={e}
                    className={`epi ${e === projectDraft?.emoji ? "sel" : ""}`}
                    onClick={() => setProjectDraft({ ...projectDraft, emoji: e })}
                    style={{
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '8px',
                      background: e === projectDraft?.emoji ? 'var(--surface2)' : 'transparent',
                      transform: e === projectDraft?.emoji ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-g" onClick={closeModal}>Cancel</button>
            <button className="btn btn-p" onClick={saveProject}>
              {editingProjectId ? "Save changes" : "Create project"}
            </button>
          </div>
        </div>
      </div>

      {/* ── TASK MODAL (Create) ── */}
      <div className={`mo ${modal === 'task' ? 'open' : ''}`} onClick={closeModal}>
        <div className="md" onClick={(e) => e.stopPropagation()}>
          <div className="mh">
            <span>New task</span>
          </div>
          <div className="mb">
            <div className="fg">
              <label className="fl">Task title</label>
              <input
                className="fi"
                type="text"
                placeholder="e.g. Update user profile schema"
                value={taskDraft?.title || ''}
                onChange={(e) => setTaskDraft({ ...taskDraft, title: e.target.value })}
              />
            </div>
            <div className="fg">
              <label className="fl">Description</label>
              <textarea
                className="fi"
                rows={2}
                placeholder="Add more details..."
                value={taskDraft?.description || ''}
                onChange={(e) => setTaskDraft({ ...taskDraft, description: e.target.value })}
              />
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div className="fg" style={{ flex: 1 }}>
                <label className="fl">Status</label>
                <select
                  className="fi"
                  value={taskDraft?.status || 'todo'}
                  onChange={(e) => setTaskDraft({ ...taskDraft, status: e.target.value })}
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="fg" style={{ flex: 1 }}>
                <label className="fl">Assignee</label>
                <select
                  className="fi"
                  value={taskDraft?.assignedTo || ''}
                  onChange={(e) => setTaskDraft({ ...taskDraft, assignedTo: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {memberOptions?.map((m) => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-g" onClick={closeModal}>Cancel</button>
            <button className="btn btn-p" onClick={saveTask}>Create task</button>
          </div>
        </div>
      </div>

      {/* ── TASK DETAIL MODAL ── */}
      <div className={`mo ${modal === 'task-detail' ? 'open' : ''}`} onClick={closeModal}>
        <div className="md lg" onClick={(e) => e.stopPropagation()}>
          {activeTask && (
            <>
              <div className="mh" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600' }}>{activeTask.title}</span>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink3)' }}>
                  <X size={18} />
                </button>
              </div>
              <div className="mb" style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 2 }}>
                  <div style={{ color: 'var(--ink3)', fontSize: '13px', marginBottom: '16px' }}>
                    in project <span style={{ fontWeight: 500, color: 'var(--ink1)' }}>{detailTaskProject ? `${detailTaskProject.emoji} ${detailTaskProject.name}` : ''}</span>
                  </div>
                  <div style={{ marginBottom: '24px', fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                    {activeTask.description || "No description provided."}
                  </div>
                  
                  <div className="sh" style={{ marginTop: '24px', marginBottom: '12px' }}>
                    <span className="sh-t">Subtasks</span>
                    <button className="btn btn-b" style={{ fontSize: '12px' }} onClick={openSubtaskModal}>+ Add</button>
                  </div>
                  
                  <div className="subtasks-list">
                    {activeTask.subtasks && activeTask.subtasks.length > 0 ? (
                      activeTask.subtasks.map(st => (
                        <div key={st._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                          <input 
                            type="checkbox" 
                            checked={st.isCompleted} 
                            onChange={() => toggleSubtask(activeTask._id, st._id)} 
                            style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
                          />
                          <span style={{ flex: 1, fontSize: '14px', textDecoration: st.isCompleted ? 'line-through' : 'none', color: st.isCompleted ? 'var(--ink4)' : 'var(--ink1)' }}>{st.title}</span>
                          <button onClick={() => deleteSubtask(activeTask._id, st._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink4)' }} onMouseEnter={e => e.currentTarget.style.color='var(--red)'} onMouseLeave={e => e.currentTarget.style.color='var(--ink4)'}>
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div style={{ color: "var(--ink3)", fontSize: "13px", textAlign: "center", padding: "16px 0" }}>No subtasks yet.</div>
                    )}
                  </div>
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--ink3)', marginBottom: '6px' }}>Status</label>
                    <select 
                      className="fi" 
                      value={activeTask.status} 
                      onChange={(e) => updateTaskStatus(activeTask._id, e.target.value)}
                    >
                      <option value="todo">Todo</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--ink3)', marginBottom: '6px' }}>Assignee</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--surface2)', borderRadius: '6px', fontSize: '13px' }}>
                      {detailTaskAssignee ? (
                        <><div className="u-av" style={{ width: '24px', height: '24px', fontSize: '10px' }}>{detailTaskAssignee.initials}</div> {detailTaskAssignee.name}</>
                      ) : (
                        <span style={{ color: 'var(--ink4)' }}>Unassigned</span>
                      )}
                    </div>
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                    <button className="btn btn-g" style={{ width: '100%', color: 'var(--red)', borderColor: 'var(--red-br)' }} onClick={deleteTask}>
                      Delete task
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── SUBTASK MODAL ── */}
      <div className={`mo ${modal === 'subtask' ? 'open' : ''}`} onClick={() => setModal('task-detail')}>
        <div className="md" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
          <div className="mh">
            <span>Add subtask</span>
          </div>
          <div className="mb">
            <div className="fg">
              <label className="fl">Subtask title</label>
              <input
                className="fi"
                type="text"
                placeholder="What needs to be done?"
                value={subtaskTitle || ''}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === 'Enter') saveSubtask();
                }}
              />
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-g" onClick={() => setModal('task-detail')}>Cancel</button>
            <button className="btn btn-p" onClick={saveSubtask}>Add</button>
          </div>
        </div>
      </div>

      {/* ── MEMBER MODAL ── */}
      <div className={`mo ${modal === 'member' ? 'open' : ''}`} onClick={closeModal}>
        <div className="md" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
          <div className="mh">
            <span>Add member</span>
          </div>
          <div className="mb">
            <div className="fg">
              <label className="fl">Email address</label>
              <input
                className="fi"
                type="email"
                placeholder="colleague@camp.dev"
                value={memberDraft?.email || ''}
                onChange={(e) => setMemberDraft({ ...memberDraft, email: e.target.value })}
              />
            </div>
            <div className="fg">
              <label className="fl">Role</label>
              <select
                className="fi"
                value={memberDraft?.role || 'member'}
                onChange={(e) => setMemberDraft({ ...memberDraft, role: e.target.value })}
              >
                <option value="member">Member</option>
                <option value="project_admin">Project Admin</option>
              </select>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-g" onClick={closeModal}>Cancel</button>
            <button className="btn btn-p" onClick={addMember}>Add to project</button>
          </div>
        </div>
      </div>

      {/* ── NOTE MODAL ── */}
      <div className={`mo ${modal === 'note' ? 'open' : ''}`} onClick={closeModal}>
        <div className="md lg" onClick={(e) => e.stopPropagation()}>
          <div className="mh">
            <span>{noteDraft?.title && noteDraft.title !== '' ? "Edit note" : "New note"}</span>
          </div>
          <div className="mb">
            <div className="fg">
              <label className="fl">Note title</label>
              <input
                className="fi"
                type="text"
                placeholder="e.g. API Guidelines"
                value={noteDraft?.title || ''}
                onChange={(e) => setNoteDraft({ ...noteDraft, title: e.target.value })}
              />
            </div>
            <div className="fg" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label className="fl">Content</label>
              <textarea
                className="fi"
                style={{ flex: 1, minHeight: '200px', resize: 'vertical' }}
                placeholder="Write your documentation here..."
                value={noteDraft?.content || ''}
                onChange={(e) => setNoteDraft({ ...noteDraft, content: e.target.value })}
              />
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-g" onClick={closeModal}>Cancel</button>
            <button className="btn btn-p" onClick={saveNote}>Save note</button>
          </div>
        </div>
      </div>

    </>
  );
}
