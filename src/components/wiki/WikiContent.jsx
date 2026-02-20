import DOMPurify from 'dompurify';

const WikiContent = ({ content, loading }) => {
  if (loading) {
    return <div className="wiki-content-loading">Loading wiki content...</div>;
  }

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
        className="wiki-content-body wysiwyg"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      />
    </div>
  );
};

export default WikiContent;
