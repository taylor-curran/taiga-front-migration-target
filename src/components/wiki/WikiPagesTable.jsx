import { Link } from 'react-router-dom';
import moment from 'moment';

const WikiPagesTable = ({ wikiPages = [], projectSlug, loading }) => {
  if (loading) {
    return <div className="wiki-loading">Loading wiki pages...</div>;
  }

  if (wikiPages.length === 0) {
    return (
      <div className="wiki-empty">
        <p>No wiki pages have been created yet.</p>
      </div>
    );
  }

  return (
    <section className="wiki-pages-table basic-table">
      <div className="row title">
        <div className="title-field">Title</div>
        <div className="editions-field">Editions</div>
        <div className="creator-field">Creator</div>
        <div className="created-field">Created</div>
        <div className="last-modifier-field">Last modifier</div>
        <div className="modified-field">Modified</div>
      </div>

      {wikiPages.map((page) => (
        <div key={page.id} className="row table-main">
          <div className="title-field">
            <Link to={`/project/${projectSlug}/wiki/${page.slug}`}>
              {page.slug}
            </Link>
          </div>
          <div className="editions-field">{page.editions || 0}</div>
          <div className="creator-field">
            {page.owner_extra_info && (
              <>
                {page.owner_extra_info.photo && (
                  <span className="user-avatar">
                    <img src={page.owner_extra_info.photo} alt={page.owner_extra_info.full_name_display} />
                  </span>
                )}
                <span className="user-full-name">{page.owner_extra_info.full_name_display}</span>
              </>
            )}
          </div>
          <div className="created-field">
            {moment(page.created_date).format('DD MMM YYYY HH:mm')}
          </div>
          <div className="last-modifier-field">
            {page.last_modifier_name || page.owner_extra_info?.full_name_display || '—'}
          </div>
          <div className="modified-field">
            {moment(page.modified_date).format('DD MMM YYYY HH:mm')}
          </div>
        </div>
      ))}
    </section>
  );
};

export default WikiPagesTable;
