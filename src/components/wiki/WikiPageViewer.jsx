import WikiContent from './WikiContent';

const WikiPageViewer = ({ wiki, loading }) => {
  if (loading) {
    return (
      <div className="wiki-viewer-loading">
        Loading wiki page...
      </div>
    );
  }

  if (!wiki) {
    return (
      <div className="wiki-viewer-empty">
        <h2>Page not found</h2>
        <p>This wiki page does not exist yet.</p>
      </div>
    );
  }

  return (
    <div className="wiki-page-viewer">
      <div className="wiki-summary">
        <span className="wiki-editions">
          {wiki.editions || 0} editions
        </span>
        {wiki.owner_extra_info && (
          <span className="wiki-creator">
            Created by {wiki.owner_extra_info.full_name_display || wiki.owner_extra_info.username}
          </span>
        )}
      </div>
      <WikiContent
        content={wiki.html}
        lastModified={wiki.modified_date}
        modifiedBy={wiki.last_modifier_extra_info?.full_name_display}
      />
    </div>
  );
};

export default WikiPageViewer;
