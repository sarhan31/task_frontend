export const getTaskAssigneeLabel = (task) => {
  if (!task) return 'Unassigned';

  if (task.assignee && task.assignee !== 'Unassigned') {
    return task.assignee;
  }

  if (task.assignedToName && task.assignedToName !== 'Unassigned') {
    return task.assignedToName;
  }

  if (task.assignedTo) {
    if (typeof task.assignedTo === 'object') {
      return task.assignedTo.name || task.assignedTo.email || 'Assigned User';
    }
    return 'Assigned User';
  }

  if (task.assignedToTeam || task.assignedToTeamName) {
    const teamName =
      task.assignedToTeamName ||
      (typeof task.assignedToTeam === 'object' ? task.assignedToTeam.teamName : '') ||
      'Team';

    if (task.assignedType === 'team_member' && task.responsibleUser) {
      const ownerName =
        task.responsibleUserName ||
        (typeof task.responsibleUser === 'object' ? task.responsibleUser.name : '') ||
        'Team Member';
      return `${ownerName} (${teamName})`;
    }

    return teamName;
  }

  if (task.assignedToAll) {
    return 'All Members';
  }

  return 'Unassigned';
};
