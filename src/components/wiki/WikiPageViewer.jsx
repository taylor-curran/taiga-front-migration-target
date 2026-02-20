import moment from 'moment';
import WikiContent from './WikiContent';

const WikiPageViewer = ({ wiki, loading }) => {
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
        <h2 className="wiki-page-title">{wiki.slug}</h2>
        <div className="wiki-page-meta">
          {wiki.editions !== undefined && (
            <span className="wiki-editions">
              {wiki.editions} {wiki.editions === 1 ? 'edition' : 'editions'}
            </span>
          )}
          {wiki.modified_date && (
            <span className="wiki-modified">
              Last modified: {moment(wiki.modified_date).format('MMM D, YYYY')}
            </span>
          )}
        </div>
      </div>
      <WikiContent content={wiki.html || wiki.content} loading={false} />
    </div>
  );
};

export default WikiPageViewer;
