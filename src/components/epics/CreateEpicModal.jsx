import { useState } from 'react';

const CreateEpicModal = ({ statuses, onClose, onSubmit }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(
    statuses.length > 0 ? statuses[0].id : ''
  );
  const [color, setColor] = useState('#999');
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedNote, setBlockedNote] = useState('');
  const [teamRequirement, setTeamRequirement] = useState(false);
  const [clientRequirement, setClientRequirement] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sortedStatuses = [...statuses].sort((a, b) => a.order - b.order);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        subject: subject.trim(),
        description,
        status,
        color,
        is_blocked: isBlocked,
        blocked_note: isBlocked ? blockedNote : '',
        team_requirement: teamRequirement,
        client_requirement: clientRequirement
      });
      onClose();
    } catch (err) {
      console.error('Failed to create epic:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const COLORS = [
    '#999', '#4C566A', '#D08770', '#A3BE8C', '#B48EAD',
    '#5E81AC', '#BF616A', '#EBCB8B', '#88C0D0', '#8FBCBB'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-epic-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 className="title">Create Epic</h2>
        <form onSubmit={handleSubmit}>
          <div className="subject-container">
            <div className="color-selector">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-option ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
            <div className="subject-field">
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={140}
                required
                autoFocus
              />
            </div>
          </div>

          <fieldset>
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
            >
              {sortedStatuses.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </fieldset>

          <fieldset>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </fieldset>

          <div className="settings">
            <fieldset className="team-requirement">
              <input
                type="checkbox"
                id="team-requirement"
                checked={teamRequirement}
                onChange={() => setTeamRequirement(!teamRequirement)}
              />
              <label
                htmlFor="team-requirement"
                className={`requirement ${teamRequirement ? 'active' : ''}`}
              >
                Team requirement
              </label>
            </fieldset>
            <fieldset className="client-requirement">
              <input
                type="checkbox"
                id="client-requirement"
                checked={clientRequirement}
                onChange={() => setClientRequirement(!clientRequirement)}
              />
              <label
                htmlFor="client-requirement"
                className={`requirement ${clientRequirement ? 'active' : ''}`}
              >
                Client requirement
              </label>
            </fieldset>
            <fieldset>
              <input
                type="checkbox"
                id="blocked"
                checked={isBlocked}
                onChange={() => setIsBlocked(!isBlocked)}
              />
              <label
                htmlFor="blocked"
                className={`requirement blocked ${isBlocked ? 'active' : ''}`}
              >
                Blocked
              </label>
            </fieldset>
          </div>

          {isBlocked && (
            <fieldset>
              <input
                type="text"
                placeholder="Reason for the block"
                value={blockedNote}
                onChange={(e) => setBlockedNote(e.target.value)}
                maxLength={140}
              />
            </fieldset>
          )}

          <fieldset>
            <button
              type="submit"
              className="btn-big create-epic-button"
              disabled={submitting || !subject.trim()}
            >
              {submitting ? 'Creating...' : 'Create Epic'}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default CreateEpicModal;
