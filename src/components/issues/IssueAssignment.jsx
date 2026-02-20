import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchProjectMembers } from '../../services/members.service';
import useIssueAssignment from '../../hooks/useIssueAssignment';
import '../../styles/components/IssueAssignment.css';

const IssueAssignment = ({ issue, projectId, onAssignmentChange }) => {
  const [members, setMembers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMembers, setLoadingMembers] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const { assignTo, unassign, isUpdating, error } = useIssueAssignment(
    issue,
    onAssignmentChange
  );

  const loadMembers = useCallback(async () => {
    if (!projectId || members.length > 0) return;
    setLoadingMembers(true);
    try {
      const data = await fetchProjectMembers(projectId);
      const activeMembers = data.filter(
        (m) => m.is_user_active && m.user !== null
      );
      setMembers(activeMembers);
    } catch (err) {
      console.error('Failed to load project members:', err);
    } finally {
      setLoadingMembers(false);
    }
  }, [projectId, members.length]);

  const handleToggleDropdown = useCallback(() => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen) {
      loadMembers();
      setSearchQuery('');
    }
  }, [isOpen, loadMembers]);

  const handleAssign = useCallback(
    async (userId) => {
      setIsOpen(false);
      await assignTo(userId);
    },
    [assignTo]
  );

  const handleUnassign = useCallback(async () => {
    setIsOpen(false);
    await unassign();
  }, [unassign]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredMembers = members.filter((member) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = (member.full_name || '').toLowerCase();
    const username = (member.user_email || '').toLowerCase();
    return name.includes(query) || username.includes(query);
  });

  const assignee = issue?.assigned_to_extra_info;

  return (
    <div className="issue-assignment" ref={dropdownRef}>
      <button
        className={`assignment-trigger ${isUpdating ? 'updating' : ''}`}
        onClick={handleToggleDropdown}
        disabled={isUpdating}
        type="button"
      >
        {assignee ? (
          <span className="assignee-display">
            <img
              className="assignee-avatar"
              src={assignee.photo || '/default-avatar.png'}
              alt={assignee.full_name_display}
            />
            <span className="assignee-name">
              {assignee.full_name_display}
            </span>
          </span>
        ) : (
          <span className="unassigned-display">Unassigned</span>
        )}
      </button>

      {error && (
        <div className="assignment-error">
          Failed to update assignment
        </div>
      )}

      {isOpen && (
        <div className="assignment-dropdown">
          <div className="assignment-search">
            <input
              ref={searchInputRef}
              type="text"
              className="assignment-search-input"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ul className="assignment-members-list">
            <li>
              <button
                className={`member-option unassign-option ${!issue?.assigned_to ? 'selected' : ''}`}
                onClick={handleUnassign}
                type="button"
              >
                <span className="member-avatar-placeholder">--</span>
                <span className="member-name">Unassigned</span>
              </button>
            </li>

            {loadingMembers ? (
              <li className="members-loading">Loading members...</li>
            ) : filteredMembers.length === 0 ? (
              <li className="members-empty">No members found</li>
            ) : (
              filteredMembers.map((member) => (
                <li key={member.user}>
                  <button
                    className={`member-option ${issue?.assigned_to === member.user ? 'selected' : ''}`}
                    onClick={() => handleAssign(member.user)}
                    type="button"
                  >
                    <img
                      className="member-avatar"
                      src={member.photo || '/default-avatar.png'}
                      alt={member.full_name}
                    />
                    <span className="member-info">
                      <span className="member-name">{member.full_name}</span>
                      <span className="member-role">{member.role_name}</span>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default IssueAssignment;
