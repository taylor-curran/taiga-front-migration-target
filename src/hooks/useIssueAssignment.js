import { useState, useCallback } from 'react';
import { updateIssueAssignment } from '../services/issues.service';

const useIssueAssignment = (issue, onAssignmentChange) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const assignTo = useCallback(async (memberId) => {
    if (!issue) return;

    const previousAssignedTo = issue.assigned_to;
    const previousAssignedToExtraInfo = issue.assigned_to_extra_info;

    setIsUpdating(true);
    setError(null);

    if (onAssignmentChange) {
      onAssignmentChange({
        ...issue,
        assigned_to: memberId,
      });
    }

    try {
      const updated = await updateIssueAssignment(issue.id, memberId, issue.version);
      if (onAssignmentChange) {
        onAssignmentChange(updated);
      }
      return updated;
    } catch (err) {
      setError(err.response?.data || err.message);
      if (onAssignmentChange) {
        onAssignmentChange({
          ...issue,
          assigned_to: previousAssignedTo,
          assigned_to_extra_info: previousAssignedToExtraInfo,
        });
      }
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [issue, onAssignmentChange]);

  const unassign = useCallback(async () => {
    return assignTo(null);
  }, [assignTo]);

  return {
    assignTo,
    unassign,
    isUpdating,
    error,
  };
};

export default useIssueAssignment;
