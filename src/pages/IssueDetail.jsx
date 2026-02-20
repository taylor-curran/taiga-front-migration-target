import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import {
  fetchProjectBySlug,
  fetchIssueByRef,
  fetchIssueTypes,
  fetchSeverities,
  fetchPriorities,
  fetchIssueStatuses,
} from '../services/issues.service';
import IssueDetailSidebar from '../components/issues/IssueDetailSidebar';
import '../styles/pages/IssueDetail.css';

const IssueDetail = () => {
  const { slug, ref } = useParams();
  const [project, setProject] = useState(null);
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [issueTypes, setIssueTypes] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const proj = await fetchProjectBySlug(slug);
        setProject(proj);

        const [issueData, types, sevs, pris, stats] = await Promise.all([
          fetchIssueByRef(proj.id, ref),
          fetchIssueTypes(proj.id),
          fetchSeverities(proj.id),
          fetchPriorities(proj.id),
          fetchIssueStatuses(proj.id),
        ]);

        setIssue(issueData);
        setIssueTypes(types);
        setSeverities(sevs);
        setPriorities(pris);
        setStatuses(stats);
      } catch (err) {
        setError('Failed to load issue');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug, ref]);

  if (loading) {
    return (
      <div className="issue-detail-page">
        <div className="issue-detail-loading">Loading issue...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="issue-detail-page">
        <div className="issue-detail-error">{error}</div>
      </div>
    );
  }

  if (!issue) return null;

  return (
    <div className="issue-detail-page">
      <div className="issue-detail-main">
        <div className="detail-header-container">
          <nav className="detail-nav">
            <Link to={`/project/${slug}/issues`} className="back-link">
              Back to issues
            </Link>
          </nav>

          <div className="detail-header">
            <h1 className="detail-title">
              <span className="detail-ref">#{issue.ref}</span>
              {issue.subject}
            </h1>

            {issue.tags && issue.tags.length > 0 && (
              <div className="detail-tags">
                {issue.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="detail-tag"
                    style={{ backgroundColor: tag[1] || '#ccc' }}
                  >
                    {tag[0]}
                  </span>
                ))}
              </div>
            )}

            <div className="detail-meta">
              <span className="detail-created">
                Created by{' '}
                <strong>{issue.owner_extra_info ? issue.owner_extra_info.full_name_display : 'Unknown'}</strong>
                {' '}on {moment(issue.created_date).format('DD MMM YYYY')}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-content">
            <section className="detail-description">
              <h3>Description</h3>
              {issue.description_html ? (
                <div
                  className="description-content"
                  dangerouslySetInnerHTML={{ __html: issue.description_html }}
                />
              ) : issue.description ? (
                <p className="description-content">{issue.description}</p>
              ) : (
                <p className="description-empty">No description provided</p>
              )}
            </section>

            {issue.attachments && issue.attachments.length > 0 && (
              <section className="detail-attachments">
                <h3>Attachments ({issue.attachments.length})</h3>
                <ul className="attachments-list">
                  {issue.attachments.map((att) => (
                    <li key={att.id} className="attachment-item">
                      <a href={att.url} target="_blank" rel="noopener noreferrer">
                        {att.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <IssueDetailSidebar
            issue={issue}
            issueTypes={issueTypes}
            severities={severities}
            priorities={priorities}
            statuses={statuses}
          />
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
