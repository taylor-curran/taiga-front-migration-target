const WikiContent = ({ wikiPage, loading }) => {
  if (loading) {
    return (
      <div className="wiki-content">
        <div className="wiki-loading">Loading wiki page...</div>
      </div>
    );
  }

  if (!wikiPage) {
    return (
      <div className="wiki-content">
        <div className="wiki-empty">
          <p>This wiki page does not exist yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wiki-content">
      <div
        className="wiki-page-content wysiwyg"
        dangerouslySetInnerHTML={{ __html: wikiPage.html }}
      />
    </div>
  );
};

export default WikiContent;
