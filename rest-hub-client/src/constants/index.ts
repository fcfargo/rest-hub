export const PROFILE_IMAGE_DEFAULT = '/layout/sidebar/profile-default.svg';

export const HTTP_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  REST_PASSWORD: '/auth/reset-password',
};

export const AUTH_EFFECT_EXCLUDED_ROUTES = Object.values(AUTH_ROUTES);

export const SESSION_STATUS = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
} as const;

export const MODAL_TYPE = {
  PASSWORD_CHANGE: 'passwordChange',
} as const;

export const ERROR_CODE = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  USER_NOD_FOUND: 'USER_NOT_FOUND',
  INVALID__PASSWORD: 'INVALID__PASSWORD',
};
