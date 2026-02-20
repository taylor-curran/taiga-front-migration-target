const WikiContent = ({ content, lastModified, modifiedBy }) => {
  if (!content) {
    return (
      <div className="wiki-content-empty">
        <p>This wiki page has no content yet.</p>
      </div>
    );
  }

  return (
    <div className="wiki-content">
      <div
        className="wiki-content-body"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {lastModified && (
        <div className="wiki-content-meta">
          <span className="wiki-modified-date">
            Last modified: {new Date(lastModified).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {modifiedBy && (
            <span className="wiki-modified-by">
              by {modifiedBy}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default WikiContent;
