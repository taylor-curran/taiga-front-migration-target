import moment from 'moment';

const WikiSummary = ({ wikiPage }) => {
  if (!wikiPage || !wikiPage.id) {
    return null;
  }

  const lastModifiedDate = moment(wikiPage.modified_date).format('DD MMM YYYY HH:mm');
  const totalEditions = wikiPage.editions || 0;
  const modifierName = wikiPage.last_modifier_name || wikiPage.owner_extra_info?.full_name_display || 'Unknown';
  const modifierPhoto = wikiPage.last_modifier_photo || wikiPage.owner_extra_info?.photo || '';

  return (
    <div className="wiki-summary summary">
      <div className="wiki-username-edition">
        <div className="avatar">
          {modifierPhoto && (
            <img src={modifierPhoto} alt={modifierName} />
          )}
        </div>
        <div className="wiki-user-modification">
          <span className="description">Last modification</span>
          <span className="username">{modifierName}</span>
        </div>
      </div>

      <div className="wiki-last-modified">
        <span className="number">{lastModifiedDate}</span>
        <span className="description">last edit</span>
      </div>

      <div className="wiki-times-edited">
        <span className="number">{totalEditions}</span>
        <span className="description">times edited</span>
      </div>
    </div>
  );
};

export default WikiSummary;
