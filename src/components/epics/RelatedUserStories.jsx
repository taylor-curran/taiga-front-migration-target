import { Link } from 'react-router-dom';

const RelatedUserStories = ({ stories, projectSlug, showClosed }) => {
  const filtered = showClosed
    ? stories
    : stories.filter((s) => !s.is_closed);

  if (filtered.length === 0) {
    return <div className="no-stories">No related user stories</div>;
  }

  return (
    <div className="related-user-stories">
      {filtered.map((story) => (
        <div
          key={story.id || story.user_story}
          className={`story-row ${story.is_closed ? 'is-closed' : ''}`}
        >
          <Link
            to={`/project/${projectSlug}/us/${story.ref || story.user_story}`}
            className="story-link"
          >
            <span className="story-ref">
              #{story.ref || story.user_story}
            </span>
            <span className="story-subject">
              {story.subject || `User Story #${story.user_story}`}
            </span>
          </Link>
          {story.status_extra_info && (
            <span
              className="story-status"
              style={{ color: story.status_extra_info.color }}
            >
              {story.status_extra_info.name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default RelatedUserStories;
