import moment from 'moment';
import WikiContent from './WikiContent';

const WikiPageViewer = ({ wiki, loading }) => {
  const lastModifier = wiki?.last_modifier_extra_info || wiki?.owner_extra_info;
  const lastModifierName = lastModifier?.full_name_display || lastModifier?.username;
  const lastModifierPhoto = lastModifier?.photo;

  const modifiedLabel = wiki?.modified_date
    ? `Last modified${lastModifierName ? ` by ${lastModifierName}` : ''}: ${moment(wiki.modified_date).format('MMM D, YYYY HH:mm')}`
    : null;

  if (loading) {
    return (
      <div className="wiki-page-viewer loading">
        <p>Loading wiki page...</p>
      </div>
    );
  }

  if (!wiki) {
    return (
      <div className="wiki-page-viewer empty">
        <h2>Page not found</h2>
        <p>This wiki page does not exist yet.</p>
      </div>
    );
  }

  return (
    <div className="wiki-page-viewer">
      <div className="wiki-page-header">
        <h2 className="wiki-page-title">{wiki.subject || wiki.slug}</h2>
        <div className="wiki-page-meta">
          {lastModifierPhoto && (
            <img
              className="meta-avatar"
              src={lastModifierPhoto}
              alt={lastModifierName || 'User'}
            />
          )}
          {wiki.modified_date && (
            <span className="wiki-modified">
              Last modified{lastModifierName ? ` by ${lastModifierName}` : ''}:{' '}
              {moment(wiki.modified_date).format('MMM D, YYYY HH:mm')}
            </span>
          )}
          {wiki.editions !== undefined && (
            <span className="wiki-editions">
              {wiki.editions} {wiki.editions === 1 ? 'edition' : 'editions'}
            </span>
          )}
        </div>
      </div>
      <WikiContent content={wiki.html || wiki.content} loading={false} />
      <div className="wiki-activity">
        <div className="wiki-activity-title">Activity</div>
        <div className="wiki-content-empty">Activity feed not yet implemented.</div>
      </div>
    </div>
  );
};

export default WikiPageViewer;
