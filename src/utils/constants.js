export const API_BASE_URL = 'https://api.taiga.io/api/v1';

export const DEFAULT_LANGUAGE = 'en';

export const DEFAULT_COLOR_LIST = [
  '#D35163', '#D351CF', '#AC51D3', '#8151D3', '#5551D3', '#5178D3', '#78D351',
  '#51D355', '#51D381', '#51D3AC', '#51CFD3', '#51A3D3', '#A3D350', '#CFD350',
  '#D3AC50', '#D38050', '#D35450', '#E44057', '#4C566A', '#70728F', '#A9AABC',
];

export const CUSTOM_FIELD_TYPES = {
  TEXT: 'text',
  MULTILINE: 'multiline',
  RICHTEXT: 'richtext',
  DATE: 'date',
  URL: 'url',
  DROPDOWN: 'dropdown',
  CHECKBOX: 'checkbox',
  NUMBER: 'number',
};

export const CUSTOM_FIELD_TYPE_CHOICES = [
  { key: CUSTOM_FIELD_TYPES.TEXT, name: 'Text' },
  { key: CUSTOM_FIELD_TYPES.MULTILINE, name: 'Multi-Line Text' },
  { key: CUSTOM_FIELD_TYPES.RICHTEXT, name: 'Rich Text' },
  { key: CUSTOM_FIELD_TYPES.DATE, name: 'Date' },
  { key: CUSTOM_FIELD_TYPES.URL, name: 'URL' },
  { key: CUSTOM_FIELD_TYPES.DROPDOWN, name: 'Dropdown' },
  { key: CUSTOM_FIELD_TYPES.CHECKBOX, name: 'Checkbox' },
  { key: CUSTOM_FIELD_TYPES.NUMBER, name: 'Number' },
];

export const NAV_URLS = {
  home: '/',
  projects: '/projects',
  error: '/error',
  'not-found': '/not-found',
  'permission-denied': '/permission-denied',
  discover: '/discover',
  'discover-search': '/discover/search',
  login: '/login',
  'forgot-password': '/forgot-password',
  'change-password': '/change-password/:token',
  'change-email': '/change-email/:token',
  'cancel-account': '/cancel-account/:token',
  register: '/register',
  invitation: '/invitation/:token',
  'create-project': '/project/new',
  'create-project-scrum': '/project/new/scrum',
  'create-project-kanban': '/project/new/kanban',
  'create-project-duplicate': '/project/new/duplicate',
  'create-project-import': '/project/new/import',
  profile: '/profile',
  'user-profile': '/profile/:username',
  'blocked-project': '/blocked-project/:project',
  project: '/project/:project',
  'project-detail-ref': '/project/:project/t/:ref',
  'project-backlog': '/project/:project/backlog',
  'project-taskboard': '/project/:project/taskboard/:sprint',
  'project-kanban': '/project/:project/kanban',
  'project-issues': '/project/:project/issues',
  'project-epics': '/project/:project/epics',
  'project-search': '/project/:project/search',
  'project-timeline': '/project/:project/timeline',
  'project-epics-detail': '/project/:project/epic/:ref',
  'project-userstories-detail': '/project/:project/us/:ref',
  'project-tasks-detail': '/project/:project/task/:ref',
  'project-issues-detail': '/project/:project/issue/:ref',
  'project-wiki': '/project/:project/wiki',
  'project-wiki-list': '/project/:project/wiki-list',
  'project-wiki-page': '/project/:project/wiki/:slug',
  'project-team': '/project/:project/team',
  'project-admin-home': '/project/:project/admin/project-profile/details',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh',
  USER_INFO: 'userInfo',
  LANG: 'lang',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

export const PROJECT_TYPES = {
  SCRUM: 'scrum',
  KANBAN: 'kanban',
};

export const NOTIFY_LEVELS = {
  INVOLVED: 1,
  ALL: 2,
  NONE: 3,
};
