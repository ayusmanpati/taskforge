import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { FileText, Search, MoreVertical } from 'lucide-react';
import { roleLabel } from '../../utils/helpers.js';

export function Modals() {
  const {
    modal, setModal, projectDraft, setProjectDraft, saveProject, editingProjectId,
    deleteCurrentProject, taskDraft, setTaskDraft, memberOptions, saveTask,
    activeTask, detailTaskProject, detailTaskAssignee, openSubtaskModal,
    deleteTask, subtaskTitle, setSubtaskTitle, saveSubtask, deleteSubtask,
    memberDraft, setMemberDraft, data, addMember, updateMemberRole, removeMember,
    noteDraft, setNoteDraft, saveNote, activeProject
  } = useApp();

  return (
    <>

    </>
  );
}
