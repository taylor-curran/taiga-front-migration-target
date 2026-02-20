import { useState, useEffect, useCallback } from 'react';
import { fetchProjectBySlug, updateProject } from '../../services/admin.service';

const modulesList = [
  {
    key: 'is_epics_activated',
    name: 'Epics',
    description: 'Track large features that span multiple user stories.',
  },
  {
    key: 'is_backlog_activated',
    name: 'Scrum',
    description: 'Use the backlog and sprints for agile project management.',
  },
  {
    key: 'is_kanban_activated',
    name: 'Kanban',
    description: 'Visualize workflow with a Kanban board.',
  },
  {
    key: 'is_wiki_activated',
    name: 'Wiki',
    description: 'Collaborative documentation for your project.',
  },
  {
    key: 'is_issues_activated',
    name: 'Issues',
    description: 'Track bugs, questions, and enhancements.',
  },
];

const videoconferenceOptions = [
  { value: '', label: 'No videoconference' },
  { value: 'talky', label: 'Talky' },
  { value: 'jitsi', label: 'Jitsi' },
  { value: 'custom', label: 'Custom' },
];

const Modules = ({ slug }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [videoconferences, setVideoconferences] = useState('');
  const [videoconferencesExtraData, setVideoconferencesExtraData] = useState('');

  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProjectBySlug(slug);
      setProject(data);
      const moduleState = {};
      modulesList.forEach((mod) => {
        moduleState[mod.key] = data[mod.key] || false;
      });
      setFormData(moduleState);
      setVideoconferences(data.videoconferences || '');
      setVideoconferencesExtraData(data.videoconferences_extra_data || '');
    } catch (err) {
      setError('Failed to load project modules.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleModuleToggle = async (key) => {
    const newValue = !formData[key];
    const newFormData = { ...formData, [key]: newValue };
    setFormData(newFormData);

    try {
      setSaving(true);
      setError(null);
      await updateProject(project.id, { [key]: newValue });
      setSuccessMsg('Module updated.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setFormData((prev) => ({ ...prev, [key]: !newValue }));
      setError('Failed to update module.');
    } finally {
      setSaving(false);
    }
  };

  const handleVideoconferenceSave = async (e) => {
    e.preventDefault();
    if (!project) return;
    try {
      setSaving(true);
      setError(null);
      await updateProject(project.id, {
        videoconferences: videoconferences || null,
        videoconferences_extra_data: videoconferencesExtraData,
      });
      setSuccessMsg('Videoconference settings saved.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to save videoconference settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading modules...</div>;
  }

  return (
    <div className="admin-section admin-modules">
      <div className="admin-section-header">
        <h2>Modules</h2>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {successMsg && <div className="admin-alert admin-alert-success">{successMsg}</div>}

      <div className="modules-list">
        {modulesList.map((mod) => (
          <div key={mod.key} className="module-item">
            <div className="module-info">
              <h3 className="module-name">{mod.name}</h3>
              <p className="module-description">{mod.description}</p>
            </div>
            <div className="module-toggle">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData[mod.key] || false}
                  onChange={() => handleModuleToggle(mod.key)}
                  disabled={saving}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="videoconference-section">
        <h3>Videoconference</h3>
        <form onSubmit={handleVideoconferenceSave}>
          <div className="form-group">
            <label htmlFor="videoconference-system">Videoconference system</label>
            <select
              id="videoconference-system"
              value={videoconferences}
              onChange={(e) => {
                setVideoconferences(e.target.value);
                setVideoconferencesExtraData('');
              }}
            >
              {videoconferenceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {videoconferences && (
            <div className="form-group">
              <label htmlFor="videoconference-extra">
                {videoconferences === 'custom' ? 'Custom URL prefix' : 'Room prefix'}
              </label>
              <input
                type="text"
                id="videoconference-extra"
                value={videoconferencesExtraData}
                onChange={(e) => setVideoconferencesExtraData(e.target.value)}
                placeholder={videoconferences === 'custom' ? 'https://...' : 'Room prefix'}
              />
            </div>
          )}

          <button type="submit" className="btn-small btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modules;
